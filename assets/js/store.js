// Session progress and the theme preference.
// Progress lives in sessionStorage (cleared when the browser session ends);
// the theme choice lives in localStorage.
// Every access is wrapped: storage can be blocked (private mode, strict settings).

const PROGRESS_KEY = "jdpg-progress-v1";
let memory = {};

function readProgress() {
  try {
    const raw = sessionStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : memory;
  } catch {
    return memory;
  }
}

function writeProgress(data) {
  memory = data;
  try { sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(data)); } catch { /* keep in memory */ }
}

/** Records the first answer to an item: { correct: boolean }. Later attempts keep the first result. */
export function recordAnswer(group, itemId, correct) {
  const data = readProgress();
  data[group] = data[group] || {};
  if (!(itemId in data[group])) data[group][itemId] = { correct: !!correct };
  writeProgress(data);
  window.dispatchEvent(new CustomEvent("progress-change"));
}

export function getGroup(group) {
  return readProgress()[group] || {};
}

export function resetGroup(group) {
  const data = readProgress();
  delete data[group];
  writeProgress(data);
  window.dispatchEvent(new CustomEvent("progress-change"));
}

export function summary() {
  const data = readProgress();
  let answered = 0;
  let correct = 0;
  for (const group of Object.values(data)) {
    for (const item of Object.values(group)) {
      answered++;
      if (item.correct) correct++;
    }
  }
  return { answered, correct };
}

export function setPref(key, value) {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}
