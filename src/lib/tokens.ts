/**
 * Design token references for inline-style usage.
 * Values are CSS custom property references so they automatically
 * adapt when the `.dark` class is applied to the document root.
 */
export const T = {
  primary:   'var(--primary)',           // indigo — auto adapts in dark mode
  primaryL:  'var(--c-primary-text)',    // darker/lighter primary for text & icons
  textHi:    'var(--foreground)',        // high-emphasis text
  textMid:   'var(--muted-foreground)',  // medium-emphasis text
  textLo:    'var(--c-text-lo)',         // low-emphasis / placeholder text
  surface:   'var(--card)',             // primary card surface
  surface2:  'var(--secondary)',         // slightly tinted alternate surface
  border:    'var(--c-border-subtle)',   // hairline card border
  borderEm:  'var(--c-border-primary)', // primary-tinted emphasis border
  primaryBg: 'var(--c-primary-bg)',     // primary color at ~10% opacity
  fontDisp:  "'Syne', system-ui, sans-serif",
  fontBody:  "'DM Sans', system-ui, sans-serif",
} as const
