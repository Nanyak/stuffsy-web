import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "@/services/auth_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, AlertCircle, ArrowLeft } from "lucide-react";

const PRIMARY   = '#E7C59A'
const PRIMARY_L = '#E7C59A'
const TEXT_HI   = '#F3F3F3'
const TEXT_MID  = '#949494'
const SURFACE   = '#080808'
const BORDER    = '#333333'
const BORDER_EM = 'rgba(231,197,154,0.30)'
const FONT_DISP = "'Inter', system-ui, sans-serif"

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await forgotPassword(email);
      navigate("/reset-password", { state: { email } });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || "Failed to send reset code");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] relative">
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(231,197,154,0.06) 0%, transparent 70%)',
      }} />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4" style={{
            background: 'rgba(231,197,154,0.08)',
            border: `1px solid ${BORDER_EM}`,
          }}>
            <Mail className="h-5 w-5" style={{ color: PRIMARY }} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ fontFamily: FONT_DISP, color: TEXT_HI }}>
            Forgot password?
          </h1>
          <p className="text-sm" style={{ color: TEXT_MID }}>We'll send a reset code to your email</p>
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
              <label htmlFor="email" className="text-sm font-medium" style={{ color: TEXT_HI }}>Email</label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <Button
              type="submit"
              className="w-full h-11 font-semibold cursor-pointer transition-all duration-200"
              disabled={isLoading}
              style={!isLoading ? { boxShadow: '0 0 20px rgba(231,197,154,0.25)' } : {}}
            >
              {isLoading ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Sending...</>
              ) : (
                <><Mail className="h-4 w-4" />Send reset code</>
              )}
            </Button>
          </form>

          <div className="mt-5 pt-5 text-center" style={{ borderTop: `1px solid ${BORDER}` }}>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-75"
              style={{ color: PRIMARY_L }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
