// Page renderers. Each returns { title, html, mount?(root) => cleanup?, focusSection? }.

import t from "../../content/ui.js";
import { patterns, byId, pairDifference } from "../../content/patterns.js";
import { scenarios } from "../../content/scenarios.js";
import singleton from "../../content/patterns/singleton.js";
import prototype from "../../content/patterns/prototype.js";
import builder from "../../content/patterns/builder.js";
import factoryMethod from "../../content/patterns/factory-method.js";
import abstractFactory from "../../content/patterns/abstract-factory.js";
import adapter from "../../content/patterns/adapter.js";
import bridge from "../../content/patterns/bridge.js";
import composite from "../../content/patterns/composite.js";
import { glyph } from "./glyphs.js";
import { escapeHtml } from "./highlight.js";
import {
  ICONS, codeSnippet, wireSnippetCopy, createCodeViewer, mountMcq, mountCompletion, mountFixBug, progressBar,
} from "./components.js";
import { summary, recordAnswer, getGroup, resetGroup } from "./store.js";

export const GUIDES = {
  singleton, prototype, builder,
  "factory-method": factoryMethod,
  "abstract-factory": abstractFactory,
  adapter, bridge, composite,
};

const SECTION_IDS = ["intent", "problem", "solution", "when", "real-world", "code", "walkthrough", "mistakes", "tradeoffs", "practice"];

const link = (path = "") => `#/${path}`;

/** Practice items for a guide: every MCQ question + one per code exercise. */
function practiceStats(g) {
  const total = g.quiz.questions.length + (g.completion ? 1 : 0) + (g.fixBug ? 1 : 0);
  const answered = Object.keys(getGroup(g.quiz.id)).length
    + (g.completion ? Object.keys(getGroup(g.completion.id)).length : 0)
    + (g.fixBug ? Object.keys(getGroup(g.fixBug.id)).length : 0);
  return { answered: Math.min(answered, total), total };
}

/* ---------------- Home ---------------- */
export function homeView() {
  const tiles = patterns
    .map((p, i) => `<a class="tile ${p.category}" href="${link(`patterns/${p.id}`)}" style="--i:${i}">${glyph(p.id)}<span>${p.name}</span></a>`)
    .join("");
  const approach = t.approach.map(([h, p]) => `<div><h3>${h}</h3><p>${p}</p></div>`).join("");

  const html = `
  <div class="wrap">
    <section class="hero" aria-labelledby="hero-title">
      <div>
        <h1 id="hero-title">${t.heroTitle}</h1>
        <p class="lead">${t.heroLead}</p>
        <div class="hero-actions">
          <a class="btn" href="${link("patterns/singleton")}">${t.heroStart}</a>
          <a class="btn secondary" href="${link("quiz")}">${t.heroQuiz}</a>
        </div>
      </div>
      <nav class="board" aria-label="${escapeHtml(t.boardLabel)}">${tiles}</nav>
    </section>

    <section class="section" id="patterns" aria-labelledby="patterns-title">
      <div class="section-head"><div><h2 id="patterns-title">${t.patternsTitle}</h2><p>${t.patternsLead}</p></div></div>
      <div class="finder">
        <div class="search">
          ${ICONS.search}
          <label class="visually-hidden" for="pattern-search">${t.searchLabel}</label>
          <input id="pattern-search" type="search" placeholder="${escapeHtml(t.searchPlaceholder)}" autocomplete="off">
        </div>
        <div class="chips" role="group" aria-label="${t.filterLabel}">
          <button class="chip" type="button" data-cat="all" aria-pressed="true">${t.all}</button>
          <button class="chip" type="button" data-cat="creational" aria-pressed="false">${t.creational}</button>
          <button class="chip" type="button" data-cat="structural" aria-pressed="false">${t.structural}</button>
        </div>
        <span class="result-count" aria-live="polite"></span>
      </div>
      <div class="cards" id="cards"></div>
    </section>

    <section class="section" aria-labelledby="approach-title">
      <div class="section-head"><h2 id="approach-title">${t.approachTitle}</h2></div>
      <div class="approach">${approach}</div>
    </section>

    <section class="section" aria-labelledby="practice-title">
      <div class="section-head"><h2 id="practice-title">${t.practiceTitle}</h2></div>
      <div class="split">
        <div class="panel"><h3>${t.compareCardTitle}</h3><p>${t.compareCardText}</p><a class="btn small secondary" href="${link("compare")}">${t.compareCardCta}</a></div>
        <div class="panel"><h3>${t.quizCardTitle}</h3><p>${t.quizCardText}</p><a class="btn small secondary" href="${link("quiz")}">${t.quizCardCta}</a></div>
      </div>
      <div class="session-bar"><strong>${t.sessionTitle}</strong><span id="session-text"></span><span class="muted">${t.sessionNote}</span></div>
    </section>
  </div>`;

  function mount(root) {
    const cardsEl = root.querySelector("#cards");
    const input = root.querySelector("#pattern-search");
    const count = root.querySelector(".result-count");
    let cat = "all";

    const card = (p) => {
      const s = practiceStats(GUIDES[p.id]);
      return `
      <article class="card ${p.category}">
        <div class="card-top">${glyph(p.id)}<div><h3><a href="${link(`patterns/${p.id}`)}">${p.name}</a></h3><span class="cat ${p.category}">${t[p.category]}</span></div></div>
        <p class="intent">${escapeHtml(p.intent)}</p>
        <dl>
          <div><dt>${t.useWhen}</dt><dd>${escapeHtml(p.useWhen[0])}</dd></div>
          <div><dt>${t.example}</dt><dd>${escapeHtml(p.example)}</dd></div>
        </dl>
        <div class="card-foot"><span class="status ${s.answered ? "full" : ""}">${s.answered ? t.practiced(s.answered, s.total) : t.notStarted}</span></div>
      </article>`;
    };

    function render() {
      const words = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      const list = patterns.filter((p) => {
        if (cat !== "all" && p.category !== cat) return false;
        if (!words.length) return true;
        const hay = [p.name, p.id, p.intent, p.problem, p.solution, p.keywords, p.example, ...p.useWhen].join(" ").toLowerCase();
        return words.every((w) => hay.includes(w));
      });
      cardsEl.innerHTML = list.length ? list.map(card).join("") : `<p class="empty">${t.noResults}</p>`;
      count.textContent = t.results(list.length);
    }
    input.addEventListener("input", render);
    root.querySelectorAll(".chip").forEach((c) =>
      c.addEventListener("click", () => {
        cat = c.dataset.cat;
        root.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", x === c));
        render();
      }),
    );
    render();

    const sessionText = root.querySelector("#session-text");
    const updateSession = () => {
      const s = summary();
      sessionText.textContent = t.sessionText(s.answered, s.correct);
    };
    updateSession();
    window.addEventListener("progress-change", updateSession);
    return () => window.removeEventListener("progress-change", updateSession);
  }

  return { title: null, html, mount };
}

