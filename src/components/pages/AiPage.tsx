import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Send, Sparkles, ChevronDown, ChevronUp, FileText, Folders, RotateCcw, Image, ArrowLeft } from 'lucide-react'
import { queryAI, type SourceChunk } from '@/services/ai_service'
import { T } from '@/lib/tokens'

/* ── Types ─────────────────────────────────────────────────── */
type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: SourceChunk[]
  isStreaming?: boolean
  isError?: boolean
}

type Scope = { label: string; value: string; icon: React.ElementType }

const SCOPES: Scope[] = [
  { label: 'All Files',  value: 'all',       icon: Folders   },
  { label: 'Documents',  value: 'documents', icon: FileText  },
  { label: 'Images',     value: 'images',    icon: Image     },
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
  const [messages,  setMessages]  = useState<Message[]>([])
  const [input,     setInput]     = useState('')
  const [scope,     setScope]     = useState<Scope>(SCOPES[0])
  const [streaming, setStreaming] = useState(false)
  const cleanupRef  = useRef<(() => void) | null>(null)
  const bottomRef   = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

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
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', fontFamily: T.fontBody, background: T.surface2 }}>
      <Helmet>
        <title>Stuffsy AI – Ask Your Files</title>
      </Helmet>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0"
        style={{ width: '220px', background: T.surface, borderRight: `1px solid ${T.border}` }}
      >
        {/* Wordmark */}
        <div style={{ padding: '16px 16px 14px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <Link
              to="/"
              style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.02em', color: T.textHi, textDecoration: 'none' }}
            >
              Stuffsy
            </Link>
            <span style={{ fontSize: '13px', color: T.textMid }}>/</span>
            <span style={{ fontSize: '13px', color: T.textMid, fontWeight: 500 }}>AI</span>
          </div>
        </div>

        {/* Scope */}
        <div style={{ padding: '16px 12px 8px' }}>
          <p style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: T.textMid, marginBottom: '6px', paddingLeft: '4px',
          }}>
            Search scope
          </p>
          {SCOPES.map(s => {
            const Icon = s.icon
            const active = scope.value === s.value
            return (
              <button
                key={s.value}
                onClick={() => setScope(s)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: active ? T.primaryBg : 'transparent',
                  color: active ? T.primary : T.textMid,
                  fontSize: '13px', fontWeight: active ? 600 : 400,
                  fontFamily: T.fontBody, textAlign: 'left',
                  outline: active ? `1px solid ${T.borderEm}` : 'none',
                  transition: 'background 150ms, color 150ms',
                }}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                {s.label}
              </button>
            )
          })}
        </div>

        {/* New chat + back link */}
        <div style={{ marginTop: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={reset}
            style={{
              width: '100%', padding: '9px 12px', borderRadius: '8px',
              border: `1px solid ${T.border}`, background: 'transparent', cursor: 'pointer',
              fontSize: '12px', fontWeight: 600, color: T.textMid, fontFamily: T.fontBody,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'border-color 150ms, color 150ms',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = T.primary
              el.style.color = T.primary
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = T.border
              el.style.color = T.textMid
            }}
          >
            <RotateCcw className="h-3 w-3" />
            New chat
          </button>

          <Link
            to="/"
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '11px', color: T.textMid, textDecoration: 'none',
              padding: '6px 4px', transition: 'color 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = T.textHi)}
            onMouseLeave={e => (e.currentTarget.style.color = T.textMid)}
          >
            <ArrowLeft className="h-3 w-3" />
            All tools
          </Link>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: T.surface2 }}>

        {/* Top bar */}
        <div style={{
          height: '48px', padding: '0 24px', borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, background: T.surface,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles className="h-4 w-4" style={{ color: T.primary }} />
            <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em', color: T.textHi }}>
              Stuffsy AI
            </span>
            <span style={{
              fontSize: '10px', padding: '2px 8px', borderRadius: '99px',
              background: 'rgba(231,197,154,0.12)', border: '1px solid rgba(231,197,154,0.3)',
              color: T.amber, fontWeight: 600, letterSpacing: '0.03em',
            }}>
              Beta
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: T.textMid }}>
              Scope: <strong style={{ color: T.textHi }}>{scope.label}</strong>
            </span>
            {messages.length > 0 && (
              <button
                onClick={reset}
                style={{
                  padding: '4px 12px', borderRadius: '8px',
                  border: `1px solid ${T.border}`, background: 'transparent',
                  cursor: 'pointer', fontSize: '11px', color: T.textMid, fontFamily: T.fontBody,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  transition: 'border-color 150ms, color 150ms',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = T.primary; el.style.color = T.primary
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = T.border; el.style.color = T.textMid
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
            {messages.length === 0 && (
              <Welcome onSuggest={q => { setInput(q); textareaRef.current?.focus() }} />
            )}
            {messages.map(msg => (
              msg.role === 'user'
                ? <UserBubble key={msg.id} content={msg.content} />
                : <AssistantBubble key={msg.id} msg={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input bar */}
        <div style={{ padding: '16px 24px 20px', borderTop: `1px solid ${T.border}`, flexShrink: 0, background: T.surface }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: '10px',
              background: T.surface2, border: `1px solid ${streaming ? T.borderEm : T.border}`,
              borderRadius: '8px', padding: '10px 14px', transition: 'border-color 150ms',
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
                  background: 'transparent', fontFamily: T.fontBody,
                  fontSize: '14px', color: T.textHi, lineHeight: 1.5, overflowY: 'hidden',
                }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || streaming}
                style={{
                  width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
                  background: (!input.trim() || streaming) ? T.border : T.primary,
                  border: 'none', cursor: (!input.trim() || streaming) ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 150ms',
                }}
              >
                <Send className="h-3.5 w-3.5" style={{ color: (!input.trim() || streaming) ? T.textMid : '#101010' }} />
              </button>
            </div>
            <p style={{ fontSize: '11px', color: T.textMid, marginTop: '8px', textAlign: 'center' }}>
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
        width: '52px', height: '52px', borderRadius: '8px',
        background: T.border, display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <Sparkles className="h-6 w-6" style={{ color: T.primary }} />
      </div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', color: T.textHi, marginBottom: '8px' }}>
        Ask your files anything
      </h2>
      <p style={{ fontSize: '14px', color: T.textMid, lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 32px' }}>
        Search across your uploaded documents, images, and notes using natural language.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '420px', margin: '0 auto' }}>
        {SUGGESTED.map(q => (
          <button
            key={q}
            onClick={() => onSuggest(q)}
            style={{
              padding: '12px 18px', borderRadius: '8px', textAlign: 'left',
              border: `1px solid ${T.border}`, background: T.surface, cursor: 'pointer',
              fontSize: '13px', color: T.textMid, fontFamily: T.fontBody,
              transition: 'border-color 150ms, color 150ms',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = T.borderEm; el.style.color = T.textHi
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = T.border; el.style.color = T.textMid
            }}
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
        maxWidth: '75%', padding: '12px 16px', borderRadius: '8px',
        background: T.border, color: T.textHi,
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
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
          background: msg.isError ? 'rgba(220,38,38,0.1)' : T.primaryBg,
          border: `1px solid ${msg.isError ? 'rgba(220,38,38,0.3)' : T.borderEm}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles className="h-3.5 w-3.5" style={{ color: msg.isError ? '#dc2626' : T.primary }} />
        </div>
        <div style={{
          flex: 1, padding: '12px 16px', borderRadius: '8px',
          background: msg.isError ? 'rgba(220,38,38,0.08)' : T.surface,
          border: `1px solid ${msg.isError ? 'rgba(220,38,38,0.2)' : T.border}`,
          fontSize: '14px', color: msg.isError ? '#dc2626' : T.textHi, lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
        }}>
          {msg.content || (msg.isStreaming && <span style={{ color: T.textMid }}>Thinking…</span>)}
          {msg.isStreaming && <span className="animate-pulse" style={{ color: T.primary }}>▋</span>}
        </div>
      </div>

      {hasSources && !msg.isStreaming && (
        <div style={{ marginLeft: '38px', marginTop: '8px' }}>
          <button
            onClick={() => setSourcesOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '4px 10px', borderRadius: '99px',
              border: `1px solid ${T.border}`, background: 'transparent', cursor: 'pointer',
              fontSize: '11px', fontWeight: 600, color: T.textMid, fontFamily: T.fontBody,
              transition: 'border-color 150ms',
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
                  padding: '10px 12px', borderRadius: '8px',
                  border: `1px solid ${T.border}`, background: T.surface,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <FileText className="h-3.5 w-3.5" style={{ color: T.primary, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: T.textHi }}>{s.file_name}</span>
                    {s.page && (
                      <span style={{ fontSize: '10px', color: T.textMid, marginLeft: 'auto' }}>p. {s.page}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: T.textMid, lineHeight: 1.5, margin: 0 }}>
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
