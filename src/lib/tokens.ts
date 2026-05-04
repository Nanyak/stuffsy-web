/**
 * Hyperstudio design tokens — dark terminal with amber accents.
 */

/* ── Raw palette ── */
export const ink    = '#F3F3F3'   // Polar White   — primary text
export const white  = '#FFFFFF'   // Absolute Zero — pure white
export const sage   = '#080808'   // Deep Space    — card/sidebar surface
export const stone  = '#333333'   // Dark Carbon   — borders, button bg
export const gun    = '#949494'   // Ash Gray      — secondary text
export const soft   = '#E7C59A'   // Amber Glow    — accent
export const black  = '#333333'   // Dark Carbon   — filled button bg
export const orange = '#E7C59A'   // Amber Glow    — accent (alias)
export const neon   = '#00AC5C'   // Neon Green    — success/status
export const void_  = '#101010'   // Midnight Void — page background
export const font     = "'Inter', system-ui, sans-serif"
export const fontMono = "'IBM Plex Mono', ui-monospace, monospace"

/* ── Semantic T aliases (used by ShortenerPage, AiPage, etc.) ── */
export const T = {
  primary:   '#E7C59A',    // Amber Glow
  primaryL:  '#E7C59A',
  success:   '#00AC5C',    // Neon Green
  textHi:    '#F3F3F3',
  textMid:   '#949494',
  textLo:    '#949494',
  surface:   '#080808',
  surface2:  '#101010',
  border:    '#333333',
  borderEm:  'rgba(231,197,154,0.30)',
  primaryBg: 'rgba(231,197,154,0.08)',
  fontDisp:  "'Inter', system-ui, sans-serif",
  fontBody:  "'Inter', system-ui, sans-serif",
  fontMono:  "'IBM Plex Mono', ui-monospace, monospace",
} as const
