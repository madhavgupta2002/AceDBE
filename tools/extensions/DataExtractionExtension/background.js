// ============================================
// IIMBx Transcript Downloader — background.js
// MV3 Service Worker with Multi-Course Unified JSON
// ============================================

'use strict';

const FETCH_CONCURRENCY = 5;
const OUTLINE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let state = null;
let stateReady = null;
let activeRunPromise = null;
let accumulatedCourses = [];

function createDefaultState() {
    return {
        stats: { total: 0, completed: 0, errors: 0 },
        cursor: {
            courseName: '',
            sectionName: '',
            unitTitle: ''
        },
        activeDownloads: {},
        stopRequested: false,
        isCrawling: false,
        isRunning: false,
        queueInProgress: false,
        pendingCourses: [],
        currentCourseIndex: 0
    };
}

function hydrateState(savedState) {
    const defaults = createDefaultState();
    return {
        ...defaults,
        ...savedState,
        stats: { ...defaults.stats, ...(savedState?.stats || {}) },
        cursor: { ...defaults.cursor, ...(savedState?.cursor || {}) },
        activeDownloads: savedState?.activeDownloads ? { ...savedState.activeDownloads } : {},
        pendingCourses: Array.isArray(savedState?.pendingCourses) ? [...savedState.pendingCourses] : []
    };
}

async function loadState() {
    const data = await chrome.storage.local.get('downloadState');
    state = hydrateState(data.downloadState);

    if (state.queueInProgress && state.pendingCourses.length > 0) {
        state.stopRequested = false;
        startRun(state.pendingCourses, state.currentCourseIndex);
    }
}

async function ensureStateLoaded() {
    if (state === null) await stateReady;
}

let writeQueue = Promise.resolve();
function saveState() {
    writeQueue = writeQueue.then(async () => {
        await chrome.storage.local.set({ downloadState: state });
    });
    return writeQueue;
}

stateReady = loadState();

// ---- Helpers and Sanitisers ----

