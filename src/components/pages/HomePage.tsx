import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  Cloud, Link2, QrCode, KeyRound, Type,
  ArrowRight, Zap, Share2, CheckCircle, MousePointer2,
  Folder, FileText, Copy, Upload,
} from 'lucide-react'

/* ── Titan palette shortcuts ───────────────────────────────── */
const INK    = '#111111'
const GUN    = '#615e5b'
const SAGE   = '#f3efeb'
const STONE  = '#e9eaeb'
const SOFT   = '#d8d3cc'
const BLACK  = '#000000'
const WHITE  = '#ffffff'
const FONT   = "'Inter', system-ui, sans-serif"

/* ── Pill button helpers ───────────────────────────────────── */
const pillPrimary: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  background: BLACK, color: WHITE,
  padding: '12px 28px', borderRadius: '160px',
  fontWeight: 600, fontSize: '14px', textDecoration: 'none',
  fontFamily: FONT, cursor: 'pointer', transition: 'opacity 150ms',
}
const pillGhost: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  background: WHITE, color: INK,
  padding: '11px 24px', borderRadius: '160px',
  border: `1px solid ${SOFT}`,
  fontWeight: 600, fontSize: '14px', textDecoration: 'none',
  fontFamily: FONT, cursor: 'pointer', transition: 'border-color 150ms',
}

