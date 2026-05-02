import { Link, NavLink } from "react-router-dom";
import { Cloud, Link2, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_LINK_BASE = "flex items-center gap-1.5 px-[18px] py-[9px] text-sm font-medium transition-colors duration-150 cursor-pointer"
const NAV_LINK_INACTIVE = "text-[#615e5b] hover:text-[#111111] hover:bg-[#f3efeb]"
const NAV_LINK_ACTIVE   = "text-[#111111] bg-[#f3efeb]"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: '1px solid #e9eaeb' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-base tracking-tight transition-opacity hover:opacity-70 cursor-pointer"
            style={{ color: '#111111', letterSpacing: '-0.03em', fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Stuffsy
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <NavLink
              to="/storage"
              style={{ borderRadius: '140px' }}
              className={({ isActive }) =>
                `${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`
              }
            >
              <Cloud className="h-3.5 w-3.5" />
              Storage
            </NavLink>
            <NavLink
              to="/shortener"
              style={{ borderRadius: '140px' }}
              className={({ isActive }) =>
                `${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`
              }
            >
              <Link2 className="h-3.5 w-3.5" />
              Shortener
            </NavLink>

            <div className="h-4 w-px bg-[#e9eaeb] mx-2" />

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <span
                  className="flex items-center gap-1.5 px-[18px] py-[9px] text-sm"
                  style={{ color: '#615e5b' }}
                >
                  <User className="h-3.5 w-3.5" />
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-[18px] py-[9px] text-sm font-medium transition-colors duration-150 cursor-pointer hover:text-[#111111] hover:bg-[#f3efeb]"
                  style={{ color: '#615e5b', borderRadius: '140px' }}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                style={{ borderRadius: '160px' }}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-6 py-[9px] text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-black text-white'
                      : 'bg-black text-white hover:opacity-80'
                  }`
                }
              >
                <LogIn className="h-3.5 w-3.5" />
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
