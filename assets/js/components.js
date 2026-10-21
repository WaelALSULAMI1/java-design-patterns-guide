// Reusable interactive pieces: code viewer, multiple-choice questions,
// code completion, find-the-mistakes, progress bar.

import { highlightJava, escapeHtml } from "./highlight.js";
import { recordAnswer } from "./store.js";

export const ICONS = {
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>`,
};

function announce(msg) {
  const el = document.getElementById("announcer");
  if (!el) return;
  el.textContent = "";
  requestAnimationFrame(() => { el.textContent = msg; });
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  if (!ok) throw new Error("copy failed");
}

function wireCopy(button, getText, t) {
  button.addEventListener("click", async () => {
    const label = button.querySelector("span");
    try {
      await copyText(getText());
      label.textContent = t.copied;
      announce(t.copied);
    } catch {
      label.textContent = t.copyFailed;
    }
    setTimeout(() => { label.textContent = t.copy; }, 1600);
  });
}

const lineSpans = (htmlLines) => htmlLines.map((l) => `<span class="ln">${l || " "}</span>`).join("");

/* Static code block used inside the text, with a copy button. */
export function codeSnippet(source, { copy = true } = {}) {
  const button = copy ? `<button class="icon-btn snippet-copy" type="button" data-copy>${ICONS.copy}<span>Copy</span></button>` : "";
  return `<div class="code-block ${copy ? "snippet" : ""}">${button}<pre class="code short" tabindex="0"><code>${lineSpans(highlightJava(source))}</code></pre></div>`;
}

/* Activates copy buttons on snippets inside `root`. */
export function wireSnippetCopy(root, t) {
  root.querySelectorAll(".snippet").forEach((block) => {
    const btn = block.querySelector("[data-copy]");
    if (btn) wireCopy(btn, () => block.querySelector("pre").innerText.replace(/\u00a0/g, " "), t);
  });
}

/* ------------------------------------------------------------------ */
/* Code viewer: loads the real .java files from the repository         */
/* ------------------------------------------------------------------ */
const fileCache = new Map();

function loadFile(path) {
  if (!fileCache.has(path)) {
    const p = fetch(path).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    });
    p.catch(() => fileCache.delete(path));
    fileCache.set(path, p);
  }
  return fileCache.get(path);
}

/** Renders a tabbed viewer into `host`. Returns { show(name), highlight(name, find, span) }. */
export function createCodeViewer(host, files, t, idPrefix) {
  let current = files[0].name;
  let sourceText = "";
  let token = 0;
  let loading = Promise.resolve();

  const tabs = files
    .map((f, i) => `<button class="tab" role="tab" id="${idPrefix}-tab-${i}" aria-controls="${idPrefix}-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-file="${escapeHtml(f.name)}">${escapeHtml(f.name)}</button>`)
    .join("");
  host.innerHTML = `
    <div class="code-block">
      <div class="tabs" role="tablist" aria-label="${escapeHtml(t.codeFiles)}">${tabs}</div>
      <div class="code-bar">
        <span class="path"></span>
        <div class="code-actions"><button class="icon-btn" type="button" data-act="copy">${ICONS.copy}<span>${t.copy}</span></button></div>
      </div>
      <pre class="code numbered" id="${idPrefix}-panel" role="tabpanel" tabindex="0"><code><span class="code-status">${t.loadingCode}</span></code></pre>
    </div>`;

  const pre = host.querySelector("pre");
  const pathEl = host.querySelector(".path");

  function applyHighlight(find, span = 1) {
    const lines = [...pre.querySelectorAll(".ln")];
    lines.forEach((l) => l.classList.remove("hl"));
    if (!find) return;
    const start = sourceText.split("\n").findIndex((l) => l.includes(find));
    if (start < 0) return;
    for (let i = start; i < Math.min(lines.length, start + span); i++) lines[i].classList.add("hl");
    const top = lines[start].offsetTop - pre.clientHeight / 4;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    pre.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  }

  async function render(name, hl) {
    const file = files.find((f) => f.name === name) || files[0];
    current = file.name;
    host.querySelectorAll(".tab").forEach((b) => {
      const on = b.dataset.file === file.name;
      b.setAttribute("aria-selected", on);
      b.tabIndex = on ? 0 : -1;
      if (on) pre.setAttribute("aria-labelledby", b.id);
    });
    pathEl.textContent = file.path;
    pathEl.title = file.path;
    const mine = ++token;
    try {
      const text = await loadFile(file.path);
      if (mine !== token) return;
      sourceText = text;
      pre.querySelector("code").innerHTML = lineSpans(highlightJava(text));
      pre.scrollTop = 0;
      if (hl) applyHighlight(hl.find, hl.span);
    } catch {
      if (mine !== token) return;
      sourceText = "";
      pre.querySelector("code").innerHTML = `<span class="code-status err">${escapeHtml(t.loadFailed(file.path))}</span>`;
    }
  }

  function show(name, hl) {
    loading = render(name, hl);
    return loading;
  }

  const tabList = host.querySelector(".tabs");
  tabList.addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (b) show(b.dataset.file);
  });
  tabList.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const all = [...host.querySelectorAll(".tab")];
    let i = all.findIndex((b) => b.getAttribute("aria-selected") === "true");
    if (e.key === "ArrowRight") i = (i + 1) % all.length;
    if (e.key === "ArrowLeft") i = (i - 1 + all.length) % all.length;
    if (e.key === "Home") i = 0;
    if (e.key === "End") i = all.length - 1;
    e.preventDefault();
    all[i].focus();
    show(all[i].dataset.file);
  });
  wireCopy(host.querySelector('[data-act="copy"]'), () => sourceText, t);

  show(current);
  return {
    show,
    highlight(name, find, span) {
      if (name !== current) return show(name, { find, span });
      return loading.then(() => applyHighlight(find, span));
    },
  };
}

