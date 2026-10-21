// App shell: hash router, theme switching, header and footer.
//
// Routes live in the URL hash, so GitHub Pages always serves index.html
// and direct links and refreshes work without any server configuration:
//   #/                          home
//   #/patterns                  home, scrolled to the pattern list
//   #/patterns/builder          pattern guide
//   #/patterns/builder/code     pattern guide, scrolled to a section
//   #/compare?a=x&b=y           comparison tool
//   #/quiz                      scenario quiz

import t from "../../content/ui.js";
import { repositoryUrl } from "../../content/site.js";
import { ICONS } from "./components.js";
import { homeView, patternView, compareView, quizView, notFoundView } from "./views.js";
import { setPref } from "./store.js";

const app = document.getElementById("app");
let cleanup = null;
let lastPage = "";
let booted = false;

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [pathPart, queryPart = ""] = raw.split("?");
  let segs = pathPart.split("/").filter(Boolean).map(decodeURIComponent);
  // Older links carried a language prefix (#/en/...). Drop it.
  if (segs[0] === "en" || segs[0] === "ar") segs = segs.slice(1);
  return { segs, query: new URLSearchParams(queryPart) };
}

function renderChrome(active) {
  const nav = [["patterns", t.nav.patterns, "#/patterns"], ["compare", t.nav.compare, "#/compare"], ["quiz", t.nav.quiz, "#/quiz"]];
  document.getElementById("main-nav").innerHTML = nav
    .map(([key, label, href]) => `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");
  updateThemeButton();
}

function renderFooter() {
  const repo = repositoryUrl();
  document.getElementById("footer").innerHTML = `
    <span>${t.footerLicense} ${repo ? `<a href="${repo}/blob/main/LICENSE">${t.footerLicenseLink}</a>` : t.footerLicenseLink}.</span>
    ${repo ? `<a href="${repo}">${t.footerSource}</a>` : ""}
    <span>${t.footerNote}</span>`;
}

function updateThemeButton() {
  const btn = document.getElementById("theme-btn");
  const dark = document.documentElement.dataset.theme === "dark";
  btn.innerHTML = dark ? ICONS.sun : ICONS.moon;
  btn.setAttribute("aria-label", dark ? t.themeToLight : t.themeToDark);
  btn.title = btn.getAttribute("aria-label");
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ block: "start" });
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

function route() {
  const { segs, query } = parseHash();
  const [first, second, third] = segs;
  let view = null;
  let active = "";
  let section = null;

  if (!first) view = homeView();
  else if (first === "patterns" && !second) { view = homeView(); active = "patterns"; section = "patterns"; }
  else if (first === "patterns" && segs.length <= 3) { view = patternView(second, third); active = "patterns"; section = view?.focusSection; }
  else if (first === "compare" && !second) { view = compareView(query); active = "compare"; }
  else if (first === "quiz" && !second) { view = quizView(); active = "quiz"; }
  if (!view) view = notFoundView();

  renderChrome(active);

  // Moving between sections of the same guide: scroll only, keep exercise state.
  const page = `${first || ""}/${second || ""}`;
  if (page === lastPage && first === "patterns" && second && section) {
    scrollToSection(section);
    return;
  }
  lastPage = page;

  if (cleanup) { try { cleanup(); } catch { /* ignore */ } cleanup = null; }
  app.innerHTML = `<div class="route-enter">${view.html}</div>`;
  document.title = view.title ? `${view.title} · ${t.siteName}` : t.siteName;
  if (view.mount) cleanup = view.mount(app) || null;

  if (section) {
    requestAnimationFrame(() => scrollToSection(section));
  } else {
    window.scrollTo(0, 0);
    const h1 = app.querySelector("h1");
    if (booted && h1) {
      if (!h1.hasAttribute("tabindex")) h1.setAttribute("tabindex", "-1");
      h1.focus({ preventScroll: true });
    }
  }
  booted = true;
}

document.getElementById("theme-btn").addEventListener("click", () => {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  setPref("jdpg-theme", next);
  updateThemeButton();
});

document.getElementById("skip-link").addEventListener("click", (e) => {
  e.preventDefault();
  app.focus();
});

renderFooter();
window.addEventListener("hashchange", route);
route();
