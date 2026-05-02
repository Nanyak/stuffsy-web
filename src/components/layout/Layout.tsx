import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Mail } from 'lucide-react'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer style={{ borderTop: '1px solid #e9eaeb' }}>
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 px-6"
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          <p className="text-xs" style={{ color: '#615e5b' }}>
            © {new Date().getFullYear()} Stuffsy. Free tools for everyone.
          </p>
          <a
            href="mailto:dinhquyetthang1303@gmail.com"
            className="inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-60"
            style={{ color: '#111111', textDecoration: 'none' }}
          >
            <Mail className="h-3.5 w-3.5" />
            dinhquyetthang1303@gmail.com
          </a>
        </div>
      </footer>
    </div>
  )
}