export function HomePage() {
  return (
    <div
      className="full-bleed -mt-8 overflow-x-hidden"
      style={{ background: WHITE, fontFamily: FONT, minHeight: '100vh' }}
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
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '88px 24px 80px' }}>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            {/* Badge */}
            <div
              className="fade-in-1 inline-flex items-center gap-2 mb-8"
              style={{
                padding: '5px 16px', borderRadius: '160px',
                border: `1px solid ${STONE}`,
                fontSize: '12px', fontWeight: 500, color: GUN,
              }}
            >
              <Zap className="h-3 w-3" />
              Free &amp; open to everyone
            </div>

            {/* Headline */}
            <h1
              className="fade-in-2"
              style={{
                fontSize: 'clamp(40px, 5vw, 60px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: INK,
                marginBottom: '24px',
              }}
            >
              Your tools,<br />in one place.
            </h1>

            {/* Subtext */}
            <p
              className="fade-in-3"
              style={{
                fontSize: '16px', lineHeight: 1.6,
                color: GUN, marginBottom: '40px', maxWidth: '400px',
              }}
            >
              A collection of useful online tools to make your everyday life easier — fast, free, and always accessible.
            </p>

            {/* CTAs */}
            <div className="fade-in-4 flex flex-wrap gap-3">
              <Link
                to="/storage"
                style={pillPrimary}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shortener"
                style={pillGhost}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = INK }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = SOFT }}
              >
                Explore Tools
              </Link>
            </div>
          </div>

          {/* Right: mock browser */}
          <div className="fade-in-5">
            <MockFileBrowser />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${STONE}`, borderBottom: `1px solid ${STONE}`, background: SAGE }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 24px' }}>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {['2 Tools Available', 'Always Free', 'No Account Required', 'Fast & Secure'].map((s, i) => (
              <span key={i} className="flex items-center gap-2 text-xs font-medium" style={{ color: GUN }}>
                <CheckCircle className="h-3.5 w-3.5" style={{ color: INK }} />
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GUN }}>Simple by design</span>
          <h2 style={{ marginTop: '12px', fontSize: '40px', fontWeight: 700, letterSpacing: '-0.03em', color: INK }}>
            Here's how it works
          </h2>
        </div>

        <div className="flex flex-col gap-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <StepText num="01" icon={<MousePointer2 className="h-5 w-5" />} title="Pick a tool" desc="Browse our growing collection and choose the tool that fits your need — no account required to get started." />
            <MockStepPicker />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
              <StepText num="02" icon={<Zap className="h-5 w-5" />} title="Use it instantly" desc="No downloads, no setup. Everything runs right in your browser. Upload files, shorten links — done in seconds." />
            </div>
            <div className="md:order-1">
              <MockStepUse />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <StepText num="03" icon={<Share2 className="h-5 w-5" />} title="Share the result" desc="Copy links, download files, or share outputs with anyone. Your results are ready to use immediately." />
            <MockStepShare />
          </div>
        </div>
      </section>

      {/* ── AVAILABLE TOOLS ─────────────────────────────────── */}
      <section style={{ background: SAGE, borderTop: `1px solid ${STONE}`, borderBottom: `1px solid ${STONE}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GUN }}>Available now</span>
            <h2 style={{ marginTop: '12px', fontSize: '40px', fontWeight: 700, letterSpacing: '-0.03em', color: INK }}>
              Tools ready to use
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <ToolCard
              to="/storage"
              icon={<Cloud className="h-6 w-6" />}
              name="Cloud Storage"
              description="Upload, organize, and share your files securely. Folder support, file previews, and shareable links — all in one place."
              preview={<MiniStoragePreview />}
            />
            <ToolCard
              to="/shortener"
              icon={<Link2 className="h-6 w-6" />}
              name="URL Shortener"
              description="Transform long URLs into clean, shareable short links. Copy with one click and share anywhere instantly."
              preview={<MiniShortenerPreview />}
            />
          </div>
        </div>
      </section>

      {/* ── COMING SOON ─────────────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div className="text-center mb-10">
          <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', color: GUN }}>Coming soon</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: <QrCode className="h-5 w-5" />,  name: 'QR Generator',   desc: 'Generate QR codes instantly' },
            { icon: <KeyRound className="h-5 w-5" />, name: 'Password Gen',   desc: 'Create secure passwords' },
            { icon: <Type className="h-5 w-5" />,     name: 'Text Tools',     desc: 'Format and convert text' },
          ].map(tool => (
            <div
              key={tool.name}
              className="p-7 text-center"
              style={{
                background: WHITE, border: `1px solid ${STONE}`,
                borderRadius: '32px', opacity: 0.5,
              }}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center mx-auto mb-4"
                style={{ background: SAGE, color: GUN }}
              >
                {tool.icon}
              </div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: INK }}>{tool.name}</h3>
              <p className="text-xs" style={{ color: GUN }}>{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section style={{ background: SAGE, borderTop: `1px solid ${STONE}` }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.03em', color: INK, marginBottom: '16px' }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.6, color: GUN, marginBottom: '40px' }}>
            Everything you need, free and ready to use.<br />No signup, no friction.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/storage"
              style={pillPrimary}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
            >
              Open Cloud Storage <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/shortener"
              style={pillGhost}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = INK }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = SOFT }}
            >
              Try URL Shortener
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${STONE}` }}>
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 py-10 px-6"
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          <div>
            <p className="font-bold text-base" style={{ letterSpacing: '-0.03em', color: INK }}>Stuffsy</p>
            <p className="text-xs mt-1" style={{ color: GUN }}>Built for everyday needs.</p>
          </div>
          <p className="text-xs" style={{ color: GUN }}>&copy; 2026 Stuffsy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

/* ── Mock UI: Large file browser (Hero) ─────────────────── */
function MockFileBrowser() {
  const files = [
    { icon: <FileText className="h-4 w-4" />, name: 'project-report.pdf', size: '2.4 MB', color: '#111111' },
    { icon: <FileText className="h-4 w-4" />, name: 'hero-image.png',     size: '1.2 MB', color: '#615e5b' },
    { icon: <FileText className="h-4 w-4" />, name: 'design-specs.fig',   size: '8.1 MB', color: '#111111' },
  ]
  return (
    <div style={{
      background: WHITE,
      border: `1px solid ${STONE}`,
      borderRadius: '20px',
      overflow: 'hidden',
      maxWidth: '520px',
      userSelect: 'none',
    }}>
      {/* Title bar */}
      <div style={{
        background: SAGE, borderBottom: `1px solid ${STONE}`,
        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: SOFT }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: SOFT }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: SOFT }} />
        </div>
        <div style={{
          flex: 1, height: 22, borderRadius: '140px',
          background: STONE, display: 'flex', alignItems: 'center',
          paddingInline: '10px', fontSize: '10px', color: GUN,
          maxWidth: '240px', margin: '0 auto',
        }}>
          stuffsy.site/storage
        </div>
      </div>

      {/* App body */}
      <div style={{ display: 'flex', minHeight: '240px' }}>
        {/* Sidebar */}
        <div style={{
          width: '148px', flexShrink: 0,
          borderRight: `1px solid ${STONE}`,
          background: SAGE, padding: '12px 8px',
          display: 'flex', flexDirection: 'column', gap: '2px',
        }}>
          <div style={{
            background: BLACK, color: WHITE,
            borderRadius: '140px', padding: '7px 12px',
            fontSize: '11px', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px',
          }}>
            <Upload className="h-3 w-3" />
            Upload Files
          </div>
          {['All Files', 'Documents', 'Images', 'Shared'].map((item, i) => (
            <div key={item} style={{
              padding: '5px 12px', borderRadius: '140px', fontSize: '11px',
              color: i === 0 ? INK : GUN,
              background: i === 0 ? STONE : 'transparent',
              fontWeight: i === 0 ? 600 : 400,
            }}>
              {item}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: '14px', minWidth: 0, background: WHITE }}>
          <p style={{ fontSize: '10px', color: GUN, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Folders</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {[{ name: 'Documents', n: '12 files' }, { name: 'Photos', n: '34 files' }].map(f => (
              <div key={f.name} style={{
                flex: 1, background: SAGE,
                border: `1px solid ${STONE}`, borderRadius: '10px', padding: '10px',
              }}>
                <Folder className="h-4 w-4" style={{ color: INK, marginBottom: '6px' }} />
                <p style={{ fontSize: '11px', fontWeight: 600, color: INK, marginBottom: '2px' }}>{f.name}</p>
                <p style={{ fontSize: '10px', color: GUN }}>{f.n}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '10px', color: GUN, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Recent Files</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {files.map(f => (
              <div key={f.name} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 8px', borderRadius: '10px', background: SAGE,
              }}>
                <span style={{ color: f.color, flexShrink: 0 }}>{f.icon}</span>
                <span style={{ flex: 1, fontSize: '11px', color: GUN, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                <span style={{ fontSize: '10px', color: SOFT, flexShrink: 0, fontWeight: 500 }}>{f.size}</span>
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
      <p style={{ fontSize: '10px', color: GUN, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Available Tools</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[
          { icon: <Cloud className="h-4 w-4" />,  name: 'Cloud Storage', tag: 'Live', dim: false },
          { icon: <Link2 className="h-4 w-4" />,  name: 'URL Shortener', tag: 'Live', dim: false },
          { icon: <QrCode className="h-4 w-4" />, name: 'QR Generator',  tag: 'Soon', dim: true  },
        ].map(t => (
          <div key={t.name} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '10px',
            background: t.dim ? WHITE : SAGE,
            border: `1px solid ${t.dim ? STONE : SOFT}`,
            opacity: t.dim ? 0.45 : 1,
          }}>
            <span style={{ color: t.dim ? GUN : INK }}>{t.icon}</span>
            <span style={{ flex: 1, fontSize: '12px', fontWeight: 600, color: t.dim ? GUN : INK }}>{t.name}</span>
            <span style={{
              fontSize: '10px', padding: '2px 10px', borderRadius: '160px',
              background: t.dim ? STONE : SOFT,
              color: t.dim ? GUN : INK, fontWeight: 600,
            }}>
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
      <p style={{ fontSize: '10px', color: GUN, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Upload Files</p>
      <div style={{
        border: `1.5px dashed ${SOFT}`,
        borderRadius: '10px', padding: '20px', textAlign: 'center',
        background: SAGE, marginBottom: '12px',
      }}>
        <Upload className="h-5 w-5" style={{ color: INK, margin: '0 auto 8px' }} />
        <p style={{ fontSize: '12px', fontWeight: 600, color: INK, marginBottom: '2px' }}>Drop files here</p>
        <p style={{ fontSize: '11px', color: GUN }}>or click to browse</p>
      </div>
      {/* Progress bars */}
      {[
        { name: 'project-report.pdf', pct: '72%', label: '72%', done: false },
        { name: 'hero-image.png',     pct: '100%', label: 'Done', done: true },
      ].map(f => (
        <div key={f.name} style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: GUN }}>{f.name}</span>
            <span style={{ fontSize: '11px', color: INK, fontWeight: 600 }}>{f.label}</span>
          </div>
          <div style={{ height: '3px', background: STONE, borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ width: f.pct, height: '100%', background: f.done ? SOFT : INK, borderRadius: '99px' }} />
          </div>
        </div>
      ))}
    </MockPanel>
  )
}

function MockStepShare() {
  return (
    <MockPanel>
      <p style={{ fontSize: '10px', color: GUN, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Shared Links</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[
          { label: 'stuffsy.site/xK9p', active: true  },
          { label: 'stuffsy.site/mR3t', active: false },
          { label: 'stuffsy.site/qZw2', active: false },
        ].map((l, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 12px', borderRadius: '10px',
            background: l.active ? SAGE : WHITE,
            border: `1px solid ${l.active ? SOFT : STONE}`,
          }}>
            <span style={{ flex: 1, fontSize: '11px', fontFamily: 'monospace', color: l.active ? INK : GUN }}>{l.label}</span>
            <span style={{
              fontSize: '10px', padding: '2px 8px', borderRadius: '160px',
              background: l.active ? SOFT : STONE,
              color: l.active ? INK : GUN,
              display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600,
            }}>
              {l.active ? <><CheckCircle className="h-2.5 w-2.5" /> Copied</> : <><Copy className="h-2.5 w-2.5" /> Copy</>}
            </span>
          </div>
        ))}
      </div>
    </MockPanel>
  )
}

/* ── Mini previews for Tool cards ───────────────────────── */
function MiniStoragePreview() {
  return (
    <div style={{ padding: '12px', borderRadius: '10px', background: SAGE, border: `1px solid ${STONE}`, marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        {['Documents', 'Photos'].map(name => (
          <div key={name} style={{ flex: 1, background: WHITE, border: `1px solid ${STONE}`, borderRadius: '8px', padding: '8px' }}>
            <Folder className="h-4 w-4" style={{ color: INK, marginBottom: '5px' }} />
            <p style={{ fontSize: '10px', fontWeight: 600, color: INK }}>{name}</p>
          </div>
        ))}
      </div>
      {[{ name: 'report.pdf', size: '2.4 MB' }, { name: 'image.png', size: '1.2 MB' }].map(f => (
        <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 7px', borderRadius: '6px', background: WHITE, marginBottom: '3px' }}>
          <FileText className="h-3 w-3" style={{ color: INK }} />
          <span style={{ flex: 1, fontSize: '10px', color: GUN }}>{f.name}</span>
          <span style={{ fontSize: '10px', color: SOFT, fontWeight: 500 }}>{f.size}</span>
        </div>
      ))}
    </div>
  )
}

function MiniShortenerPreview() {
  return (
    <div style={{ padding: '12px', borderRadius: '10px', background: SAGE, border: `1px solid ${STONE}`, marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
        <div style={{
          flex: 1, height: '30px', borderRadius: '140px',
          background: WHITE, border: `1px solid ${STONE}`,
          display: 'flex', alignItems: 'center', paddingInline: '10px',
          fontSize: '10px', color: GUN,
        }}>
          https://very-long-url.com/page/with/params...
        </div>
        <div style={{
          height: '30px', paddingInline: '14px', borderRadius: '160px',
          background: BLACK, display: 'flex', alignItems: 'center',
          fontSize: '10px', fontWeight: 700, color: WHITE, flexShrink: 0,
        }}>
          Shorten
        </div>
      </div>
      {[{ label: 'stuffsy.site/xK9p', active: true }, { label: 'stuffsy.site/mR3t', active: false }].map((l, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '6px 9px', borderRadius: '8px',
          background: l.active ? WHITE : WHITE,
          border: `1px solid ${l.active ? SOFT : STONE}`,
          marginBottom: '4px',
        }}>
          <span style={{ flex: 1, fontSize: '10px', fontFamily: 'monospace', color: l.active ? INK : GUN }}>{l.label}</span>
          <Copy className="h-3 w-3" style={{ color: l.active ? INK : GUN }} />
        </div>
      ))}
    </div>
  )
}

/* ── Shared: window chrome wrapper ──────────────────────── */
function MockPanel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: WHITE,
      border: `1px solid ${STONE}`,
      borderRadius: '20px',
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      <div style={{
        background: SAGE, borderBottom: `1px solid ${STONE}`,
        padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: SOFT }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: SOFT }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: SOFT }} />
      </div>
      <div style={{ padding: '16px' }}>{children}</div>
    </div>
  )
}

/* ── Step text block ─────────────────────────────────────── */
function StepText({ num, icon, title, desc }: { num: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: SAGE, border: `1px solid ${STONE}`,
          color: INK, flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: GUN, letterSpacing: '0.08em' }}>{num}</span>
      </div>
      <h3 style={{
        fontSize: '28px', fontWeight: 700,
        letterSpacing: '-0.03em', color: INK,
        marginBottom: '12px', lineHeight: 1.2,
        fontFamily: FONT,
      }}>{title}</h3>
      <p style={{ fontSize: '15px', lineHeight: 1.7, color: GUN }}>{desc}</p>
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
      className="group block cursor-pointer"
      style={{
        background: WHITE, border: `1px solid ${STONE}`,
        borderRadius: '32px', padding: '28px',
        textDecoration: 'none', transition: 'border-color 150ms, background 150ms',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = SOFT
        ;(e.currentTarget as HTMLElement).style.background = SAGE
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = STONE
        ;(e.currentTarget as HTMLElement).style.background = WHITE
      }}
    >
      {preview}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: SAGE, border: `1px solid ${STONE}`, color: INK,
        }}>
          {icon}
        </div>
        <span style={{
          fontSize: '10px', padding: '3px 12px', borderRadius: '160px',
          background: INK, color: WHITE,
          fontWeight: 700, letterSpacing: '0.04em',
        }}>
          Live
        </span>
      </div>

      <h3
        className="flex items-center gap-2 text-lg font-bold mb-2"
        style={{ letterSpacing: '-0.03em', color: INK, fontFamily: FONT }}
      >
        {name}
        <ArrowRight
          className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
          style={{ color: INK }}
        />
      </h3>
      <p style={{ fontSize: '13px', lineHeight: 1.6, color: GUN }}>{description}</p>
    </Link>
  )
}
