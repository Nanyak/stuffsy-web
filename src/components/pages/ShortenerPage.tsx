import { Helmet } from 'react-helmet-async'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { urlShortenerService, getUserLinks } from '@/services/url_shortener_service'
import type { LinkRecord } from '@/services/url_shortener_service'
import { useAuth } from '@/contexts/AuthContext'
import { Link2, Copy, Check, ExternalLink, Loader2, AlertCircle, Clock, History, ArrowRight } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const PRIMARY   = 'oklch(0.545 0.185 268)'
const PRIMARY_L = 'oklch(0.440 0.185 268)'
const TEXT_HI   = 'oklch(0.180 0.014 260)'
const TEXT_MID  = 'oklch(0.430 0.010 260)'
const TEXT_LO   = 'oklch(0.620 0.008 260)'
const SURFACE   = 'oklch(1 0 0)'
const SURFACE2  = 'oklch(0.976 0.004 260)'
const BORDER    = 'rgba(0,0,0,0.07)'
const BORDER_EM = 'oklch(0.545 0.185 268 / 0.28)'
const FONT_DISP = "'Syne', system-ui, sans-serif"

export function ShortenerPage() {
  const { isAuthenticated } = useAuth()
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [history, setHistory] = useState<LinkRecord[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) return
    setHistoryLoading(true)
    try {
      const res = await getUserLinks()
      setHistory(res.data.links ?? [])
    } catch {
      // silently ignore
    } finally {
      setHistoryLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setShowResult(false)
    try {
      const response = await urlShortenerService(url)
      const result = `${API_URL}/r/${response.data.short_url}`
      setShortUrl(result)
      setShowResult(true)
      fetchHistory()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message)
      } else {
        setError('Failed to shorten URL. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, key?: string) => {
    await navigator.clipboard.writeText(text)
    if (key) {
      setCopiedCode(key)
      setTimeout(() => setCopiedCode(null), 2000)
    } else {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '…' : text

  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>URL Shortener – Stuffsy</title>
        <meta name="description" content="Shorten long URLs into clean, shareable links instantly. Free to use, no account required." />
        <link rel="canonical" href="https://stuffsy.site/shortener" />
        <meta property="og:url" content="https://stuffsy.site/shortener" />
        <meta property="og:title" content="URL Shortener – Stuffsy" />
        <meta property="og:description" content="Shorten long URLs into clean, shareable links instantly. Free to use, no account required." />
      </Helmet>

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="relative mb-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
          background: 'radial-gradient(ellipse 70% 100% at 0% 50%, oklch(0.545 0.185 268 / 0.09) 0%, transparent 70%)',
        }} />
        <div className="relative py-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: PRIMARY_L }}>Tool</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl flex-shrink-0" style={{
              background: 'oklch(0.545 0.185 268 / 0.10)',
              border: `1px solid ${BORDER_EM}`,
            }}>
              <Link2 className="h-7 w-7" style={{ color: PRIMARY }} />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-2" style={{
                fontFamily: FONT_DISP,
                background: `linear-gradient(135deg, ${TEXT_HI} 0%, oklch(0.260 0.018 265) 50%, ${PRIMARY} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                URL Shortener
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_MID }}>
                Transform long URLs into clean, shareable short links instantly.
              </p>
            </div>
          </div>
        </div>
        <div style={{ height: '1px', background: `linear-gradient(to right, ${BORDER_EM}, ${BORDER}, transparent)` }} />
      </div>

      {/* ── Form card ────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden mb-8" style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}>
        {/* Card top accent */}
        <div className="px-8 pt-7 pb-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: PRIMARY_L }}>
            Shorten a link
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              type="url"
              placeholder="https://example.com/your-long-url-here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1 h-11 text-sm"
            />
            <Button
              type="submit"
              className="h-11 px-5 font-semibold cursor-pointer transition-all duration-200 shrink-0"
              disabled={isLoading || !url.trim()}
              style={(!isLoading && url.trim()) ? {
                boxShadow: '0 0 20px oklch(0.545 0.185 268 / 0.30)',
              } : {}}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <><Link2 className="h-4 w-4" />Shorten</>
              )}
            </Button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-8 mb-6 flex items-center gap-2 p-4 rounded-xl text-sm" style={{
            background: 'oklch(0.580 0.220 27 / 0.07)',
            border: '1px solid oklch(0.580 0.220 27 / 0.20)',
            color: 'oklch(0.480 0.180 27)',
          }}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Result */}
        {showResult && shortUrl && (
          <div className="mx-8 mb-7 p-5 rounded-xl" style={{
            background: 'oklch(0.55 0.150 145 / 0.06)',
            border: '1px solid oklch(0.55 0.150 145 / 0.22)',
          }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{
                background: 'oklch(0.55 0.150 145 / 0.15)',
              }}>
                <Check className="h-3 w-3" style={{ color: 'oklch(0.42 0.150 145)' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: 'oklch(0.38 0.120 145)' }}>Link shortened successfully!</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{
              background: SURFACE2,
              border: `1px solid ${BORDER}`,
            }}>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-sm font-medium break-all flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-75"
                style={{ color: PRIMARY_L }}
              >
                {shortUrl}
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
              <Button
                onClick={() => copyToClipboard(shortUrl)}
                variant="outline"
                size="sm"
                className="shrink-0 cursor-pointer transition-all duration-200"
              >
                {copied ? (
                  <><Check className="h-3.5 w-3.5" style={{ color: 'oklch(0.42 0.150 145)' }} />Copied!</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" />Copy</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── History ──────────────────────────────────────────── */}
      {isAuthenticated && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg" style={{
              background: 'oklch(0.545 0.185 268 / 0.09)',
              border: `1px solid ${BORDER_EM}`,
            }}>
              <History className="h-4 w-4" style={{ color: PRIMARY_L }} />
            </div>
            <h2 className="text-lg font-bold" style={{ fontFamily: FONT_DISP, color: TEXT_HI }}>Your History</h2>
          </div>

          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: SURFACE, border: `1px solid ${BORDER}` }} />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{
                background: 'oklch(0.545 0.185 268 / 0.08)',
                border: `1px solid ${BORDER_EM}`,
              }}>
                <Link2 className="h-5 w-5" style={{ color: PRIMARY_L, opacity: 0.5 }} />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: TEXT_MID }}>No shortened URLs yet</p>
              <p className="text-xs" style={{ color: TEXT_LO }}>Create your first one above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const shortLink = `${API_URL}/r/${item.short_code}`
                const isCopied = copiedCode === item.short_code
                return (
                  <div
                    key={item.short_code}
                    className="group p-5 rounded-2xl transition-all duration-150"
                    style={{
                      background: SURFACE,
                      border: `1px solid ${BORDER}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.border = `1px solid oklch(0.545 0.185 268 / 0.28)`
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.border = `1px solid ${BORDER}`
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {item.title && (
                          <p className="text-sm font-semibold mb-1 truncate" style={{ color: TEXT_HI }}>{item.title}</p>
                        )}
                        <a
                          href={item.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1 truncate cursor-pointer transition-colors duration-150 hover:opacity-75"
                          style={{ color: TEXT_LO }}
                        >
                          {truncate(item.original_url, 60)}
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                        <a
                          href={shortLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-75 cursor-pointer"
                          style={{ color: PRIMARY_L }}
                        >
                          {shortLink}
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="flex flex-col items-end gap-2.5 shrink-0">
                        <Button
                          onClick={() => copyToClipboard(shortLink, item.short_code)}
                          variant="outline"
                          size="sm"
                          className="cursor-pointer transition-all duration-200"
                        >
                          {isCopied ? (
                            <><Check className="h-3 w-3" style={{ color: 'oklch(0.42 0.150 145)' }} />Copied!</>
                          ) : (
                            <><Copy className="h-3 w-3" />Copy</>
                          )}
                        </Button>
                        <span className="flex items-center gap-1 text-xs" style={{ color: TEXT_LO }}>
                          <Clock className="h-3 w-3" />
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
