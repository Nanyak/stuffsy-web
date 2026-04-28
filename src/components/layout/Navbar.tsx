import { Link, NavLink } from "react-router-dom";
import { Cloud, Link2, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link
            to="/"
            className="font-semibold text-base text-foreground hover:text-primary transition-colors duration-150 cursor-pointer tracking-tight"
          >
            Stuffsy
          </Link>

          <div className="flex items-center gap-1">
            <NavLink
              to="/storage"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <Cloud className="h-4 w-4" />
              Storage
            </NavLink>
            <NavLink
              to="/shortener"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <Link2 className="h-4 w-4" />
              Shortener
            </NavLink>

            <div className="h-4 w-px bg-border mx-2" />

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  {user?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
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