/* ---------------- Pattern guide ---------------- */
export function patternView(id, sectionId) {
  const p = byId[id];
  const g = GUIDES[id];
  if (!p || !g) return null;

  const fill = (html) => html.replace(/\{\{snippet:([\w-]+)\}\}/g, (_, name) => codeSnippet(g.snippets[name] || ""));
  const head = (sid) => `<h2 id="${sid}">${t.sections[sid]}</h2>`;
  const index = patterns.findIndex((x) => x.id === id);
  const prev = patterns[index - 1];
  const next = patterns[index + 1];

  const toc = SECTION_IDS.map((s) => `<li><a href="${link(`patterns/${id}/${s}`)}" data-sec="${s}">${t.sections[s]}</a></li>`).join("");
  const mobileToc = SECTION_IDS.map((s) => `<option value="${s}">${t.sections[s]}</option>`).join("");
  const fileRoles = `<div class="table-wrap"><table class="t"><caption class="visually-hidden">${t.filesLabel}</caption><tbody>${g.files
    .map((f) => `<tr><td><code>${f.name}</code></td><td>${escapeHtml(f.role)}</td></tr>`).join("")}</tbody></table></div>`;
  const steps = g.walkthrough
    .map((s, i) => `<li><button type="button" class="walk-step" aria-expanded="false" data-step="${i}"><span><strong>${escapeHtml(s.title)}</strong><span class="body">${escapeHtml(s.body)}</span><span class="file">${s.file}</span></span></button></li>`)
    .join("");
  const mistakes = g.mistakes
    .map((m) => `<details class="mistake"><summary><span class="m-title">${escapeHtml(m.title)}</span></summary>
      <div class="mistake-body"><p>${escapeHtml(m.effect)}</p>
        <div class="two-col">
          <div class="wrong"><div class="label">${t.broken}</div>${codeSnippet(m.wrong, { copy: false })}</div>
          <div class="right"><div class="label">${t.fixed}</div>${codeSnippet(m.right, { copy: false })}</div>
        </div></div></details>`)
    .join("");
  const list = (items) => items.map((x) => `<li>${escapeHtml(x)}</li>`).join("");
  const exercise = (title, hint, slot) =>
    `<div class="exercise"><div class="exercise-head"><h3>${escapeHtml(title)}</h3>${hint ? `<span class="hint">${escapeHtml(hint)}</span>` : ""}</div><div id="${slot}"></div></div>`;
  const pager = `<nav class="pager" aria-label="Pattern navigation">
      ${prev ? `<a href="${link(`patterns/${prev.id}`)}" class="prev"><span class="muted">${t.prev}</span>${prev.name}</a>` : "<span></span>"}
      ${next ? `<a href="${link(`patterns/${next.id}`)}" class="next"><span class="muted">${t.next}</span>${next.name}</a>` : "<span></span>"}
    </nav>`;

  const html = `
  <div class="wrap doc">
    <aside class="toc" aria-label="${t.onThisPage}">
      <h2>${t.onThisPage}</h2>
      <ol>${toc}</ol>
      <div id="toc-progress"></div>
    </aside>
    <article>
      <header class="doc-head">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="${link("")}">${t.home}</a> / <a href="${link("patterns")}">${t.nav.patterns}</a> / <span aria-current="page">${p.name}</span></nav>
        <div class="doc-title ${p.category}">${glyph(p.id)}<div><h1 tabindex="-1">${p.name}</h1><span class="cat ${p.category}">${t[p.category]}</span></div></div>
        <p class="lead">${escapeHtml(g.lead)}</p>
      </header>
      <div class="doc-mobile-toc"><label class="visually-hidden" for="mtoc">${t.jumpTo}</label>
        <select id="mtoc"><option value="">${t.jumpTo}…</option>${mobileToc}</select></div>

      <section class="sec">${head("intent")}${fill(g.body.intent)}</section>
      <section class="sec">${head("problem")}${fill(g.body.problem)}</section>
      <section class="sec">${head("solution")}${fill(g.body.solution)}</section>
      <section class="sec">${head("when")}${fill(g.body.when)}</section>
      <section class="sec">${head("real-world")}${fill(g.body["real-world"])}</section>
      <section class="sec wide">${head("code")}<p>${t.codeIntro}</p>${fileRoles}<div id="viewer"></div></section>
      <section class="sec wide">${head("walkthrough")}<p>${t.walkIntro}</p>
        <div class="walk"><ol class="walk-steps">${steps}</ol><div class="walk-code" id="walk-viewer"></div></div></section>
      <section class="sec">${head("mistakes")}<p>${t.mistakesIntro}</p><div class="mistakes">${mistakes}</div></section>
      <section class="sec">${head("tradeoffs")}
        <div class="two-col"><div class="pc plus"><h3>${t.advantages}</h3><ul>${list(g.tradeoffs.pros)}</ul></div>
        <div class="pc minus"><h3>${t.disadvantages}</h3><ul>${list(g.tradeoffs.cons)}</ul></div></div></section>
      <section class="sec">${head("practice")}<p>${t.practiceIntro}</p>
        <div id="practice-progress"></div>
        ${exercise(t.quizTitle, "", "mcq")}
        ${g.completion ? exercise(g.completion.title, g.completion.hint, "completion") : ""}
        ${g.fixBug ? exercise(g.fixBug.title, "", "fixbug") : ""}
        <p class="notice">${t.morePractice} <a href="${link("quiz")}">${t.quizCardTitle}</a> or <a href="${link(`compare?a=${id}&b=${next ? next.id : prev.id}`)}">${t.compareCardTitle}</a>.</p>
      </section>
      ${pager}
    </article>
  </div>`;

  function mount(root) {
    wireSnippetCopy(root, t);
    createCodeViewer(root.querySelector("#viewer"), g.files, t, "main");
    const walkViewer = createCodeViewer(root.querySelector("#walk-viewer"), g.files, t, "walk");
    const stepBtns = [...root.querySelectorAll(".walk-step")];
    const openStep = (i) => {
      stepBtns.forEach((b, j) => b.setAttribute("aria-expanded", j === i));
      const s = g.walkthrough[i];
      walkViewer.highlight(s.file, s.find, s.span);
    };
    stepBtns.forEach((b, i) => b.addEventListener("click", () => openStep(i)));
    openStep(0);

    mountMcq(root.querySelector("#mcq"), g.quiz, t);
    if (g.completion) mountCompletion(root.querySelector("#completion"), g.completion, t);
    if (g.fixBug) mountFixBug(root.querySelector("#fixbug"), g.fixBug, t);

    const prog = () => {
      const s = practiceStats(g);
      const bar = progressBar(s.answered, s.total, t.sectionProgress(s.answered, s.total));
      root.querySelector("#toc-progress").innerHTML = bar;
      root.querySelector("#practice-progress").innerHTML = bar;
    };
    prog();
    window.addEventListener("progress-change", prog);

    const links = [...root.querySelectorAll(".toc a")];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", a.dataset.sec === en.target.id));
      });
    }, { rootMargin: "-15% 0px -75% 0px" });
    SECTION_IDS.forEach((s) => { const el = root.querySelector(`#${s}`); if (el) io.observe(el); });

    root.querySelector("#mtoc").addEventListener("change", (e) => {
      if (e.target.value) location.hash = link(`patterns/${id}/${e.target.value}`);
    });

    return () => { io.disconnect(); window.removeEventListener("progress-change", prog); };
  }

  const title = sectionId && t.sections[sectionId] ? `${t.sections[sectionId]} · ${p.name}` : p.name;
  return { title, html, mount, focusSection: SECTION_IDS.includes(sectionId) ? sectionId : null };
}

