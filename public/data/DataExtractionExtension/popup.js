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
      const label = document.createElement('label');
      label.className = 'course-row';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
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

      label.appendChild(cb);
      label.appendChild(checkmark);
      label.appendChild(name);
      courseListDiv.appendChild(label);
    });

    applyCourseFilter();
  });
}

function updateStartButton() {
  const checked = courseListDiv.querySelectorAll('input[type="checkbox"]:checked');
  startBtn.disabled = checked.length === 0;
}

function applyCourseFilter() {
  const query = courseSearch.value.trim().toLowerCase();
  const rows = courseListDiv.querySelectorAll('.course-row');
  let visible = 0;
  rows.forEach(row => {
    const name = row.querySelector('.course-name')?.textContent.toLowerCase() || '';
    const match = !query || name.includes(query);
    row.classList.toggle('hidden', !match);
    if (match) visible++;
  });
  courseEmpty.classList.toggle('hidden', visible > 0 || rows.length === 0);
  updateSelectAllState();
  updateStartButton();
}

function updateSelectAllState() {
  const visibleBoxes = Array.from(courseListDiv.querySelectorAll('.course-row:not(.hidden) input[type="checkbox"]'));
  const allChecked = visibleBoxes.length > 0 && visibleBoxes.every(cb => cb.checked);
  selectAllCb.checked = allChecked;
}

function saveSelectedCourses() {
  const selected = Array.from(courseListDiv.querySelectorAll('input[type="checkbox"]:checked'))
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
  const visibleBoxes = Array.from(courseListDiv.querySelectorAll('.course-row:not(.hidden) input[type="checkbox"]'));
  visibleBoxes.forEach(cb => cb.checked = selectAllCb.checked);
  updateStartButton();
  saveSelectedCourses();
});

courseSearch.addEventListener('input', applyCourseFilter);

startBtn.addEventListener('click', async () => {
  const selected = Array.from(courseListDiv.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => ({ courseId: cb.value, name: cb.dataset.name }));

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