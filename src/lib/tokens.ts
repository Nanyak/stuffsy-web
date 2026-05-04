/**
 * Hyperstudio design tokens — dark terminal with blue interactive + amber brand accents.
 */

/* ── Raw palette ── */
export const ink    = '#F3F3F3'   // Polar White   — primary text
export const white  = '#FFFFFF'   // Absolute Zero — pure white
export const sage   = '#161616'   // Deep Space    — card/sidebar surface
export const stone  = '#3D3D3D'   // Dark Carbon   — borders
export const gun    = '#ABABAB'   // Ash Gray      — secondary text
export const soft   = '#E7C59A'   // Amber Glow    — brand accent (NEW badge, emphasis)
export const black  = '#333333'   // Dark Carbon   — filled button bg
export const orange = '#E7C59A'   // Amber Glow    — accent (alias)
export const neon   = '#00AC5C'   // Neon Green    — success/status
export const blue   = '#5B8DEF'   // Storage Blue  — interactive primary
export const void_  = '#101010'   // Midnight Void — page background
export const font     = "'Inter', system-ui, sans-serif"
export const fontMono = "'IBM Plex Mono', ui-monospace, monospace"

/* ── Semantic T aliases (used by ShortenerPage, AiPage, etc.) ── */
export const T = {
  primary:   '#5B8DEF',    // Storage Blue — interactive primary
  primaryL:  '#5B8DEF',
  amber:     '#E7C59A',    // Amber Glow   — brand badge / emphasis only
  success:   '#00AC5C',    // Neon Green
  textHi:    '#F3F3F3',
  textMid:   '#ABABAB',
  textLo:    '#ABABAB',
  surface:   '#161616',
  surface2:  '#101010',
  border:    '#3D3D3D',
  borderEm:  'rgba(91,141,239,0.35)',
  primaryBg: 'rgba(91,141,239,0.08)',
  fontDisp:  "'Inter', system-ui, sans-serif",
  fontBody:  "'Inter', system-ui, sans-serif",
  fontMono:  "'IBM Plex Mono', ui-monospace, monospace",
} as const