/* ------------------------------------------------------------------ */
/* Progress bar                                                         */
/* ------------------------------------------------------------------ */
export function progressBar(answered, total, label) {
  const pct = total ? Math.round((answered / total) * 100) : 0;
  return `<div class="progress">
    <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${answered}" aria-label="${escapeHtml(label)}"><div class="progress-fill" style="width:${pct}%"></div></div>
    <span>${escapeHtml(label)}</span></div>`;
}

/* ------------------------------------------------------------------ */
/* Multiple choice: every option explains itself once answered         */
/* ------------------------------------------------------------------ */
export function mountMcq(host, quiz, t) {
  const letters = "ABCD";
  host.innerHTML = quiz.questions
    .map((q, qi) => {
      const opts = q.options
        .map((o, oi) => `<button type="button" class="option" data-q="${qi}" data-o="${oi}"><span class="key" aria-hidden="true">${letters[oi]}</span><span class="txt">${escapeHtml(o.text)}<span class="why" hidden></span></span></button>`)
        .join("");
      return `<div class="q" data-q="${qi}">
        <p class="q-text" id="${quiz.id}-${q.id}">${qi + 1}. ${escapeHtml(q.q)}</p>
        <div class="options" role="group" aria-labelledby="${quiz.id}-${q.id}">${opts}</div>
        <div class="feedback-slot" aria-live="polite"></div>
      </div>`;
    })
    .join("");

  host.addEventListener("click", (e) => {
    const btn = e.target.closest(".option");
    if (!btn || btn.disabled) return;
    const qi = +btn.dataset.q;
    const oi = +btn.dataset.o;
    const q = quiz.questions[qi];
    const chosen = q.options[oi];
    const block = host.querySelector(`.q[data-q="${qi}"]`);
    block.querySelectorAll(".option").forEach((b, i) => {
      const o = q.options[i];
      b.disabled = true;
      const why = b.querySelector(".why");
      why.textContent = o.why;
      why.hidden = false;
      b.classList.add(o.correct ? "correct" : i === oi ? "wrong" : "dim");
    });
    const rightKey = letters[q.options.findIndex((o) => o.correct)];
    block.querySelector(".feedback-slot").innerHTML = chosen.correct
      ? `<div class="feedback ok"><strong>${t.correct}</strong>${t.readWhy}</div>`
      : `<div class="feedback bad"><strong>${t.notQuite}</strong>${t.correctAnswer}: ${rightKey}. ${t.readWhy}</div>`;
    recordAnswer(quiz.id, q.id, !!chosen.correct);
  });
}