/* ---------------- Compare ---------------- */
export function compareView(query) {
  const a0 = byId[query.get("a")] ? query.get("a") : "factory-method";
  const b0 = byId[query.get("b")] ? query.get("b") : "abstract-factory";
  const opts = (sel) => patterns.map((p) => `<option value="${p.id}" ${p.id === sel ? "selected" : ""}>${p.name}</option>`).join("");

  const html = `
  <div class="wrap">
    <header class="page-head"><h1 tabindex="-1">${t.compareTitle}</h1><p>${t.compareLead}</p></header>
    <div class="compare-pick">
      <label>${t.first}<select id="cmp-a">${opts(a0)}</select></label>
      <button class="btn secondary swap" type="button" id="cmp-swap">${t.swap}</button>
      <label>${t.second}<select id="cmp-b">${opts(b0)}</select></label>
    </div>
    <div id="cmp-out" aria-live="polite"></div>
  </div>`;

  function mount(root) {
    const out = root.querySelector("#cmp-out");
    const selA = root.querySelector("#cmp-a");
    const selB = root.querySelector("#cmp-b");
    const area = (c) => (c === "creational" ? "creating objects" : "how classes and objects fit together");

    function render() {
      const a = selA.value;
      const b = selB.value;
      history.replaceState(null, "", link(`compare?a=${a}&b=${b}`));
      if (a === b) { out.innerHTML = `<p class="notice">${t.samePattern}</p>`; return; }
      const A = byId[a];
      const B = byId[b];
      const row = (label, fa, fb) => `<tr><th scope="row">${label}</th><td><span class="m-label">${A.name} · ${label}</span>${fa}</td><td><span class="m-label">${B.name} · ${label}</span>${fb}</td></tr>`;
      const uses = (p) => `<ul>${p.useWhen.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`;
      const ph = (p) => `<a class="ph" href="${link(`patterns/${p.id}`)}">${glyph(p.id)}<span>${p.name}</span></a>`;
      const diff = pairDifference(a, b)
        || (A.category === B.category
          ? `Both are ${A.category} patterns, so compare the problem each one solves: that decides which one you need.`
          : `${A.name} is a ${A.category} pattern (about ${area(A.category)}), while ${B.name} is a ${B.category} pattern (about ${area(B.category)}).`);
      out.innerHTML = `
        <div class="table-wrap"><table class="t compare-table">
          <thead><tr><th scope="col"><span class="visually-hidden">Aspect</span></th><th scope="col">${ph(A)}</th><th scope="col">${ph(B)}</th></tr></thead>
          <tbody>
            ${row(t.rowCategory, `<span class="cat ${A.category}">${t[A.category]}</span>`, `<span class="cat ${B.category}">${t[B.category]}</span>`)}
            ${row(t.rowIntent, escapeHtml(A.intent), escapeHtml(B.intent))}
            ${row(t.rowProblem, escapeHtml(A.problem), escapeHtml(B.problem))}
            ${row(t.rowSolution, escapeHtml(A.solution), escapeHtml(B.solution))}
            ${row(t.rowUse, uses(A), uses(B))}
            ${row(t.rowExample, escapeHtml(A.example), escapeHtml(B.example))}
          </tbody></table></div>
        <div class="callout key-diff"><p><strong>${t.keyDiff}:</strong> ${escapeHtml(diff)}</p></div>`;
    }
    selA.addEventListener("change", render);
    selB.addEventListener("change", render);
    root.querySelector("#cmp-swap").addEventListener("click", () => {
      [selA.value, selB.value] = [selB.value, selA.value];
      render();
    });
    render();
  }
  return { title: t.compareTitle, html, mount };
}

