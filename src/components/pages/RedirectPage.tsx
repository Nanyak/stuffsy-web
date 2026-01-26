import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'

type RedirectState = 'loading' | 'error' | 'invalid'

export function RedirectPage() {
  const { code } = useParams()
  const [state, setState] = useState<RedirectState>('loading')

  useEffect(() => {
    if (!code) {
      setState('invalid')
      return
    }

    // Validate short code format (alphanumeric, 8 chars)
    if (!/^[a-zA-Z0-9]{8}$/.test(code)) {
      setState('invalid')
      return
    }

    const apiUrl = import.meta.env.VITE_API_URL
    if (!apiUrl) {
      setState('error')
      return
    }

    // Set timeout for redirect failure detection
    const timeout = setTimeout(() => {
      setState('error')
    }, 5000)

    window.location.href = `${apiUrl}/${code}`

    return () => clearTimeout(timeout)
  }, [code])

  if (state === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Invalid Short URL</h1>
          <p className="text-slate-600 mb-4">The short URL format is invalid.</p>
          <Link to="/" className="text-primary hover:underline">Go to homepage</Link>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Redirect Failed</h1>
          <p className="text-slate-600 mb-4">Unable to redirect. The link may be expired or invalid.</p>
          <Link to="/" className="text-primary hover:underline">Go to homepage</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-primary mx-auto mb-4 animate-spin" />
        <p className="text-slate-600">Redirecting...</p>
      </div>
    </div>
  )
}
