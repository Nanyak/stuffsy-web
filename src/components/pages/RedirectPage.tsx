import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export function RedirectPage() {
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const redirectToUrl = async () => {
      try {
        const response = await axios.get(`/url/${code}`)
        window.location.href = response.data.long_url
      } catch (error) {
        navigate('/')
      }
    }
    redirectToUrl()
  }, [code, navigate])

  return <div>Redirecting...</div>
}