/* ---------------- Scenario quiz ---------------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function quizView() {
  const html = `
  <div class="wrap">
    <header class="page-head"><h1 tabindex="-1">${t.scenarioTitle}</h1><p>${t.scenarioLead}</p></header>
    <div class="quiz" id="quiz"></div>
  </div>`;

  function mount(root) {
    const host = root.querySelector("#quiz");
    let order;
    let optionOrder;
    let idx;
    let answers;

    function start() {
      resetGroup("scenarios");
      order = shuffle(scenarios);
      optionOrder = order.map((s) => shuffle(Object.keys(s.why)));
      idx = 0;
      answers = [];
      renderQuestion();
    }

    function renderQuestion() {
      const s = order[idx];
      const opts = optionOrder[idx]
        .map((id, i) => `<button type="button" class="option" data-id="${id}"><span class="key" aria-hidden="true">${"ABCD"[i]}</span><span class="txt">${byId[id].name}<span class="why" hidden></span></span></button>`)
        .join("");
      host.innerHTML = `
        <div class="quiz-card">
          <div class="quiz-meta"><span class="cat">${t.question(idx + 1, order.length)}</span>${progressBar(idx, order.length, `${idx} / ${order.length}`)}</div>
          <p class="scenario" id="scn" tabindex="-1">${escapeHtml(s.text)}</p>
          <div class="options" role="group" aria-labelledby="scn">${opts}</div>
          <div class="fb" aria-live="polite"></div>
          <div class="ex-actions"><button class="btn" type="button" id="next" hidden>${idx === order.length - 1 ? t.finish : t.nextScenario}</button></div>
        </div>`;
      const card = host.querySelector(".quiz-card");
      card.querySelector(".options").addEventListener("click", (e) => {
        const btn = e.target.closest(".option");
        if (!btn || btn.disabled) return;
        const choice = btn.dataset.id;
        const ok = choice === s.answer;
        card.querySelectorAll(".option").forEach((b) => {
          const id = b.dataset.id;
          b.disabled = true;
          const why = b.querySelector(".why");
          why.textContent = s.why[id];
          why.hidden = false;
          b.classList.add(id === s.answer ? "correct" : id === choice ? "wrong" : "dim");
        });
        card.querySelector(".fb").innerHTML = ok
          ? `<div class="feedback ok"><strong>${t.correct}</strong>${t.readWhy}</div>`
          : `<div class="feedback bad"><strong>${t.notQuite}</strong>${t.correctAnswer}: ${byId[s.answer].name}. ${t.readWhy}</div>`;
        answers.push({ s, choice, ok });
        recordAnswer("scenarios", s.id, ok);
        const nextBtn = card.querySelector("#next");
        nextBtn.hidden = false;
        nextBtn.focus();
      });
      card.querySelector("#next").addEventListener("click", () => {
        idx++;
        if (idx < order.length) {
          renderQuestion();
          host.querySelector(".scenario").focus();
        } else {
          renderDone();
        }
      });
    }

    function renderDone() {
      const c = answers.filter((x) => x.ok).length;
      const review = answers
        .map((x) => `<li class="feedback ${x.ok ? "ok" : "bad"}"><strong>${byId[x.s.answer].name}</strong>${x.ok ? "" : ` (${t.yourAnswer}: ${byId[x.choice].name})`}<p>${escapeHtml(x.s.text)}</p><p>${escapeHtml(x.s.why[x.s.answer])}</p></li>`)
        .join("");
      host.innerHTML = `
        <div class="quiz-card">
          <div class="quiz-done"><p class="score" tabindex="-1">${t.scoreLine(c, answers.length)}</p><p>${t.scoreMsg(c, answers.length)}</p>
            <div class="ex-actions center"><button class="btn" type="button" id="restart">${t.restart}</button>
            <a class="btn secondary" href="${link("compare")}">${t.compareCardTitle}</a></div></div>
          <h2 class="review-title">${t.reviewTitle}</h2>
          <ul class="review">${review}</ul>
        </div>`;
      host.querySelector("#restart").addEventListener("click", start);
      host.querySelector(".score").focus();
    }

    start();
  }
  return { title: t.scenarioTitle, html, mount };
}

/* ---------------- Not found ---------------- */
export function notFoundView() {
  return {
    title: t.notFoundTitle,
    html: `<div class="wrap"><header class="page-head"><h1 tabindex="-1">${t.notFoundTitle}</h1><p>${t.notFoundText}</p><a class="btn" href="${link("")}">${t.backHome}</a></header></div>`,
  };
}
