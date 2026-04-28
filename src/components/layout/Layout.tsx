import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Mail } from 'lucide-react'
import { T } from '@/lib/tokens'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer style={{ borderTop: '1px solid var(--c-border-subtle)' }}>
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: T.textLo }}>
            © {new Date().getFullYear()} Stuffsy. Free tools for everyone.
          </p>
          <a
            href="mailto:dinhquyetthang1303@gmail.com"
            className="inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
            style={{ color: T.primaryL }}
          >
            <Mail className="h-3.5 w-3.5" />
            dinhquyetthang1303@gmail.com
          </a>
        </div>
      </footer>
    </div>
  )
}
