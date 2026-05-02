/**
 * Titan design token references for inline-style usage.
 * Monochrome palette — light mode only.
 */
export const T = {
  primary:   '#000000',           // action black — filled buttons, active states
  primaryL:  '#111111',           // midnight ink — primary emphasis text & icons
  textHi:    '#111111',           // midnight ink — high-emphasis text
  textMid:   '#615e5b',           // gunmetal gray — body / secondary text
  textLo:    '#615e5b',           // gunmetal gray — muted labels, captions
  surface:   '#ffffff',           // canvas white — primary card surface
  surface2:  '#f3efeb',           // off-white sage — secondary surface / feature cards
  border:    '#e9eaeb',           // faded stone — hairline borders & dividers
  borderEm:  '#d8d3cc',           // soft concrete — ghost button borders
  primaryBg: '#f3efeb',           // off-white sage — tinted background areas
  fontDisp:  "'Inter', system-ui, sans-serif",
  fontBody:  "'Inter', system-ui, sans-serif",
} as const
