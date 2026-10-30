'use strict';

const notOnDashboard = document.getElementById('not-on-dashboard');
const loadingState = document.getElementById('loading-state');
const waitingForLogin = document.getElementById('waiting-for-login');
const courseSelection = document.getElementById('course-selection');
const progressSection = document.getElementById('progress-section');
const completeSection = document.getElementById('complete-section');

const goToDashboard = document.getElementById('go-to-dashboard');
const selectAllCb = document.getElementById('select-all');
const courseListDiv = document.getElementById('course-list');
const courseSearch = document.getElementById('course-search');
const courseEmpty = document.getElementById('course-empty');
const startBtn = document.getElementById('start-download');
const restartBtn = document.getElementById('restart-btn');
const stopBtn = document.getElementById('stop-download');

const statusText = document.getElementById('status-text');
const progressFill = document.getElementById('progress-fill');
const currentCourse = document.getElementById('current-course');
const currentSection = document.getElementById('current-section');
const currentUnit = document.getElementById('current-unit');
const completeSummary = document.getElementById('complete-summary');
const completeIconBox = document.getElementById('complete-icon-box');

const DASHBOARD_URL = 'https://apps.iimbx.edu.in/learner-dashboard/';

const COMPLETE_ICON = `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.4"/><path d="M7.5 12l3 3 6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const STOPPED_ICON = `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.4"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" stroke-width="1.4"/></svg>`;

let courses = [];
let waitingPollTimer = null;

function showOnly(section) {
  [notOnDashboard, loadingState, waitingForLogin, courseSelection, progressSection, completeSection]
    .forEach(el => el.classList.add('hidden'));
  if (section) section.classList.remove('hidden');
}

async function pollLoginOnce() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'FETCH_DASHBOARD_COURSES' });
    if (response?.status === 'fetched' && Array.isArray(response.courses) && response.courses.length > 0) {
      clearInterval(waitingPollTimer);
      renderCourseList(response.courses);
      showOnly(courseSelection);
    }
  } catch (e) {
    // Background not ready
  }
}

function renderCourseList(courseData) {
  courses = courseData;
  courseListDiv.innerHTML = '';
  courseSearch.value = '';

  chrome.storage.local.get('selectedCourseIds', data => {
    const savedIds = new Set(data.selectedCourseIds || []);

    courses.forEach(course => {
      const item = document.createElement('div');
      item.className = 'course-item';

      const label = document.createElement('label');
      label.className = 'course-row';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'course-cb';
      cb.value = course.courseId;
      cb.dataset.name = course.name;
      cb.checked = savedIds.has(course.courseId);
      cb.addEventListener('change', () => {
        updateStartButton();
        updateSelectAllState();
        saveSelectedCourses();
      });

      const checkmark = document.createElement('span');
      checkmark.className = 'checkbox';

      const name = document.createElement('span');
      name.className = 'course-name';
      name.textContent = course.name;

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'module-toggle';
      toggle.textContent = 'All modules ▾';

      const moduleList = document.createElement('div');
      moduleList.className = 'module-list hidden';

      toggle.addEventListener('click', e => { e.preventDefault(); toggleModules(course, item, moduleList, toggle); });

      label.appendChild(cb);
      label.appendChild(checkmark);
      label.appendChild(name);
      label.appendChild(toggle);
      item.appendChild(label);
      item.appendChild(moduleList);
      courseListDiv.appendChild(item);
    });

    applyCourseFilter();
  });
}

// Modules (chapters) are fetched lazily the first time a course's dropdown is opened.
// Until then, or while every module is ticked, the course compiles in full.
async function toggleModules(course, item, moduleList, toggle) {
  const opening = moduleList.classList.contains('hidden');
  moduleList.classList.toggle('hidden', !opening);
  if (!opening || item.dataset.loaded) return;

  moduleList.textContent = 'Loading modules…';
  const response = await chrome.runtime.sendMessage({ type: 'GET_COURSE_CHAPTERS', courseId: course.courseId });
  moduleList.textContent = '';
  if (response?.status !== 'fetched' || !response.chapters.length) {
    moduleList.textContent = 'Could not load modules.';
    return;
  }
  item.dataset.loaded = '1';

  const makeRow = (text, cls) => {
    const row = document.createElement('label');
    row.className = 'course-row module-row';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = cls;
    box.checked = true;
    const mark = document.createElement('span');
    mark.className = 'checkbox';
    const span = document.createElement('span');
    span.className = 'course-name';
    span.textContent = text;
    row.append(box, mark, span);
    moduleList.appendChild(row);
    return box;
  };

  const allBox = makeRow('All modules', 'module-all');
  const boxes = response.chapters.map(ch => {
    const box = makeRow(ch, 'module-cb');
    box.value = ch;
    return box;
  });

  const refresh = () => {
    const n = boxes.filter(b => b.checked).length;
    allBox.checked = n === boxes.length;
    toggle.textContent = (n === boxes.length ? 'All modules' : `${n}/${boxes.length} modules`) + ' ▾';
    // Picking a module implies the course; un-ticking every module drops it.
    item.querySelector('.course-cb').checked = n > 0;
    updateStartButton();
    updateSelectAllState();
  };
  allBox.addEventListener('change', () => { boxes.forEach(b => b.checked = allBox.checked); refresh(); });
  boxes.forEach(b => b.addEventListener('change', refresh));
}

function selectedChapters(item) {
  if (!item.dataset.loaded) return null;
  const boxes = Array.from(item.querySelectorAll('input.module-cb'));
  const picked = boxes.filter(b => b.checked).map(b => b.value);
  // Course ticked again after clearing every module means "whole course".
  return picked.length === boxes.length || !picked.length ? null : picked;
}

function updateStartButton() {
  const checked = courseListDiv.querySelectorAll('input.course-cb:checked');
  startBtn.disabled = checked.length === 0;
}

function applyCourseFilter() {
  const query = courseSearch.value.trim().toLowerCase();
  const rows = courseListDiv.querySelectorAll('.course-item');
  let visible = 0;
  rows.forEach(row => {
    const name = row.querySelector('.course-cb')?.dataset.name.toLowerCase() || '';
    const match = !query || name.includes(query);
    row.classList.toggle('hidden', !match);
    if (match) visible++;
  });
  courseEmpty.classList.toggle('hidden', visible > 0 || rows.length === 0);
  updateSelectAllState();
  updateStartButton();
}

function updateSelectAllState() {
  const visibleBoxes = Array.from(courseListDiv.querySelectorAll('.course-item:not(.hidden) input.course-cb'));
  const allChecked = visibleBoxes.length > 0 && visibleBoxes.every(cb => cb.checked);
  selectAllCb.checked = allChecked;
}

function saveSelectedCourses() {
  const selected = Array.from(courseListDiv.querySelectorAll('input.course-cb:checked'))
    .map(cb => cb.value);
  chrome.storage.local.set({ selectedCourseIds: selected });
}

function renderProgress(data) {
  progressFill.style.width = `${data.percent || 0}%`;
  currentCourse.textContent = data.courseName || '—';
  currentSection.textContent = data.sectionName || '—';
  currentUnit.textContent = data.unitTitle || '—';
  statusText.textContent = `${data.percent}% Compiled`;
}

function showFinalState(data, kind) {
  showOnly(completeSection);
  completeIconBox.innerHTML = kind === 'stopped' ? STOPPED_ICON : COMPLETE_ICON;
  completeSummary.innerHTML = kind === 'stopped'
    ? `Compilation stopped.<br>Data gathered has not been output.`
    : `<strong>download.json</strong> successfully generated.<br>Check your downloads folder.`;
}

chrome.runtime.onMessage.addListener(message => {
  if (message.type === 'PROGRESS_UPDATE') {
    if (message.status === 'complete') showFinalState(message, 'complete');
    else if (message.status === 'stopped') showFinalState(message, 'stopped');
    else {
      showOnly(progressSection);
      renderProgress(message);
    }
  }
});

goToDashboard.addEventListener('click', () => {
  chrome.tabs.create({ url: DASHBOARD_URL });
  showOnly(waitingForLogin);
  waitingPollTimer = setInterval(pollLoginOnce, 3000);
});

selectAllCb.addEventListener('change', () => {
  const visibleBoxes = Array.from(courseListDiv.querySelectorAll('.course-item:not(.hidden) input.course-cb'));
  visibleBoxes.forEach(cb => cb.checked = selectAllCb.checked);
  updateStartButton();
  saveSelectedCourses();
});

courseSearch.addEventListener('input', applyCourseFilter);

startBtn.addEventListener('click', async () => {
  const selected = Array.from(courseListDiv.querySelectorAll('input.course-cb:checked'))
    .map(cb => ({ courseId: cb.value, name: cb.dataset.name, chapters: selectedChapters(cb.closest('.course-item')) }));

  showOnly(progressSection);
  renderProgress({ percent: 0 });

  try {
    await chrome.runtime.sendMessage({ type: 'START_DOWNLOAD', courses: selected });
  } catch (e) {
    showOnly(notOnDashboard);
  }
});

restartBtn.addEventListener('click', async () => {
  showOnly(loadingState);
  await chrome.runtime.sendMessage({ type: 'RESET_STATE' });
  init();
});

stopBtn.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ type: 'STOP_DOWNLOAD' });
});

async function init() {
  showOnly(loadingState);
  try {
    const progress = await chrome.runtime.sendMessage({ type: 'GET_PROGRESS' });
    if (progress?.isRunning) {
      showOnly(progressSection);
      renderProgress(progress);
      return;
    }

    const response = await chrome.runtime.sendMessage({ type: 'FETCH_DASHBOARD_COURSES' });
    if (response?.status === 'fetched') {
      renderCourseList(response.courses);
      showOnly(courseSelection);
    } else {
      showOnly(notOnDashboard);
    }
  } catch (e) {
    showOnly(notOnDashboard);
  }
}

init();