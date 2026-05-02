import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { HomePage } from "@/components/pages/HomePage";
import { StoragePage } from "@/components/pages/StoragePage";
import { ShortenerPage } from "@/components/pages/ShortenerPage";
import { AiPage } from "@/components/pages/AiPage";
import { LoginPage } from "@/components/pages/LoginPage";
import { SignupPage } from "@/components/pages/SignupPage";
import { ConfirmSignupPage } from "@/components/pages/ConfirmSignupPage";
import { ForgotPasswordPage } from "@/components/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/components/pages/ResetPasswordPage";
import { RedirectPage } from "@/components/pages/RedirectPage";

function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/s/:code" element={<RedirectPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/storage"
              element={
                <ProtectedRoute>
                  <StoragePage />
                </ProtectedRoute>
              }
            />
            <Route path="/shortener" element={<ShortenerPage />} />
            <Route
              path="/ai"
              element={
                <ProtectedRoute>
                  <AiPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/confirm-signup" element={<ConfirmSignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
