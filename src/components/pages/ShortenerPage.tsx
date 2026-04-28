import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Link2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 font-heading">URL Shortener</h1>
        </div>
        <p className="text-slate-600">
          Create short, easy-to-share links from long URLs.
        </p>
      </div>

      <Card className="border-2 border-slate-200 shadow-sm">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="url"
                placeholder="https://example.com/your-long-url-here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full h-12 pl-4 pr-4 text-base"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium cursor-pointer transition-all duration-200"
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Shortening...
                </>
              ) : (
                <>
                  <Link2 className="h-5 w-5 mr-2" />
                  Shorten URL
                </>
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {showResult && shortUrl && (
            <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Check className="h-5 w-5 text-green-600" />
                <p className="text-green-700 font-semibold">URL shortened successfully!</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-primary hover:text-primary/80 font-medium break-all flex items-center gap-2 cursor-pointer transition-colors duration-200"
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
                    <>
                      <Check className="h-4 w-4 mr-1 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isAuthenticated && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-800">Your History</h2>
          </div>

          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Link2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>No shortened URLs yet. Create your first one above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const shortLink = `${API_URL}/r/${item.short_code}`
                const isCopied = copiedCode === item.short_code
                return (
                  <Card key={item.short_code} className="border border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {item.title && (
                            <p className="text-sm font-medium text-slate-800 mb-1 truncate">
                              {item.title}
                            </p>
                          )}
                          <a
                            href={item.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-150 flex items-center gap-1 truncate cursor-pointer"
                          >
                            {truncate(item.original_url, 60)}
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                          <div className="flex items-center gap-2 mt-2">
                            <a
                              href={shortLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-150 cursor-pointer"
                            >
                              {shortLink}
                            </a>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <Button
                            onClick={() => copyToClipboard(shortLink, item.short_code)}
                            variant="outline"
                            size="sm"
                            className="cursor-pointer transition-all duration-200"
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3 w-3 mr-1 text-green-600" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="h-3 w-3" />
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
