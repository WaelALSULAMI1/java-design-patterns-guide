// A small, dependency-free Java highlighter.
// It works line by line (so the code viewer can number and highlight lines)
// and remembers whether a /* block comment */ is still open between lines.

const KEYWORDS = new Set((
  "abstract assert boolean break byte case catch char class const continue default do double else enum " +
  "extends final finally float for goto if implements import instanceof int interface long native new " +
  "package private protected public return short static strictfp super switch synchronized this throw " +
  "throws transient try void volatile while var record yield sealed permits non-sealed true false null"
).split(" "));

export function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const span = (cls, text) => `<span class="${cls}">${escapeHtml(text)}</span>`;

function highlightFragment(text) {
  const re = /(\/\/.*$)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])+')|(@[A-Za-z_]\w*)|(\b\d[\d_]*(?:\.\d+)?[fFdDlL]?\b)|([A-Za-z_$][\w$]*)/g;
  let out = "";
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    out += escapeHtml(text.slice(last, m.index));
    const [tok, com, str, chr, ann, num, word] = m;
    if (com) out += span("tk-com", tok);
    else if (str || chr) out += span("tk-str", tok);
    else if (ann) out += span("tk-ann", tok);
    else if (num) out += span("tk-num", tok);
    else if (word) {
      if (KEYWORDS.has(word)) out += span("tk-kw", tok);
      else if (/^[A-Z]/.test(word)) out += span("tk-type", tok);
      else out += escapeHtml(tok);
    }
    last = m.index + tok.length;
  }
  return out + escapeHtml(text.slice(last));
}

/** Returns one HTML string per source line. */
export function highlightJava(source) {
  const lines = source.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n");
  let inComment = false;
  return lines.map((line) => {
    let html = "";
    let rest = line;
    while (rest.length) {
      if (inComment) {
        const end = rest.indexOf("*/");
        if (end === -1) { html += span("tk-com", rest); rest = ""; }
        else { html += span("tk-com", rest.slice(0, end + 2)); rest = rest.slice(end + 2); inComment = false; }
      } else {
        const start = findBlockStart(rest);
        if (start === -1) { html += highlightFragment(rest); rest = ""; }
        else { html += highlightFragment(rest.slice(0, start)); rest = rest.slice(start); inComment = true; html += span("tk-com", rest.slice(0, 2)); rest = rest.slice(2); }
      }
    }
    return html;
  });
}

// Finds "/*" that is not inside a string or after a "//" comment.
function findBlockStart(text) {
  let inStr = false;
  for (let i = 0; i < text.length - 1; i++) {
    const c = text[i];
    if (inStr) {
      if (c === "\\") i++;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "/" && text[i + 1] === "/") return -1;
    else if (c === "/" && text[i + 1] === "*") return i;
  }
  return -1;
}
