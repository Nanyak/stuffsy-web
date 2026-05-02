/**
 * Titan design tokens — single source of truth for inline-style usage.
 * Monochrome palette, light mode only.
 */

/* ── Raw palette ────────────────────────────────────────────── */
export const ink   = '#111111'   // Midnight Ink   — primary text
export const white = '#ffffff'   // Canvas White   — page background
export const sage  = '#f3efeb'   // Off-White Sage — secondary surface / cards
export const stone = '#e9eaeb'   // Faded Stone    — borders, dividers
export const gun   = '#615e5b'   // Gunmetal Gray  — secondary / muted text
export const soft  = '#d8d3cc'   // Soft Concrete  — ghost button borders
export const black = '#000000'   // Action Black   — primary buttons, active states
export const orange = '#ff9900'  // Highlight Orange — decorative accents only

export const font = "'Inter', system-ui, sans-serif"

/* ── Semantic aliases (kept for backward-compat with T.* usage) ── */
export const T = {
  primary:   black,
  primaryL:  ink,
  textHi:    ink,
  textMid:   gun,
  textLo:    gun,
  surface:   white,
  surface2:  sage,
  border:    stone,
  borderEm:  soft,
  primaryBg: sage,
  fontDisp:  font,
  fontBody:  font,
} as const