function sanitizeFilename(name) {
    return name
        .replace(/[<>:"/\\|?*]/g, '_')
        .replace(/\s+/g, ' ')
        .replace(/\.+$/g, '')
        .trim();
}

function decodeHtmlEntities(value) {
    return (value || '')
        .replace(/&amp;/g, '&')
        .replace(/&#38;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#34;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

function stripTags(value) {
    return decodeHtmlEntities((value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function cleanHtmlToText(htmlContent) {
    return decodeHtmlEntities(htmlContent)
        .replace(/{"xmodule-type": "HTMLModule"}/g, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\n\s*\n+/g, '\n\n')
        .trim();
}

// ---- Progress Broadcasting ----

function buildProgressSnapshot(status) {
    const effectiveStatus = status || (
        state.stopRequested && !state.isRunning && !state.isCrawling ? 'stopped' : null
    );
    const activeLength = Object.keys(state.activeDownloads).length;
    const isComplete = !state.isRunning
        && !state.isCrawling
        && activeLength === 0
        && state.stats.total > 0;

    return {
        type: 'PROGRESS_UPDATE',
        status: effectiveStatus || (isComplete ? 'complete' : (state.isRunning ? 'downloading' : 'idle')),
        isRunning: state.isRunning,
        courseName: state.cursor.courseName || '',
        sectionName: state.cursor.sectionName || '',
        unitTitle: state.cursor.unitTitle || '',
        percent: state.stats.total > 0
            ? Math.round((state.stats.completed / state.stats.total) * 100) : 0,
        activeDownloads: activeLength
    };
}

function broadcastProgress(status) {
    chrome.runtime.sendMessage(buildProgressSnapshot(status)).catch(() => { });
}

// ---- URL Helpers ----

function extractVerticalBlockPath(value) {
    return value?.match(/block-v1:[^/?#]+type@vertical\+block@[A-Za-z0-9]+/)?.[0] || '';
}

function buildXblockUrl(unitUrl) {
    const verticalBlockPath = extractVerticalBlockPath(unitUrl);
    if (!verticalBlockPath) return '';
    const url = new URL(`https://iimbx.edu.in/xblock/${verticalBlockPath}`);
    url.searchParams.set('exam_access', '');
    url.searchParams.set('jumpToId', '');
    url.searchParams.set('recheck_access', '1');
    url.searchParams.set('show_bookmark', '0');
    url.searchParams.set('show_title', '0');
    url.searchParams.set('view', 'student_view');
    return url.toString();
}

// ---- Single JSON Download Handler ----

function downloadDataPayload(content, filename) {
    const base64Data = btoa(unescape(encodeURIComponent(content)));
    const dataUrl = `data:application/json;base64,${base64Data}`;

    state.stats.total = 100;
    state.stats.completed = 99;
    saveState();
    broadcastProgress('downloading');

    chrome.downloads.download({
        url: dataUrl,
        filename: filename,
        conflictAction: 'overwrite',
        saveAs: false
    }, (downloadId) => {
        if (chrome.runtime.lastError) {
            console.error('[BG] JSON download error:', chrome.runtime.lastError.message);
            state.isRunning = false;
            saveState();
            broadcastProgress('error');
        } else if (downloadId) {
            state.activeDownloads[downloadId] = { url: dataUrl, savePath: filename };
            saveState();
            broadcastProgress('downloading');
        }
    });
}

function checkAllComplete() {
    if (!state.isCrawling && Object.keys(state.activeDownloads).length === 0) {
        state.isRunning = false;
        saveState();
        broadcastProgress('complete');
    }
}

chrome.downloads.onChanged.addListener(async (delta) => {
    await ensureStateLoaded();
    const entry = state.activeDownloads[delta.id];
    if (!entry) return;

    if (delta.state && delta.state.current === 'complete') {
        state.stats.completed = state.stats.total;
        delete state.activeDownloads[delta.id];
        await saveState();
        checkAllComplete();
    }
});

// ---- API Layer ----

let cachedUsername = null;

async function fetchUsername(courseId) {
    if (cachedUsername) return cachedUsername;
    try {
        const url = `https://iimbx.edu.in/api/learning_sequences/v1/course_outline/${courseId}`;
        const response = await fetch(url, { credentials: 'include', cache: 'no-store' });
        if (!response.ok) return null;
        const data = await response.json();
        if (data.username) {
            cachedUsername = data.username;
        }
        return cachedUsername;
    } catch (e) {
        return null;
    }
}

async function fetchCourseBlocks(courseId, username) {
    const params = new URLSearchParams({
        course_id: courseId,
        username,
        depth: 'all',
        requested_fields: 'display_name,children,type,student_view_url'
    });
    try {
        const response = await fetch(`https://iimbx.edu.in/api/courses/v2/blocks/?${params}`, {
            credentials: 'include',
            cache: 'no-store'
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        return null;
    }
}

function flattenBlocksToUnits(blocksResponse) {
    if (!blocksResponse?.blocks || !blocksResponse?.root) return [];
    const blocks = blocksResponse.blocks;
    const root = blocks[blocksResponse.root];
    if (!root) return [];

    const units = [];
    for (const chapterId of (root.children || [])) {
        const chapter = blocks[chapterId];
        if (!chapter || chapter.type !== 'chapter') continue;
        const chapterTitle = chapter.display_name || '';

        for (const sequentialId of (chapter.children || [])) {
            const sequential = blocks[sequentialId];
            if (!sequential || sequential.type !== 'sequential') continue;
            const sequentialTitle = sequential.display_name || '';

            for (const verticalId of (sequential.children || [])) {
                const vertical = blocks[verticalId];
                if (!vertical || vertical.type !== 'vertical') continue;
                units.push({
                    chapterTitle,
                    sequentialTitle,
                    unitTitle: vertical.display_name || '',
                    unitUrl: vertical.student_view_url || vertical.lms_web_url || vertical.id || ''
                });
            }
        }
    }
    return units;
}

async function fetchDashboardCourses() {
    try {
        const response = await fetch('https://iimbx.edu.in/api/learner_home/init/', {
            credentials: 'include',
            cache: 'no-store'
        });
        if (response.status === 401 || response.status === 403) {
            return { ok: false, reason: 'not_logged_in' };
        }
        const data = await response.json();
        const entries = Array.isArray(data?.courses) ? data.courses : null;
        if (!entries) return { ok: false, reason: 'not_logged_in' };
        const courses = entries
            .map(entry => ({
                courseId: entry?.courseRun?.courseId || '',
                name: entry?.course?.courseName || '',
                isArchived: !!entry?.courseRun?.isArchived
            }))
            .filter(c => c.courseId && c.name);
        return { ok: true, courses };
    } catch (e) {
        return { ok: false, reason: 'network_error' };
    }
}

// course.chapters: null/undefined = every module, otherwise the chapter titles to keep.
function filterUnitsByChapters(units, course) {
    if (!units || !Array.isArray(course.chapters)) return units;
    const keep = new Set(course.chapters);
    return units.filter(u => keep.has(u.chapterTitle));
}

async function getCourseOutline(courseId) {
    const username = await fetchUsername(courseId);
    if (!username) return null;
    const blocks = await fetchCourseBlocks(courseId, username);
    if (!blocks) return null;
    return flattenBlocksToUnits(blocks);
}

// ---- Content Extractors ----

function collectTranscriptsFromHtml(html, baseUrl) {
    const transcripts = [];
    const seen = new Set();
    const anchorPattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
    let match;

    while ((match = anchorPattern.exec(html || ''))) {
        const attrs = match[1] || '';
        const hrefMatch = attrs.match(/\bhref\s*=\s*(["'])(.*?)\1/i) || attrs.match(/\bhref\s*=\s*([^\s>]+)/i);
        const rawHref = hrefMatch?.[2] || hrefMatch?.[1] || '';
        const href = decodeHtmlEntities(rawHref);
        const text = stripTags(match[2]);

        const isTranscript = /download transcript/i.test(text)
            || /\.pdf([?#]|$)/i.test(href)
            || (/asset-v1:/i.test(href) && /\.pdf/i.test(href));

        if (!href || !isTranscript) continue;

        let url;
        try { url = new URL(href, baseUrl).toString(); } catch (e) { continue; }

        if (seen.has(url)) continue;
        seen.add(url);

        let filename = '';
        try {
            const rawFilename = new URL(url).pathname.split('/').pop() || '';
            filename = decodeURIComponent(rawFilename);
        } catch (e) {
            filename = '';
        }

        transcripts.push({ url, filename });
    }

    return transcripts;
}

function extractYouTubeUrls(html) {
    const matches = [];
    const seen = new Set();
    const addUrl = (ytId) => {
        if (ytId && !seen.has(ytId)) {
            seen.add(ytId);
            matches.push(`https://youtu.be/${ytId}`);
        }
    };

    const videoWrappers = [...(html || '').matchAll(/<div[^>]*class="[^"]*video[^"]*"[^>]*data-metadata=(['"])([\s\S]*?)\1[^>]*>/gi)];
    videoWrappers.forEach(match => {
        const rawJson = decodeHtmlEntities(match[2]);
        try {
            const parsed = JSON.parse(rawJson);
            const streamStr = parsed.streams || "";
            const ytIdMatch = streamStr.match(/1\.00:([A-Za-z0-9_-]+)/);
            if (ytIdMatch) {
                addUrl(ytIdMatch[1]);
            } else if (parsed.youtube_id_1_0) {
                addUrl(parsed.youtube_id_1_0);
            }
        } catch (e) {
            // Unparsed
        }
    });

    if (matches.length === 0) {
        const iframeMatches = [...(html || '').matchAll(/(?:youtube\.com\/(?:embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/gi)];
        iframeMatches.forEach(m => addUrl(m[1]));
    }

    return matches;
}

// ---- Multi-Block Crawl Orchestration ----

async function processUnit(course, unit, localDataStore) {
    if (state.stopRequested) return;

    const sectionName = unit.chapterTitle || unit.sequentialTitle || course.name;
    state.cursor = {
        courseName: course.name,
        sectionName,
        unitTitle: unit.unitTitle || ''
    };

    const xblockUrl = buildXblockUrl(unit.unitUrl);
    if (!xblockUrl) return;

    try {
        const response = await fetch(xblockUrl, { credentials: 'include', cache: 'no-store' });
        if (!response.ok) return;
        const html = await response.text();

        // 1. Accumulate Text content
        const textBlocks = [...html.matchAll(/<div[^>]*class="[^"]*xblock-student_view-html[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)];
        if (textBlocks.length > 0) {
            textBlocks.forEach(block => {
                const cleanedText = cleanHtmlToText(block[1]);
                if (cleanedText.trim().length > 0) {
                    localDataStore.texts.push({
                        title: unit.unitTitle,
                        body: cleanedText
                    });
                }
            });
        }

        // 2. Accumulate Transcripts (Original PDFs)
        const transcripts = collectTranscriptsFromHtml(html, xblockUrl);
        transcripts.forEach(t => {
            localDataStore.transcripts.push({
                url: t.url,
                filename: t.filename,
                unitTitle: unit.unitTitle
            });
        });

        // 3. Accumulate Video Streams
        const ytUrls = extractYouTubeUrls(html);
        ytUrls.forEach(url => {
            if (!localDataStore.videos.includes(url)) {
                localDataStore.videos.push(url);
            }
        });

        // 4. Accumulate Quiz / Question Links
        const hasQuiz = html.includes('xblock-student_view-problem') ||
            /Practice Activity|Assessment|Quiz/i.test(unit.unitTitle);
        if (hasQuiz) {
            const verticalBlockPath = extractVerticalBlockPath(unit.unitUrl);
            const directJumpUrl = `https://iimbx.edu.in/courses/${course.courseId}/jump_to/${verticalBlockPath}`;
            localDataStore.questions.push({
                title: unit.unitTitle,
                url: directJumpUrl
            });
        }

    } catch (e) {
        console.warn(`[BG] Fetch error in unit ${unit.unitTitle}:`, e);
    }
}

async function processOneCourse(course) {
    if (state.stopRequested) return null;

    state.isCrawling = true;
    state.isRunning = true;
    state.cursor = { courseName: course.name, sectionName: '', unitTitle: '' };
    await saveState();

    const units = filterUnitsByChapters(await getCourseOutline(course.courseId), course);
    if (state.stopRequested) return null;

    if (!units || units.length === 0) {
        return null;
    }

    const unitResults = new Array(units.length);

    let cursor = 0;
    const worker = async () => {
        while (cursor < units.length) {
            if (state.stopRequested) return;
            const idx = cursor++;
            const unitObj = units[idx];

            const unitStore = { texts: [], transcripts: [], videos: [], questions: [] };
            await processUnit(course, unitObj, unitStore);

            unitResults[idx] = {
                unitObj,
                data: unitStore
            };

            // Increment overall state stats
            state.stats.completed++;
            saveState();
            broadcastProgress('downloading');
        }
    };

    const workers = [];
    for (let i = 0; i < Math.min(FETCH_CONCURRENCY, units.length); i++) {
        workers.push(worker());
    }
    await Promise.all(workers);

    if (state.stopRequested) return null;

    // Assemble chaptersData in exact course outline order
    const chaptersData = {};

    for (let i = 0; i < units.length; i++) {
        const res = unitResults[i];
        if (!res || !res.data) continue;

        const chapKey = res.unitObj.chapterTitle || "General Core";
        if (!chaptersData[chapKey]) {
            chaptersData[chapKey] = { texts: [], transcripts: [], videos: [], questions: [] };
        }

        const chapStore = chaptersData[chapKey];
        const data = res.data;

        if (data.texts && data.texts.length > 0) {
            chapStore.texts.push(...data.texts);
        }

        if (data.transcripts && data.transcripts.length > 0) {
            for (const t of data.transcripts) {
                if (!chapStore.transcripts.some(existing => existing.url === t.url)) {
                    chapStore.transcripts.push(t);
                }
            }
        }

        if (data.videos && data.videos.length > 0) {
            for (const url of data.videos) {
                if (!chapStore.videos.includes(url)) {
                    chapStore.videos.push(url);
                }
            }
        }

        if (data.questions && data.questions.length > 0) {
            chapStore.questions.push(...data.questions);
        }
    }

    return {
        courseName: course.name,
        courseId: course.courseId,
        chapters: chaptersData
    };
}

async function runDownload(courses, startIdx = 0) {
    state.queueInProgress = true;
    state.pendingCourses = courses;
    state.currentCourseIndex = startIdx;
    state.stopRequested = false;

    // Calculate total crawl iterations across all course outlines
    state.stats.total = 0;
    state.stats.completed = 0;
    for (const c of courses) {
        const outline = filterUnitsByChapters(await getCourseOutline(c.courseId), c);
        if (outline) state.stats.total += outline.length;
    }
    await saveState();

    accumulatedCourses = [];

    try {
        for (let i = startIdx; i < courses.length; i++) {
            if (state.stopRequested) break;
            state.currentCourseIndex = i;
            await saveState();
            try {
                const coursePayload = await processOneCourse(courses[i]);
                if (coursePayload) {
                    accumulatedCourses.push(coursePayload);
                }
            } catch (e) {
                console.warn(`[BG] Course ${courses[i].name} failed:`, e.message);
            }
        }
    } finally {
        state.queueInProgress = false;
        state.isCrawling = false;
        state.pendingCourses = [];
        await saveState();

        if (state.stopRequested) {
            broadcastProgress('stopped');
        } else if (accumulatedCourses.length > 0) {
            // Package everything into one single, master download.json
            const masterPayload = {
                generator: "IIMBx Master Course Compiler",
                courses: accumulatedCourses
            };
            downloadDataPayload(JSON.stringify(masterPayload, null, 4), "download.json");
        } else {
            checkAllComplete();
        }
    }
}

function startRun(courses, startIdx = 0) {
    if (activeRunPromise) {
        return activeRunPromise;
    }
    activeRunPromise = runDownload(courses, startIdx).finally(() => {
        activeRunPromise = null;
    });
    return activeRunPromise;
}

// ---- Message Handler ----

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
        await ensureStateLoaded();

        if (message.type === 'FETCH_DASHBOARD_COURSES') {
            const result = await fetchDashboardCourses();
            if (result.ok) {
                sendResponse({ status: 'fetched', courses: result.courses });
            } else {
                sendResponse({ status: 'error', reason: result.reason });
            }
            return;
        }

        if (message.type === 'GET_COURSE_CHAPTERS') {
            const units = await getCourseOutline(message.courseId);
            if (!units) {
                sendResponse({ status: 'error' });
            } else {
                sendResponse({ status: 'fetched', chapters: [...new Set(units.map(u => u.chapterTitle).filter(Boolean))] });
            }
            return;
        }

        if (message.type === 'START_DOWNLOAD') {
            const courses = Array.isArray(message.courses) ? message.courses : [];
            state = createDefaultState();
            cachedUsername = null;
            await saveState();
            startRun(courses, 0);
            sendResponse({ status: 'started' });
            return;
        }

        if (message.type === 'STOP_DOWNLOAD') {
            state.stopRequested = true;
            state.isCrawling = false;
            state.isRunning = false;
            state.queueInProgress = false;
            state.pendingCourses = [];
            state.cursor = { courseName: '', sectionName: '', unitTitle: '' };
            const activeDownloadIds = Object.keys(state.activeDownloads).map(id => Number(id));
            state.activeDownloads = {};
            await saveState();
            for (const downloadId of activeDownloadIds) {
                chrome.downloads.cancel(downloadId, () => { });
            }
            broadcastProgress('stopped');
            sendResponse({ status: 'stopped' });
            return;
        }

        if (message.type === 'GET_PROGRESS') {
            sendResponse(buildProgressSnapshot());
            return;
        }

        if (message.type === 'RESET_STATE') {
            state = createDefaultState();
            cachedUsername = null;
            await saveState();
            sendResponse({ status: 'reset' });
            return;
        }

        if (message.type === 'CLEAR_OUTLINE_CACHE') {
            await clearOutlineCache();
            sendResponse({ status: 'cleared' });
            return;
        }

        sendResponse({ status: 'unknown_message' });
    })();

    return true;
});