import { Link, NavLink } from 'react-router-dom'
import { Cloud, Link2 } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="font-heading text-xl font-bold text-primary hover:text-primary/80 transition-colors duration-200 cursor-pointer"
          >
            Stuffsy
          </Link>

          <div className="flex items-center gap-2 overflow-x-auto">
            <NavLink
              to="/storage"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Cloud className="h-4 w-4" />
              Storage
            </NavLink>
            <NavLink
              to="/shortener"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Link2 className="h-4 w-4" />
              Shortener
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}
