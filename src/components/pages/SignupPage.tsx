import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "@/services/auth_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, AlertCircle, Check, X } from "lucide-react";

const PRIMARY   = '#E7C59A'
const PRIMARY_L = '#E7C59A'
const TEXT_HI   = '#F3F3F3'
const TEXT_MID  = '#949494'
const SURFACE   = '#080808'
const BORDER    = '#333333'
const BORDER_EM = 'rgba(231,197,154,0.30)'
const FONT_DISP = "'Inter', system-ui, sans-serif"

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /\d/.test(p) },
  { label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function parseApiError(raw: string): string {
  if (raw.includes("Password did not conform with policy")) {
    if (raw.includes("uppercase")) return "Password must contain at least one uppercase letter.";
    if (raw.includes("lowercase")) return "Password must contain at least one lowercase letter.";
    if (raw.includes("numeric")) return "Password must contain at least one number.";
    if (raw.includes("symbol")) return "Password must contain at least one special character.";
    if (raw.includes("long enough")) return "Password must be at least 8 characters.";
    return "Password does not meet the requirements below.";
  }
  if (raw.includes("UsernameExistsException") || raw.includes("already exists")) {
    return "An account with this username or email already exists.";
  }
  if (raw.includes("InvalidPasswordException")) {
    return "Password does not meet the requirements below.";
  }
  return raw;
}

export function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const passwordRulesMet = PASSWORD_RULES.map((r) => r.test(password));
  const allRulesMet = passwordRulesMet.every(Boolean);
  const showRules = passwordFocused || (password.length > 0 && !allRulesMet);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRulesMet) {
      setError("Password does not meet the requirements below.");
      setPasswordFocused(true);
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await signUp({ username, email, password, name });
      navigate("/confirm-signup", { state: { email, username } });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        const raw = axiosError.response?.data?.error || "Failed to create account";
        setError(parseApiError(raw));
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
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(231,197,154,0.06) 0%, transparent 70%)',
      }} />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4" style={{
            background: 'rgba(231,197,154,0.08)',
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
          boxShadow: '0 4px 24px rgba(0,0,0,0.40)',
        }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.20)',
                color: '#ef4444',
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="Min 8 characters"
                required
              />
              {showRules && (
                <ul className="mt-2 space-y-1">
                  {PASSWORD_RULES.map((rule, i) => (
                    <li key={rule.label} className="flex items-center gap-1.5 text-xs" style={{
                      color: passwordRulesMet[i] ? '#00AC5C' : '#949494',
                    }}>
                      {passwordRulesMet[i]
                        ? <Check className="h-3 w-3 shrink-0" />
                        : <X className="h-3 w-3 shrink-0" />}
                      {rule.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-11 font-semibold cursor-pointer transition-all duration-200"
              disabled={isLoading}
              style={!isLoading ? { boxShadow: '0 0 20px rgba(231,197,154,0.25)' } : {}}
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
