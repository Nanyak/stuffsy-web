import { Link, NavLink } from "react-router-dom";
import { Cloud, Link2, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

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
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Link2 className="h-4 w-4" />
              Shortener
            </NavLink>

            <div className="h-6 w-px bg-slate-200 mx-2" />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600">
                  <User className="h-4 w-4" />
                  {user?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <LogIn className="h-4 w-4" />
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
