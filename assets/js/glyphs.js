// One small structural drawing per pattern. Each glyph sketches the idea of the
// pattern, not a logo: one instance, a copy, stacked steps, a tree, and so on.
// All glyphs use a 48 x 48 viewBox and inherit their colour from `currentColor`.

const G = {
  singleton: `
    <circle class="g-stroke" cx="24" cy="24" r="16"/>
    <circle class="g-stroke g-dash" cx="24" cy="24" r="9"/>
    <circle class="g-accent" cx="24" cy="24" r="4.5"/>`,

  prototype: `
    <rect class="g-stroke" x="7" y="9" width="22" height="22" rx="4"/>
    <rect class="g-stroke g-dash" x="19" y="17" width="22" height="22" rx="4"/>
    <rect class="g-accent" x="11" y="13" width="6" height="6" rx="1.5"/>
    <rect class="g-fill" x="23" y="21" width="6" height="6" rx="1.5" opacity=".35"/>`,

  builder: `
    <path class="g-stroke" d="M8 38h32"/>
    <rect class="g-stroke" x="10" y="29" width="28" height="7" rx="2"/>
    <rect class="g-stroke" x="14" y="20" width="20" height="7" rx="2"/>
    <rect class="g-accent" x="18" y="11" width="12" height="7" rx="2"/>`,

  "factory-method": `
    <rect class="g-stroke" x="6" y="16" width="16" height="16" rx="3"/>
    <path class="g-stroke" d="M22 24h6m0 0-3-3m3 3-3 3"/>
    <circle class="g-stroke" cx="37" cy="12" r="5"/>
    <rect class="g-accent" x="32" y="19.5" width="10" height="9" rx="2"/>
    <path class="g-stroke" d="M37 31l5 8h-10z"/>`,

  "abstract-factory": `
    <rect class="g-stroke" x="6" y="6" width="36" height="36" rx="5"/>
    <path class="g-stroke g-dash" d="M6 24h36"/>
    <circle class="g-accent" cx="15" cy="15" r="4"/>
    <rect class="g-accent" x="27" y="11" width="8" height="8" rx="1.5"/>
    <circle class="g-stroke" cx="15" cy="33" r="4"/>
    <rect class="g-stroke" x="27" y="29" width="8" height="8" rx="1.5"/>`,

  adapter: `
    <path class="g-stroke" d="M6 16h12v16H6"/>
    <path class="g-stroke" d="M18 20h4m-4 8h4"/>
    <rect class="g-accent" x="22" y="17" width="8" height="14" rx="2"/>
    <path class="g-stroke" d="M30 24h4"/>
    <rect class="g-stroke" x="34" y="14" width="8" height="20" rx="2"/>
    <circle class="g-fill" cx="38" cy="24" r="1.8"/>`,

  bridge: `
    <rect class="g-stroke" x="6" y="8" width="12" height="9" rx="2"/>
    <rect class="g-stroke" x="6" y="31" width="12" height="9" rx="2"/>
    <path class="g-stroke" d="M12 17v14"/>
    <rect class="g-stroke" x="30" y="8" width="12" height="9" rx="2"/>
    <rect class="g-stroke" x="30" y="31" width="12" height="9" rx="2"/>
    <path class="g-stroke" d="M36 17v14"/>
    <rect class="g-accent" x="16" y="21.5" width="16" height="5" rx="2.5"/>`,

  composite: `
    <rect class="g-accent" x="19" y="5" width="10" height="9" rx="2"/>
    <path class="g-stroke" d="M24 14v5M12 19h24M12 19v5M36 19v5"/>
    <rect class="g-stroke" x="7" y="24" width="10" height="8" rx="2"/>
    <rect class="g-stroke" x="31" y="24" width="10" height="8" rx="2"/>
    <path class="g-stroke" d="M36 32v4M30 36h12M30 36v2M42 36v2"/>
    <circle class="g-fill" cx="30" cy="41" r="2.4"/>
    <circle class="g-fill" cx="42" cy="41" r="2.4"/>`,
};

export function glyph(id, extraClass = "") {
  const body = G[id] || "";
  return `<svg class="glyph ${extraClass}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${body}</svg>`;
}
