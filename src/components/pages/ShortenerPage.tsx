import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { urlShortenerService } from '@/services/url_shortener_service'
import { Link2, Copy, Check, ExternalLink, Loader2 } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL


export function ShortenerPage() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await urlShortenerService(url)
      const result = `${API_URL}/${response.data.short_url}`
      setShortUrl(result)
      setShowResult(true)
    } catch (error) {
      console.error("Error shortening URL:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

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
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                </a>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 cursor-pointer transition-all duration-200"
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
    </div>
  )
}
