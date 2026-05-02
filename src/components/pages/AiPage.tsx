import { useState, useRef, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Send, Sparkles, ChevronDown, ChevronUp, FileText, Folders, RotateCcw } from 'lucide-react'
import { queryAI, type SourceChunk } from '@/services/ai_service'
import { ink as INK, gun as GUN, sage as SAGE, stone as STONE, soft as SOFT, black as BLACK, white as WHITE, font as FONT } from '@/lib/tokens'

/* ── Types ─────────────────────────────────────────────────── */
type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: SourceChunk[]
  isStreaming?: boolean
  isError?: boolean
}

type Scope = { label: string; value: string }

const SCOPES: Scope[] = [
  { label: 'All Files',  value: 'all'       },
  { label: 'Documents',  value: 'documents' },
  { label: 'Images',     value: 'images'    },
]

const SUGGESTED = [
  'Summarize my most recent documents',
  'What files did I upload this week?',
  'Find anything related to invoices or payments',
]

let idCounter = 0
const uid = () => `msg-${++idCounter}`

/* ── Page ──────────────────────────────────────────────────── */
export function AiPage() {
  const [messages,   setMessages]   = useState<Message[]>([])
  const [input,      setInput]      = useState('')
  const [scope,      setScope]      = useState<Scope>(SCOPES[0])
  const [streaming,  setStreaming]  = useState(false)
  const cleanupRef   = useRef<(() => void) | null>(null)
  const bottomRef    = useRef<HTMLDivElement>(null)
  const textareaRef  = useRef<HTMLTextAreaElement>(null)

  /* auto-scroll to bottom on new content */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /* auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  /* cleanup SSE on unmount */
  useEffect(() => () => { cleanupRef.current?.() }, [])

  const send = useCallback(() => {
    const question = input.trim()
    if (!question || streaming) return

    setInput('')
    setStreaming(true)

    const userMsg: Message = { id: uid(), role: 'user', content: question }
    const assistantId = uid()
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', sources: [], isStreaming: true }

    setMessages(prev => [...prev, userMsg, assistantMsg])

    cleanupRef.current = queryAI({
      question,
      scope: scope.value,
      onToken: (token) => {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: m.content + token } : m
        ))
      },
      onSource: (source) => {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, sources: [...(m.sources ?? []), source] } : m
        ))
      },
      onDone: () => {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, isStreaming: false } : m
        ))
        setStreaming(false)
      },
      onError: (err) => {
        setMessages(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: err.message, isStreaming: false, isError: true }
            : m
        ))
        setStreaming(false)
      },
    })
  }, [input, streaming, scope])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const reset = () => {
    cleanupRef.current?.()
    setMessages([])
    setStreaming(false)
  }

  return (
    <div
      className="full-bleed -mt-8"
      style={{ height: 'calc(100vh - 56px)', display: 'flex', overflow: 'hidden', fontFamily: FONT }}
    >
      <Helmet>
        <title>Stuffsy AI – Ask Your Files</title>
      </Helmet>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0"
        style={{ width: '220px', background: SAGE, borderRight: `1px solid ${STONE}` }}
      >
        {/* Brand */}
        <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${STONE}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: BLACK, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: WHITE }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em', color: INK }}>Stuffsy AI</span>
          </div>
          <p style={{ fontSize: '11px', color: GUN, marginTop: '6px', lineHeight: 1.4 }}>
            Ask questions across your files
          </p>
        </div>

        {/* Scope */}
        <div style={{ padding: '16px 12px 8px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: GUN, marginBottom: '6px', paddingLeft: '4px' }}>
            Search scope
          </p>
          {SCOPES.map(s => (
            <button
              key={s.value}
              onClick={() => setScope(s)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: scope.value === s.value ? WHITE : 'transparent',
                color: scope.value === s.value ? INK : GUN,
                fontSize: '13px', fontWeight: scope.value === s.value ? 600 : 400,
                fontFamily: FONT, textAlign: 'left',
                outline: scope.value === s.value ? `1px solid ${STONE}` : 'none',
              }}
            >
              {s.value === 'all' ? <Folders className="h-3.5 w-3.5 flex-shrink-0" /> : <FileText className="h-3.5 w-3.5 flex-shrink-0" />}
              {s.label}
            </button>
          ))}
        </div>

        {/* New chat */}
        <div style={{ marginTop: 'auto', padding: '12px' }}>
          <button
            onClick={reset}
            style={{
              width: '100%', padding: '9px 12px', borderRadius: '140px',
              border: `1px solid ${SOFT}`, background: WHITE, cursor: 'pointer',
              fontSize: '12px', fontWeight: 600, color: GUN, fontFamily: FONT,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            <RotateCcw className="h-3 w-3" />
            New chat
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: WHITE }}>

        {/* Top bar */}
        <div style={{
          padding: '12px 24px', borderBottom: `1px solid ${STONE}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles className="h-4 w-4" style={{ color: INK }} />
            <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em', color: INK }}>
              Stuffsy AI
            </span>
            <span style={{
              fontSize: '10px', padding: '2px 10px', borderRadius: '160px',
              background: SAGE, border: `1px solid ${STONE}`, color: GUN, fontWeight: 600,
            }}>
              Beta
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: GUN }}>Scope: <strong style={{ color: INK }}>{scope.label}</strong></span>
            {messages.length > 0 && (
              <button
                onClick={reset}
                style={{
                  padding: '5px 12px', borderRadius: '140px',
                  border: `1px solid ${STONE}`, background: WHITE,
                  cursor: 'pointer', fontSize: '11px', color: GUN, fontFamily: FONT,
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <RotateCcw className="h-3 w-3" /> New chat
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>

            {messages.length === 0 && <Welcome onSuggest={q => { setInput(q); textareaRef.current?.focus() }} />}

            {messages.map(msg => (
              msg.role === 'user'
                ? <UserBubble key={msg.id} content={msg.content} />
                : <AssistantBubble key={msg.id} msg={msg} />
            ))}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input bar */}
        <div style={{ padding: '16px 24px 20px', borderTop: `1px solid ${STONE}`, flexShrink: 0 }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: '10px',
              background: WHITE, border: `1px solid ${streaming ? SOFT : STONE}`,
              borderRadius: '20px', padding: '10px 14px',
              transition: 'border-color 150ms',
            }}>
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask a question about your files…"
                style={{
                  flex: 1, resize: 'none', border: 'none', outline: 'none',
                  background: 'transparent', fontFamily: FONT,
                  fontSize: '14px', color: INK, lineHeight: 1.5,
                  overflowY: 'hidden',
                }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || streaming}
                style={{
                  width: '34px', height: '34px', borderRadius: '160px', flexShrink: 0,
                  background: (!input.trim() || streaming) ? STONE : BLACK,
                  border: 'none', cursor: (!input.trim() || streaming) ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 150ms',
                }}
              >
                <Send className="h-3.5 w-3.5" style={{ color: (!input.trim() || streaming) ? GUN : WHITE }} />
              </button>
            </div>
            <p style={{ fontSize: '11px', color: GUN, marginTop: '8px', textAlign: 'center' }}>
              Shift+Enter for new line · Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Welcome screen ────────────────────────────────────────── */
function Welcome({ onSuggest }: { onSuggest: (q: string) => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0 40px' }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '16px',
        background: BLACK, display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <Sparkles className="h-6 w-6" style={{ color: WHITE }} />
      </div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', color: INK, marginBottom: '8px' }}>
        Ask your files anything
      </h2>
      <p style={{ fontSize: '14px', color: GUN, lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 32px' }}>
        Search across your uploaded documents, images, and notes using natural language.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '420px', margin: '0 auto' }}>
        {SUGGESTED.map(q => (
          <button
            key={q}
            onClick={() => onSuggest(q)}
            style={{
              padding: '12px 18px', borderRadius: '10px', textAlign: 'left',
              border: `1px solid ${STONE}`, background: SAGE, cursor: 'pointer',
              fontSize: '13px', color: GUN, fontFamily: FONT, transition: 'border-color 150ms',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = SOFT }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = STONE }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── User bubble ───────────────────────────────────────────── */
function UserBubble({ content }: { content: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
      <div style={{
        maxWidth: '75%', padding: '12px 16px', borderRadius: '20px 20px 4px 20px',
        background: BLACK, color: WHITE,
        fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap',
      }}>
        {content}
      </div>
    </div>
  )
}

/* ── Assistant bubble ──────────────────────────────────────── */
function AssistantBubble({ msg }: { msg: Message }) {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const hasSources = (msg.sources?.length ?? 0) > 0

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Avatar + bubble */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
          background: msg.isError ? '#fee2e2' : SAGE,
          border: `1px solid ${msg.isError ? '#fca5a5' : STONE}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles className="h-3.5 w-3.5" style={{ color: msg.isError ? '#dc2626' : INK }} />
        </div>

        <div style={{
          flex: 1, padding: '12px 16px', borderRadius: '4px 20px 20px 20px',
          background: msg.isError ? '#fef2f2' : SAGE,
          border: `1px solid ${msg.isError ? '#fca5a5' : STONE}`,
          fontSize: '14px', color: msg.isError ? '#dc2626' : INK, lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
        }}>
          {msg.content || (msg.isStreaming && <span style={{ color: GUN }}>Thinking…</span>)}
          {msg.isStreaming && <span className="animate-pulse" style={{ color: GUN }}>▋</span>}
        </div>
      </div>

      {/* Source citations */}
      {hasSources && !msg.isStreaming && (
        <div style={{ marginLeft: '38px', marginTop: '8px' }}>
          <button
            onClick={() => setSourcesOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '4px 10px', borderRadius: '160px',
              border: `1px solid ${STONE}`, background: WHITE, cursor: 'pointer',
              fontSize: '11px', fontWeight: 600, color: GUN, fontFamily: FONT,
            }}
          >
            <FileText className="h-3 w-3" />
            {msg.sources!.length} source{msg.sources!.length > 1 ? 's' : ''}
            {sourcesOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {sourcesOpen && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {msg.sources!.map((s, i) => (
                <div key={i} style={{
                  padding: '10px 12px', borderRadius: '10px',
                  border: `1px solid ${STONE}`, background: WHITE,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <FileText className="h-3.5 w-3.5" style={{ color: INK, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: INK }}>{s.file_name}</span>
                    {s.page && (
                      <span style={{ fontSize: '10px', color: GUN, marginLeft: 'auto' }}>p. {s.page}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: GUN, lineHeight: 1.5, margin: 0 }}>
                    {s.text.length > 180 ? s.text.slice(0, 180) + '…' : s.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
