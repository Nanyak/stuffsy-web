import { Link, NavLink } from "react-router-dom";
import { Cloud, Link2, LogIn, LogOut, User, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav
      className="sticky top-0 z-50"
      style={{ background: '#101010', borderBottom: '1px solid #333333' }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-base tracking-tight transition-opacity hover:opacity-70 cursor-pointer"
            style={{ color: '#F3F3F3', letterSpacing: '-0.011em', fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Stuffsy
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {[
              { to: '/storage',   label: 'STORAGE',   icon: <Cloud className="h-3.5 w-3.5" />,     isNew: false },
              { to: '/shortener', label: 'SHORTENER', icon: <Link2 className="h-3.5 w-3.5" />,     isNew: false },
              { to: '/ai',        label: 'AI',        icon: <Sparkles className="h-3.5 w-3.5" />,  isNew: true  },
            ].map(({ to, label, icon, isNew }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-wider transition-colors duration-150 cursor-pointer rounded-[8px] ${
                    isActive
                      ? 'text-[#5B8DEF]'
                      : 'text-[#ABABAB] hover:text-[#F3F3F3]'
                  }`
                }
              >
                {icon}
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
        </div>
      </div>
    </nav>
  );
}
