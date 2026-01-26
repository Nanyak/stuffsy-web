import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export function RedirectPage() {
  const { code } = useParams()

  useEffect(() => {
    if (code) {
      // Redirect to API endpoint which performs HTTP 302 to the original URL
      window.location.href = `${import.meta.env.VITE_API_URL}/${code}`
    }
  }, [code])

  return <div>Redirecting...</div>
}