/* ------------------------------------------------------------------ */
/* Code completion                                                      */
/* ------------------------------------------------------------------ */
const norm = (s) => s.replace(/\s+/g, "").replace(/;+$/, "");

export function mountCompletion(host, ex, t) {
  const parts = ex.code.split(/\[\[(\d+)\]\]/);
  const html = parts.map((part, i) => {
    if (i % 2 === 0) return highlightJava(part).join("\n");
    const n = +part;
    return `<input class="blank" data-b="${n}" aria-label="${escapeHtml(t.blankLabel(n + 1))}" size="${ex.blanks[n].width}" autocomplete="off" autocapitalize="off" spellcheck="false">`;
  });
  host.innerHTML = `
    <div class="code-block"><pre class="code short numbered"><code>${lineSpans(html.join("").split("\n"))}</code></pre></div>
    <div class="ex-actions">
      <button class="btn small" type="button" data-act="check">${t.check}</button>
      <button class="btn small secondary" type="button" data-act="show">${t.showAnswers}</button>
      <button class="btn small secondary" type="button" data-act="reset">${t.tryAgain}</button>
    </div>
    <div class="result" aria-live="polite"></div>`;

  const inputs = [...host.querySelectorAll(".blank")].sort((a, b) => a.dataset.b - b.dataset.b);
  const result = host.querySelector(".result");

  function check(reveal) {
    let correct = 0;
    const notes = ex.blanks.map((b, i) => {
      const input = inputs[i];
      if (reveal) input.value = b.answers[0];
      const ok = b.answers.some((a) => norm(a) === norm(input.value));
      input.classList.toggle("ok", ok);
      input.classList.toggle("bad", !ok);
      if (ok) correct++;
      const given = input.value.trim() ? `<code>${escapeHtml(input.value.trim())}</code>` : "(empty)";
      return `<li class="${ok ? "ok" : "bad"}"><strong>${t.blankLabel(i + 1)}:</strong> ${ok ? "" : `${t.yourAnswer}: ${given}. ${t.correctAnswer}: `}<code>${escapeHtml(b.answers[0])}</code><br>${escapeHtml(b.why)}</li>`;
    });
    result.innerHTML = `<div class="feedback ${correct === ex.blanks.length ? "ok" : "bad"}"><strong>${t.blanksResult(correct, ex.blanks.length)}</strong></div><ul class="blank-notes">${notes.join("")}</ul>`;
    if (!reveal) recordAnswer(ex.id, "all", correct === ex.blanks.length);
  }

  host.addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "check") check(false);
    if (act === "show") check(true);
    if (act === "reset") {
      inputs.forEach((i) => { i.value = ""; i.classList.remove("ok", "bad"); });
      result.innerHTML = "";
      inputs[0].focus();
    }
  });
  host.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.classList.contains("blank")) { e.preventDefault(); check(false); }
  });
}

