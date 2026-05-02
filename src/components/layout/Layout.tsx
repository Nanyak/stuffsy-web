import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Mail } from 'lucide-react'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#101010' }}>
      <Navbar />
      <main className="flex-1 px-8 py-8" style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
      <footer style={{ borderTop: '1px solid #333333' }}>
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 px-8"
          style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}
        >
          <p className="text-xs" style={{ color: '#949494' }}>
            © {new Date().getFullYear()} Stuffsy. Free tools for everyone.
          </p>
          <a
            href="mailto:dinhquyetthang1303@gmail.com"
            className="inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-60"
            style={{ color: '#E7C59A', textDecoration: 'none' }}
          >
            <Mail className="h-3.5 w-3.5" />
            dinhquyetthang1303@gmail.com
          </a>
        </div>
      </footer>
    </div>
  )
}
