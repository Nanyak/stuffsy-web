import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Shield, Smile } from 'lucide-react'

function App() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock shortening
    const shortCode = Math.random().toString(36).substr(2, 6)
    const shortened = `https://short.ly/${shortCode}`
    setShortUrl(shortened)
    setShowResult(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16 fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 font-heading">
            Stuffsy
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12">
            A collection of useful online tools to make your life easier. Start with our URL shortener.
          </p>

          {/* URL Shortener Demo */}
          <Card className="max-w-lg mx-auto mb-12">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your long URL here"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full"
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Shorten URL
                </Button>
              </form>
              {showResult && (
                <div className="mt-6 text-center">
                  <p className="text-green-600 font-semibold mb-2">Shortened URL:</p>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline break-all"
                  >
                    {shortUrl}
                  </a>
                  <br />
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="mt-2"
                  >
                    Copy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 font-heading">More Tools Coming Soon</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="opacity-75 hover:opacity-100 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 font-heading">QR Code Generator</h3>
                  <p className="text-slate-600">Generate QR codes for URLs, text, and more.</p>
                </CardContent>
              </Card>
              <Card className="opacity-75 hover:opacity-100 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 font-heading">Password Generator</h3>
                  <p className="text-slate-600">Create strong, secure passwords instantly.</p>
                </CardContent>
              </Card>
              <Card className="opacity-75 hover:opacity-100 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 font-heading">Text Tools</h3>
                  <p className="text-slate-600">Format, convert, and analyze text with ease.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Button */}
          {/* <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => document.getElementById('url-input')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started Now
          </Button> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 py-8 border-t">
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="text-slate-600">&copy; 2026 Stuffsy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
