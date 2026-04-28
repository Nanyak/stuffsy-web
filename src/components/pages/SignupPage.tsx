import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "@/services/auth_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, AlertCircle } from "lucide-react";

const PRIMARY   = 'oklch(0.545 0.185 268)'
const PRIMARY_L = 'oklch(0.440 0.185 268)'
const TEXT_HI   = 'oklch(0.180 0.014 260)'
const TEXT_MID  = 'oklch(0.430 0.010 260)'
const SURFACE   = 'oklch(1 0 0)'
const BORDER    = 'rgba(0,0,0,0.07)'
const BORDER_EM = 'oklch(0.545 0.185 268 / 0.28)'
const FONT_DISP = "'Syne', system-ui, sans-serif"

export function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signUp({ username, email, password, name });
      navigate("/confirm-signup", { state: { email, username } });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || "Failed to create account");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] relative py-8">
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.545 0.185 268 / 0.07) 0%, transparent 70%)',
      }} />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4" style={{
            background: 'oklch(0.545 0.185 268 / 0.10)',
            border: `1px solid ${BORDER_EM}`,
          }}>
            <UserPlus className="h-5 w-5" style={{ color: PRIMARY }} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ fontFamily: FONT_DISP, color: TEXT_HI }}>
            Create account
          </h1>
          <p className="text-sm" style={{ color: TEXT_MID }}>Sign up and start using Stuffsy for free</p>
        </div>

        <div className="rounded-2xl p-7" style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{
                background: 'oklch(0.580 0.220 27 / 0.07)',
                border: '1px solid oklch(0.580 0.220 27 / 0.20)',
                color: 'oklch(0.480 0.180 27)',
              }}>
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium" style={{ color: TEXT_HI }}>Full name</label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium" style={{ color: TEXT_HI }}>Username</label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="johndoe" required />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium" style={{ color: TEXT_HI }}>Email</label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: TEXT_HI }}>Password</label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" minLength={8} required />
            </div>
            <Button
              type="submit"
              className="w-full h-11 font-semibold cursor-pointer transition-all duration-200"
              disabled={isLoading}
              style={!isLoading ? { boxShadow: '0 0 20px oklch(0.545 0.185 268 / 0.28)' } : {}}
            >
              {isLoading ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Creating account...</>
              ) : (
                <><UserPlus className="h-4 w-4" />Sign up</>
              )}
            </Button>
          </form>

          <div className="mt-5 pt-5 text-center" style={{ borderTop: `1px solid ${BORDER}` }}>
            <p className="text-sm" style={{ color: TEXT_MID }}>
              Already have an account?{" "}
              <Link to="/login" className="font-medium transition-opacity hover:opacity-75" style={{ color: PRIMARY_L }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
