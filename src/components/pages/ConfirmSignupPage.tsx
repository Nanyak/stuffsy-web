import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { confirmSignUp, resendConfirmationCode } from "@/services/auth_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";

const PRIMARY   = '#E7C59A'
const PRIMARY_L = '#E7C59A'
const TEXT_HI   = '#F3F3F3'
const TEXT_MID  = '#949494'
const SURFACE   = '#080808'
const BORDER    = '#333333'
const BORDER_EM = 'rgba(231,197,154,0.30)'
const FONT_DISP = "'Inter', system-ui, sans-serif"

export function ConfirmSignupPage() {
  const location = useLocation();
  const [email] = useState(location.state?.email || "");
  const [username, setUsername] = useState(location.state?.username || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      await confirmSignUp(username, code);
      navigate("/login", { state: { message: "Account confirmed! Please sign in." } });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || "Invalid confirmation code");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!username) { setError("Please enter your username"); return; }
    setError("");
    setMessage("");
    setIsResending(true);
    try {
      await resendConfirmationCode(username);
      setMessage("A new confirmation code has been sent to your email");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || "Failed to resend code");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsResending(false);
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
            <CheckCircle className="h-5 w-5" style={{ color: PRIMARY }} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ fontFamily: FONT_DISP, color: TEXT_HI }}>
            Confirm your email
          </h1>
          <p className="text-sm" style={{ color: TEXT_MID }}>
            We sent a verification code to{" "}
            {email ? <span style={{ color: TEXT_HI, fontWeight: 500 }}>{email}</span> : "your email"}
          </p>
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
            {message && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{
                background: 'rgba(0,172,92,0.08)',
                border: '1px solid rgba(0,172,92,0.22)',
                color: '#00AC5C',
              }}>
                <CheckCircle className="h-4 w-4 shrink-0" />
                {message}
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium" style={{ color: TEXT_HI }}>Username</label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="johndoe" required />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="code" className="text-sm font-medium" style={{ color: TEXT_HI }}>Verification code</label>
              <Input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} required />
            </div>
            <Button
              type="submit"
              className="w-full h-11 font-semibold cursor-pointer transition-all duration-200"
              disabled={isLoading}
              style={!isLoading ? { boxShadow: '0 0 20px rgba(231,197,154,0.25)' } : {}}
            >
              {isLoading ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Confirming...</>
              ) : (
                <><CheckCircle className="h-4 w-4" />Confirm</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 cursor-pointer"
              onClick={handleResendCode}
              disabled={isResending}
            >
              {isResending ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />Sending...</>
              ) : (
                <><RefreshCw className="h-4 w-4" />Resend code</>
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
