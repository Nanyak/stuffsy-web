import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  Cloud, Link2, QrCode, KeyRound, Type,
  ArrowRight, Zap, Share2, CheckCircle, MousePointer2,
  Folder, FileText, Copy, Upload,
} from 'lucide-react'

/* ── Design tokens — Light mode ────────────────────────── */
const LIGHT_BG  = 'oklch(0.985 0.003 260)'
const SURFACE   = 'oklch(1 0 0)'
const SURFACE2  = 'oklch(0.976 0.004 260)'
const BORDER    = 'rgba(0,0,0,0.07)'
const BORDER_EM = 'oklch(0.545 0.185 268 / 0.28)'
const PRIMARY   = 'oklch(0.545 0.185 268)'
const PRIMARY_L = 'oklch(0.440 0.185 268)'
const TEXT_HI   = 'oklch(0.180 0.014 260)'
const TEXT_MID  = 'oklch(0.430 0.010 260)'
const TEXT_LO   = 'oklch(0.620 0.008 260)'
const FONT_DISP = "'Syne', system-ui, sans-serif"
const FONT_BODY = "'DM Sans', system-ui, sans-serif"

/* ── Page ─────────────────────────────────────────────────── */
export function HomePage() {
  return (
    <div
      className="full-bleed -mt-8 overflow-x-hidden"
      style={{ background: LIGHT_BG, fontFamily: FONT_BODY, minHeight: '100vh' }}
    >
      <Helmet>
        <title>Stuffsy – Free Online Tools for Everyday Use</title>
        <meta name="description" content="A free collection of useful online tools — cloud file storage, URL shortener, and more. No account required. Fast, simple, and always accessible." />
        <link rel="canonical" href="https://stuffsy.site/" />
        <meta property="og:url" content="https://stuffsy.site/" />
        <meta property="og:title" content="Stuffsy – Free Online Tools for Everyday Use" />
        <meta property="og:description" content="A free collection of useful online tools — cloud file storage, URL shortener, and more." />
      </Helmet>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center px-6 pt-20 pb-24 text-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />
          <div className="absolute inset-0 animate-pulse-glow" style={{
            background: 'radial-gradient(ellipse 75% 50% at 50% -5%, oklch(0.545 0.185 268 / 0.10) 0%, transparent 70%)',
          }} />
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(ellipse 35% 40% at 5% 60%, oklch(0.545 0.185 268 / 0.05) 0%, transparent 65%),
              radial-gradient(ellipse 35% 40% at 95% 40%, oklch(0.630 0.190 268 / 0.04) 0%, transparent 65%)
            `,
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-48" style={{
            background: `linear-gradient(to bottom, transparent, ${LIGHT_BG})`,
          }} />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto">
          {/* Badge */}
          <div className="fade-in-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7 text-xs font-semibold tracking-wide uppercase" style={{
            background: 'oklch(0.545 0.185 268 / 0.08)',
            border: `1px solid ${BORDER_EM}`,
            color: PRIMARY_L,
          }}>
            <Zap className="h-3 w-3" />
            Free &amp; open to everyone
          </div>

          {/* Headline */}
          <h1 className="fade-in-2 text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.04] tracking-tight mb-6" style={{
            fontFamily: FONT_DISP,
            background: `linear-gradient(155deg, oklch(0.160 0.014 260) 0%, oklch(0.260 0.018 265) 40%, oklch(0.545 0.185 268) 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Your tools,<br />in one place.
          </h1>

          {/* Subtext */}
          <p className="fade-in-3 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: TEXT_MID }}>
            A collection of useful online tools to make your everyday life easier — fast, free, and always accessible.
          </p>

          {/* CTAs */}
          <div className="fade-in-4 flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link
              to="/storage"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"
              style={{ background: PRIMARY, color: 'white', boxShadow: '0 0 28px oklch(0.545 0.185 268 / 0.30)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 44px oklch(0.545 0.185 268 / 0.50)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 28px oklch(0.545 0.185 268 / 0.30)' }}
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/shortener"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"
              style={{ border: `1px solid rgba(0,0,0,0.12)`, color: TEXT_MID }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.22)'; e.currentTarget.style.color = TEXT_HI }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = TEXT_MID }}
            >
              Explore Tools
            </Link>
          </div>

          {/* Large mock file browser */}
          <div className="fade-in-5 w-full">
            <MockFileBrowser />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <div className="shimmer-line" style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: 'oklch(0.978 0.004 260 / 0.92)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            {['2 Tools Available', 'Always Free', 'No Account Required', 'Fast & Secure'].map((s, i) => (
              <span key={i} className="flex items-center gap-1.5" style={{ color: 'oklch(0.440 0.060 268)' }}>
                <CheckCircle className="h-3.5 w-3.5" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS (alternating layout) ───────────────── */}
      <section className="relative py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: PRIMARY_L }}>Simple by design</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold" style={{ fontFamily: FONT_DISP, color: TEXT_HI }}>
              Here's how it works
            </h2>
          </div>

          <div className="flex flex-col gap-24">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <StepText num="01" icon={<MousePointer2 className="h-6 w-6" />} title="Pick a tool" desc="Browse our growing collection and choose the tool that fits your need — no account required to get started." />
              <MockStepPicker />
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <StepText num="02" icon={<Zap className="h-6 w-6" />} title="Use it instantly" desc="No downloads, no setup. Everything runs right in your browser. Upload files, shorten links — done in seconds." />
              </div>
              <div className="md:order-1">
                <MockStepUse />
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <StepText num="03" icon={<Share2 className="h-6 w-6" />} title="Share the result" desc="Copy links, download files, or share outputs with anyone. Your results are ready to use immediately." />
              <MockStepShare />
            </div>
          </div>
        </div>
      </section>

      {/* ── AVAILABLE TOOLS ─────────────────────────────────── */}
      <section className="relative py-8 pb-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: PRIMARY_L }}>Available now</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold" style={{ fontFamily: FONT_DISP, color: TEXT_HI }}>
              Tools ready to use
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <ToolCard
              to="/storage"
              icon={<Cloud className="h-7 w-7" />}
              name="Cloud Storage"
              description="Upload, organize, and share your files securely. Folder support, file previews, and shareable links — all in one place."
              preview={<MiniStoragePreview />}
            />
            <ToolCard
              to="/shortener"
              icon={<Link2 className="h-7 w-7" />}
              name="URL Shortener"
              description="Transform long URLs into clean, shareable short links. Copy with one click and share anywhere instantly."
              preview={<MiniShortenerPreview />}
            />
          </div>
        </div>
      </section>

      {/* ── COMING SOON ─────────────────────────────────────── */}
      <section className="relative py-8 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold" style={{ fontFamily: FONT_DISP, color: TEXT_LO }}>Coming soon</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <QrCode className="h-5 w-5" />, name: 'QR Generator', desc: 'Generate QR codes instantly' },
              { icon: <KeyRound className="h-5 w-5" />, name: 'Password Gen', desc: 'Create secure passwords' },
              { icon: <Type className="h-5 w-5" />, name: 'Text Tools', desc: 'Format and convert text' },
            ].map(tool => (
              <div key={tool.name} className="p-5 rounded-xl text-center" style={{ background: SURFACE2, border: `1px solid ${BORDER}`, opacity: 0.65 }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(0,0,0,0.04)', color: TEXT_LO }}>
                  {tool.icon}
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: TEXT_MID }}>{tool.name}</h3>
                <p className="text-xs" style={{ color: TEXT_LO }}>{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="relative py-8 pb-28 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-2xl p-10 text-center overflow-hidden" style={{ background: 'oklch(0.545 0.185 268 / 0.06)', border: `1px solid ${BORDER_EM}` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 110%, oklch(0.545 0.185 268 / 0.10), transparent)' }} />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: FONT_DISP, color: TEXT_HI }}>Ready to get started?</h2>
              <p className="text-base mb-8" style={{ color: TEXT_MID }}>Everything you need, free and ready to use.<br />No signup, no friction.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/storage"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"
                  style={{ background: PRIMARY, color: 'white', boxShadow: '0 0 20px oklch(0.545 0.185 268 / 0.30)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 32px oklch(0.545 0.185 268 / 0.50)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px oklch(0.545 0.185 268 / 0.30)' }}
                >
                  Open Cloud Storage
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/shortener"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"
                  style={{ border: `1px solid rgba(0,0,0,0.12)`, color: TEXT_MID }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.22)'; e.currentTarget.style.color = TEXT_HI }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = TEXT_MID }}
                >
                  Try URL Shortener
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="py-10 px-6" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-base" style={{ fontFamily: FONT_DISP, color: TEXT_MID }}>Stuffsy</p>
            <p className="text-xs mt-0.5" style={{ color: TEXT_LO }}>Built for everyday needs.</p>
          </div>
          <p className="text-xs" style={{ color: TEXT_LO }}>&copy; 2026 Stuffsy. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

/* ── Mock UI: Large file browser (Hero) ─────────────────── */
function MockFileBrowser() {
  const files = [
    { icon: <FileText className="h-4 w-4" />, name: 'project-report.pdf', size: '2.4 MB', color: '#E05252' },
    { icon: <FileText className="h-4 w-4" />, name: 'hero-image.png',     size: '1.2 MB', color: '#0E9D87' },
    { icon: <FileText className="h-4 w-4" />, name: 'design-specs.fig',   size: '8.1 MB', color: '#7C3AED' },
  ]
  return (
    <div style={{
      background: SURFACE,
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 40px 80px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)',
      maxWidth: '860px',
      margin: '0 auto',
      userSelect: 'none',
    }}>
      {/* Title bar */}
      <div style={{ background: 'oklch(0.970 0.004 260)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FFBD2E' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28CA41' }} />
        </div>
        <div style={{ flex: 1, height: 24, borderRadius: '6px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', paddingInline: '10px', fontSize: '11px', color: TEXT_LO, maxWidth: '280px', margin: '0 auto' }}>
          stuffsy.site/storage
        </div>
      </div>

      {/* App body */}
      <div style={{ display: 'flex', minHeight: '260px' }}>
        {/* Sidebar */}
        <div style={{ width: '160px', flexShrink: 0, borderRight: '1px solid rgba(0,0,0,0.05)', background: 'oklch(0.978 0.004 260)', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ background: PRIMARY, color: 'white', borderRadius: '7px', padding: '7px 10px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Upload className="h-3 w-3" />
            Upload Files
          </div>
          {['All Files', 'Documents', 'Images', 'Shared'].map((item, i) => (
            <div key={item} style={{ padding: '5px 10px', borderRadius: '5px', fontSize: '11px', color: i === 0 ? PRIMARY_L : TEXT_LO, background: i === 0 ? 'oklch(0.545 0.185 268 / 0.09)' : 'transparent', fontWeight: i === 0 ? 600 : 400 }}>
              {item}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: '16px', minWidth: 0, background: SURFACE }}>
          {/* Folders row */}
          <p style={{ fontSize: '10px', color: TEXT_LO, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Folders</p>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
            {[{ name: 'Documents', n: '12 files' }, { name: 'Photos', n: '34 files' }, { name: 'Projects', n: '8 files' }].map(f => (
              <div key={f.name} style={{ flex: 1, background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '9px', padding: '11px' }}>
                <Folder className="h-5 w-5" style={{ color: PRIMARY_L, marginBottom: '7px' }} />
                <p style={{ fontSize: '11px', fontWeight: 600, color: TEXT_HI, marginBottom: '2px' }}>{f.name}</p>
                <p style={{ fontSize: '10px', color: TEXT_LO }}>{f.n}</p>
              </div>
            ))}
          </div>

          {/* Files */}
          <p style={{ fontSize: '10px', color: TEXT_LO, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Files</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {files.map(f => (
              <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '7px 9px', borderRadius: '7px', background: 'rgba(0,0,0,0.02)' }}>
                <span style={{ color: f.color, flexShrink: 0 }}>{f.icon}</span>
                <span style={{ flex: 1, fontSize: '11px', color: TEXT_MID, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                <span style={{ fontSize: '10px', color: TEXT_LO, flexShrink: 0 }}>{f.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Mock UIs: How it works ─────────────────────────────── */
function MockStepPicker() {
  return (
    <MockPanel>
      <p style={{ fontSize: '11px', color: TEXT_LO, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Available Tools</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { icon: <Cloud className="h-4 w-4" />, name: 'Cloud Storage', tag: 'Live' },
          { icon: <Link2 className="h-4 w-4" />, name: 'URL Shortener', tag: 'Live' },
          { icon: <QrCode className="h-4 w-4" />, name: 'QR Generator', tag: 'Soon', dim: true },
        ].map(t => (
          <div key={t.name} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 11px', borderRadius: '9px',
            background: t.dim ? 'rgba(0,0,0,0.02)' : 'oklch(0.545 0.185 268 / 0.08)',
            border: t.dim ? '1px solid rgba(0,0,0,0.05)' : `1px solid ${BORDER_EM}`,
            opacity: t.dim ? 0.50 : 1,
          }}>
            <span style={{ color: t.dim ? TEXT_LO : PRIMARY_L }}>{t.icon}</span>
            <span style={{ flex: 1, fontSize: '12px', fontWeight: 600, color: t.dim ? TEXT_LO : TEXT_HI }}>{t.name}</span>
            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '99px', background: t.dim ? 'rgba(0,0,0,0.05)' : 'oklch(0.545 0.185 268 / 0.12)', color: t.dim ? TEXT_LO : PRIMARY_L }}>
              {t.tag}
            </span>
          </div>
        ))}
      </div>
    </MockPanel>
  )
}

function MockStepUse() {
  return (
    <MockPanel>
      <p style={{ fontSize: '11px', color: TEXT_LO, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Upload Files</p>
      {/* Drop zone */}
      <div style={{
        border: `1.5px dashed oklch(0.545 0.185 268 / 0.35)`,
        borderRadius: '10px', padding: '22px', textAlign: 'center',
        background: 'oklch(0.545 0.185 268 / 0.04)', marginBottom: '14px',
      }}>
        <Upload className="h-6 w-6" style={{ color: PRIMARY_L, margin: '0 auto 8px' }} />
        <p style={{ fontSize: '12px', fontWeight: 600, color: TEXT_MID, marginBottom: '2px' }}>Drop files here</p>
        <p style={{ fontSize: '11px', color: TEXT_LO }}>or click to browse</p>
      </div>
      {/* Progress bar */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '11px', color: TEXT_MID }}>project-report.pdf</span>
          <span style={{ fontSize: '11px', color: PRIMARY_L }}>72%</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(0,0,0,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ width: '72%', height: '100%', background: `linear-gradient(90deg, ${PRIMARY}, oklch(0.620 0.185 268))`, borderRadius: '99px' }} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '11px', color: TEXT_MID }}>hero-image.png</span>
          <span style={{ fontSize: '11px', color: 'oklch(0.42 0.150 145)' }}>Done</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(0,0,0,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, oklch(0.45 0.150 145), oklch(0.55 0.170 145))', borderRadius: '99px' }} />
        </div>
      </div>
    </MockPanel>
  )
}

function MockStepShare() {
  return (
    <MockPanel>
      <p style={{ fontSize: '11px', color: TEXT_LO, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Shared Links</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { label: 'stuffsy.site/xK9p', copied: true },
          { label: 'stuffsy.site/mR3t', copied: false },
          { label: 'stuffsy.site/qZw2', copied: false },
        ].map((l, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '9px 11px', borderRadius: '9px',
            background: l.copied ? 'oklch(0.545 0.185 268 / 0.07)' : 'rgba(0,0,0,0.03)',
            border: l.copied ? `1px solid ${BORDER_EM}` : '1px solid rgba(0,0,0,0.05)',
          }}>
            <span style={{ flex: 1, fontSize: '12px', fontFamily: 'monospace', color: l.copied ? PRIMARY_L : TEXT_MID }}>{l.label}</span>
            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '99px', background: l.copied ? 'oklch(0.545 0.185 268 / 0.12)' : 'rgba(0,0,0,0.06)', color: l.copied ? PRIMARY_L : TEXT_LO, display: 'flex', alignItems: 'center', gap: '4px' }}>
              {l.copied ? <><CheckCircle className="h-2.5 w-2.5" /> Copied</> : <><Copy className="h-2.5 w-2.5" /> Copy</>}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '12px', padding: '9px 11px', borderRadius: '9px', background: 'oklch(0.45 0.150 145 / 0.09)', border: '1px solid oklch(0.45 0.150 145 / 0.22)', display: 'flex', alignItems: 'center', gap: '7px' }}>
        <CheckCircle className="h-4 w-4" style={{ color: 'oklch(0.42 0.170 145)', flexShrink: 0 }} />
        <span style={{ fontSize: '12px', color: 'oklch(0.38 0.120 145)' }}>Link copied to clipboard!</span>
      </div>
    </MockPanel>
  )
}

/* ── Mini previews for Tool cards ───────────────────────── */
function MiniStoragePreview() {
  return (
    <div style={{ padding: '12px', borderRadius: '10px', background: SURFACE2, border: `1px solid ${BORDER}`, marginBottom: '4px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        {['Documents', 'Photos'].map(name => (
          <div key={name} style={{ flex: 1, background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '7px', padding: '8px' }}>
            <Folder className="h-4 w-4" style={{ color: PRIMARY_L, marginBottom: '5px' }} />
            <p style={{ fontSize: '10px', fontWeight: 600, color: TEXT_MID }}>{name}</p>
          </div>
        ))}
      </div>
      {[{ name: 'report.pdf', size: '2.4 MB' }, { name: 'image.png', size: '1.2 MB' }].map(f => (
        <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 7px', borderRadius: '5px', background: 'rgba(0,0,0,0.02)' }}>
          <FileText className="h-3 w-3" style={{ color: '#7C3AED' }} />
          <span style={{ flex: 1, fontSize: '10px', color: TEXT_MID }}>{f.name}</span>
          <span style={{ fontSize: '10px', color: TEXT_LO }}>{f.size}</span>
        </div>
      ))}
    </div>
  )
}

function MiniShortenerPreview() {
  return (
    <div style={{ padding: '12px', borderRadius: '10px', background: SURFACE2, border: `1px solid ${BORDER}`, marginBottom: '4px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        <div style={{ flex: 1, height: '30px', borderRadius: '6px', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', paddingInline: '9px', fontSize: '10px', color: TEXT_LO }}>
          https://very-long-url.com/page/with/params...
        </div>
        <div style={{ height: '30px', paddingInline: '10px', borderRadius: '6px', background: PRIMARY, display: 'flex', alignItems: 'center', fontSize: '10px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
          Shorten
        </div>
      </div>
      {[{ label: 'stuffsy.site/xK9p', copied: true }, { label: 'stuffsy.site/mR3t', copied: false }].map((l, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 8px', borderRadius: '6px', background: l.copied ? 'oklch(0.545 0.185 268 / 0.07)' : 'rgba(0,0,0,0.02)', border: l.copied ? `1px solid ${BORDER_EM}` : '1px solid rgba(0,0,0,0.05)', marginBottom: '4px' }}>
          <span style={{ flex: 1, fontSize: '10px', fontFamily: 'monospace', color: l.copied ? PRIMARY_L : TEXT_MID }}>{l.label}</span>
          <Copy className="h-3 w-3" style={{ color: l.copied ? PRIMARY_L : TEXT_LO }} />
        </div>
      ))}
    </div>
  )
}

/* ── Shared: window chrome wrapper ──────────────────────── */
function MockPanel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: SURFACE,
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
      userSelect: 'none',
    }}>
      {/* Window chrome */}
      <div style={{ background: 'oklch(0.970 0.004 260)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '9px 13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#FFBD2E' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#28CA41' }} />
      </div>
      <div style={{ padding: '16px' }}>{children}</div>
    </div>
  )
}

/* ── Step text block ────────────────────────────────────── */
function StepText({ num, icon, title, desc }: { num: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '3rem', height: '3rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'oklch(0.545 0.185 268 / 0.09)', border: `1px solid ${BORDER_EM}`, color: PRIMARY_L, flexShrink: 0 }}>
          {icon}
        </div>
        <span style={{ fontSize: '12px', fontWeight: 800, color: PRIMARY_L, letterSpacing: '0.08em' }}>{num}</span>
      </div>
      <h3 style={{ fontFamily: FONT_DISP, fontSize: '28px', fontWeight: 700, color: TEXT_HI, marginBottom: '10px', lineHeight: 1.2 }}>{title}</h3>
      <p style={{ fontSize: '15px', lineHeight: 1.7, color: TEXT_MID }}>{desc}</p>
    </div>
  )
}

/* ── Tool card ──────────────────────────────────────────── */
function ToolCard({ to, icon, name, description, preview }: {
  to: string; icon: React.ReactNode; name: string; description: string; preview: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className="group block p-6 rounded-2xl transition-all duration-300 cursor-pointer"
      style={{ background: SURFACE, border: `1px solid ${BORDER}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => {
        e.currentTarget.style.border = `1px solid oklch(0.545 0.185 268 / 0.35)`
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08), 0 0 0 1px oklch(0.545 0.185 268 / 0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = `1px solid ${BORDER}`
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
      }}
    >
      {/* Mini preview */}
      {preview}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'oklch(0.545 0.185 268 / 0.10)', border: `1px solid ${BORDER_EM}`, color: PRIMARY_L }}>
          {icon}
        </div>
        <span style={{ fontSize: '10px', padding: '3px 9px', borderRadius: '99px', background: 'oklch(0.545 0.185 268 / 0.09)', color: PRIMARY_L, border: `1px solid ${BORDER_EM}`, fontWeight: 600 }}>
          Live
        </span>
      </div>

      <h3 className="flex items-center gap-2 text-lg font-bold mb-2 transition-colors duration-200" style={{ fontFamily: FONT_DISP, color: TEXT_HI }}>
        {name}
        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" style={{ color: PRIMARY }} />
      </h3>
      <p style={{ fontSize: '13px', lineHeight: 1.6, color: TEXT_MID }}>{description}</p>
    </Link>
  )
}
