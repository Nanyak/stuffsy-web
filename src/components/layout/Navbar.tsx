import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Cloud, Link2, LogIn, LogOut, User, Sparkles, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_LINKS = [
  { to: '/storage',   label: 'STORAGE',   icon: Cloud,     isNew: false },
  { to: '/shortener', label: 'SHORTENER', icon: Link2,     isNew: false },
  { to: '/ai',        label: 'AI',        icon: Sparkles,  isNew: true  },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50"
      style={{ background: '#101010', borderBottom: '1px solid #333333' }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-base tracking-tight transition-opacity hover:opacity-70 cursor-pointer shrink-0"
            style={{ color: '#F3F3F3', letterSpacing: '-0.011em', fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Stuffsy
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon, isNew }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-wider transition-colors duration-150 cursor-pointer rounded-[8px] ${
                    isActive ? 'text-[#5B8DEF]' : 'text-[#ABABAB] hover:text-[#F3F3F3]'
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {isNew && (
                  <span style={{
                    fontSize: '10px', padding: '1px 7px', borderRadius: '20px',
                    background: '#E7C59A', color: '#101010', fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}>
                    NEW
                  </span>
                )}
              </NavLink>
            ))}

            <div className="h-4 w-px bg-[#333333] mx-2" />

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-1.5 px-4 py-2 text-xs text-[#949494]">
                  <User className="h-3.5 w-3.5" />
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#949494] hover:text-[#F3F3F3] transition-colors duration-150 cursor-pointer rounded-[8px] tracking-wider"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  LOGOUT
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-wider transition-opacity hover:opacity-80 cursor-pointer rounded-[8px]"
                style={{ background: '#333333', color: '#FFFFFF' }}
              >
                <LogIn className="h-3.5 w-3.5" />
                LOGIN
              </NavLink>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-150 cursor-pointer"
            style={{ color: '#ABABAB' }}
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{ background: '#101010', borderTop: '1px solid #222222' }}
        >
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ to, label, icon: Icon, isNew }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium tracking-wider transition-colors duration-150 cursor-pointer ${
                    isActive ? 'text-[#5B8DEF]' : 'text-[#ABABAB]'
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? 'rgba(91,141,239,0.08)' : 'transparent',
                })}
              >
                <Icon className="h-4 w-4" />
                {label}
                {isNew && (
                  <span style={{
                    fontSize: '10px', padding: '1px 7px', borderRadius: '20px',
                    background: '#E7C59A', color: '#101010', fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}>
                    NEW
                  </span>
                )}
              </NavLink>
            ))}

            <div style={{ height: '1px', background: '#222222', margin: '8px 0' }} />

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#949494]">
                  <User className="h-4 w-4" />
                  {user?.name}
                </div>
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#949494] hover:text-[#F3F3F3] transition-colors duration-150 cursor-pointer tracking-wider"
                >
                  <LogOut className="h-4 w-4" />
                  LOGOUT
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium tracking-wider transition-opacity hover:opacity-80 cursor-pointer"
                style={{ background: '#333333', color: '#FFFFFF' }}
              >
                <LogIn className="h-4 w-4" />
                LOGIN
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
