import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export function RedirectPage() {
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (code) {
      // Let the backend handle the redirect via its RedirectURL handler
      window.location.href = `/s/${code}`
    }
  }, [code, navigate])

  return <div>Redirecting...</div>
}
