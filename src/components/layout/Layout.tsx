import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Mail } from 'lucide-react'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'oklch(0.620 0.008 260)' }}>
            © {new Date().getFullYear()} Stuffsy. Free tools for everyone.
          </p>
          <a
            href="mailto:dinhquyetthang1303@gmail.com"
            className="inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
            style={{ color: 'oklch(0.440 0.185 268)' }}
          >
            <Mail className="h-3.5 w-3.5" />
            dinhquyetthang1303@gmail.com
          </a>
        </div>
      </footer>
    </div>
  )
}
