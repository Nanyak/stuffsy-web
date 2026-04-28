import { Helmet } from 'react-helmet-async'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { urlShortenerService, getUserLinks } from '@/services/url_shortener_service'
import type { LinkRecord } from '@/services/url_shortener_service'
import { useAuth } from '@/contexts/AuthContext'
import { Link2, Copy, Check, ExternalLink, Loader2, AlertCircle, Clock, History } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

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
      // silently ignore history fetch errors
    } finally {
      setHistoryLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

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
        const message = err.response?.data?.error || err.message
        setError(message)
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

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }

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
      {/* Page header */}
      <div className="relative mb-8 pb-6 border-b border-border overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 80% at 0% 50%, oklch(0.545 0.185 268 / 0.10) 0%, transparent 70%)',
        }} />
        <div className="relative flex items-center gap-4">
          <div className="p-3 rounded-xl flex-shrink-0" style={{
            background: 'oklch(0.545 0.185 268 / 0.14)',
            border: '1px solid oklch(0.545 0.185 268 / 0.30)',
          }}>
            <Link2 className="h-7 w-7" style={{ color: 'oklch(0.660 0.185 268)' }} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{
              fontFamily: "'Syne', system-ui, sans-serif",
              color: 'oklch(0.940 0.005 260)',
            }}>URL Shortener</h1>
            <p className="text-sm mt-0.5 text-muted-foreground">Create short, easy-to-share links from long URLs.</p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl p-8 mb-8" style={{
        background: 'oklch(0.105 0.010 265)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="url"
            placeholder="https://example.com/your-long-url-here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full h-12 text-base"
          />
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold cursor-pointer transition-all duration-200"
            disabled={isLoading || !url.trim()}
            style={(!isLoading && url.trim()) ? {
              background: 'oklch(0.545 0.185 268)',
              boxShadow: '0 0 20px oklch(0.545 0.185 268 / 0.35)',
            } : {}}
          >
            {isLoading ? (
              <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Shortening...</>
            ) : (
              <><Link2 className="h-5 w-5 mr-2" />Shorten URL</>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl flex items-center gap-2" style={{
            background: 'oklch(0.580 0.220 27 / 0.10)',
            border: '1px solid oklch(0.580 0.220 27 / 0.30)',
          }}>
            <AlertCircle className="h-5 w-5 shrink-0" style={{ color: 'oklch(0.680 0.190 22)' }} />
            <p className="text-sm" style={{ color: 'oklch(0.750 0.120 22)' }}>{error}</p>
          </div>
        )}

        {showResult && shortUrl && (
          <div className="mt-6 p-5 rounded-xl" style={{
            background: 'oklch(0.55 0.150 145 / 0.08)',
            border: '1px solid oklch(0.55 0.150 145 / 0.25)',
          }}>
            <div className="flex items-center gap-2 mb-3">
              <Check className="h-4 w-4" style={{ color: 'oklch(0.65 0.170 145)' }} />
              <p className="text-sm font-semibold" style={{ color: 'oklch(0.70 0.120 145)' }}>URL shortened successfully!</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 font-medium break-all flex items-center gap-2 cursor-pointer transition-colors duration-200 text-primary hover:text-primary/80"
              >
                {shortUrl}
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
              <Button
                onClick={() => copyToClipboard(shortUrl)}
                variant="outline"
                size="sm"
                className="shrink-0 cursor-pointer transition-all duration-200"
              >
                {copied ? (
                  <><Check className="h-4 w-4 mr-1 text-green-400" />Copied!</>
                ) : (
                  <><Copy className="h-4 w-4 mr-1" />Copy</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <History className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>Your History</h2>
          </div>

          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Link2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No shortened URLs yet. Create your first one above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const shortLink = `${API_URL}/r/${item.short_code}`
                const isCopied = copiedCode === item.short_code
                return (
                  <div key={item.short_code} className="p-4 rounded-xl transition-colors duration-150" style={{
                    background: 'oklch(0.105 0.010 265)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {item.title && (
                          <p className="text-sm font-medium text-foreground mb-1 truncate">{item.title}</p>
                        )}
                        <a
                          href={item.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-1 truncate cursor-pointer"
                        >
                          {truncate(item.original_url, 60)}
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                        <a
                          href={shortLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-block text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-150 cursor-pointer"
                        >
                          {shortLink}
                        </a>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Button
                          onClick={() => copyToClipboard(shortLink, item.short_code)}
                          variant="outline"
                          size="sm"
                          className="cursor-pointer transition-all duration-200"
                        >
                          {isCopied ? (
                            <><Check className="h-3 w-3 mr-1 text-green-400" />Copied!</>
                          ) : (
                            <><Copy className="h-3 w-3 mr-1" />Copy</>
                          )}
                        </Button>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
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