/* ------------------------------------------------------------------ */
/* Find the mistakes: select lines, then check                          */
/* ------------------------------------------------------------------ */
export function mountFixBug(host, ex, t) {
  const hl = highlightJava(ex.lines.join("\n"));
  const lines = hl
    .map((l, i) => {
      const text = ex.lines[i].trim();
      const pickable = text && !text.startsWith("//") && text !== "}" && text !== "{";
      return pickable
        ? `<span class="ln pick" role="checkbox" aria-checked="false" tabindex="0" data-i="${i}">${l}</span>`
        : `<span class="ln">${l || " "}</span>`;
    })
    .join("");
  host.innerHTML = `
    <p>${escapeHtml(ex.intro)}</p>
    <p class="pick-hint">${t.pickLinesHint} <span class="sel-count"></span></p>
    <div class="code-block"><pre class="code short numbered"><code>${lines}</code></pre></div>
    <div class="ex-actions">
      <button class="btn small" type="button" data-act="check">${t.check}</button>
      <button class="btn small secondary" type="button" data-act="reset">${t.tryAgain}</button>
    </div>
    <div class="result" aria-live="polite"></div>`;

  const picks = [...host.querySelectorAll(".ln.pick")];
  const count = host.querySelector(".sel-count");
  const result = host.querySelector(".result");
  const bugIdx = Object.keys(ex.bugs).map(Number);
  let checked = false;

  const updateCount = () => {
    const n = picks.filter((p) => p.classList.contains("sel")).length;
    count.textContent = n ? `(${t.linesSelected(n)})` : "";
  };
  const toggle = (el) => {
    if (checked) return;
    const on = !el.classList.contains("sel");
    el.classList.toggle("sel", on);
    el.setAttribute("aria-checked", on);
    updateCount();
  };

  host.addEventListener("click", (e) => {
    const line = e.target.closest(".ln.pick");
    if (line) { toggle(line); return; }
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "check" && !checked) {
      checked = true;
      let found = 0;
      let wrongPicks = 0;
      const falseNotes = [];
      picks.forEach((p) => {
        const i = +p.dataset.i;
        const sel = p.classList.contains("sel");
        const isBug = bugIdx.includes(i);
        p.classList.remove("sel");
        p.removeAttribute("tabindex");
        p.setAttribute("aria-disabled", "true");
        if (isBug && sel) { p.classList.add("found"); found++; }
        else if (isBug) p.classList.add("missed");
        else if (sel) {
          p.classList.add("false");
          wrongPicks++;
          const note = ex.falseNotes?.[i];
          falseNotes.push(`<li class="bad"><strong>${t.falseLine}</strong> <code>${escapeHtml(ex.lines[i].trim())}</code>${note ? `<br>${escapeHtml(note)}` : ""}</li>`);
        }
      });
      const bugNotes = bugIdx.map((i) => {
        const b = ex.bugs[i];
        const got = host.querySelector(`.ln[data-i="${i}"]`).classList.contains("found");
        return `<li class="${got ? "ok" : "bad"}"><code>${escapeHtml(ex.lines[i].trim())}</code><br><strong>${t.fixLabel}:</strong> <code>${escapeHtml(b.fix.trim())}</code><br>${escapeHtml(b.why)}</li>`;
      });
      const all = found === bugIdx.length && wrongPicks === 0;
      result.innerHTML = `<div class="feedback ${all ? "ok" : "bad"}"><strong>${t.bugsResult(found, bugIdx.length, wrongPicks)}</strong></div><ul class="blank-notes">${bugNotes.join("")}${falseNotes.join("")}</ul>`;
      recordAnswer(ex.id, "all", all);
    }
    if (act === "reset") {
      checked = false;
      picks.forEach((p) => {
        p.classList.remove("sel", "found", "missed", "false");
        p.setAttribute("aria-checked", "false");
        p.removeAttribute("aria-disabled");
        p.tabIndex = 0;
      });
      result.innerHTML = "";
      updateCount();
    }
  });
  host.addEventListener("keydown", (e) => {
    const line = e.target.closest(".ln.pick");
    if (line && (e.key === " " || e.key === "Enter")) { e.preventDefault(); toggle(line); }
  });
}
