import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { HomePage } from "@/components/pages/HomePage";
import { StoragePage } from "@/components/pages/StoragePage";
import { ShortenerPage } from "@/components/pages/ShortenerPage";
import { LoginPage } from "@/components/pages/LoginPage";
import { SignupPage } from "@/components/pages/SignupPage";
import { ConfirmSignupPage } from "@/components/pages/ConfirmSignupPage";
import { ForgotPasswordPage } from "@/components/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/components/pages/ResetPasswordPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/confirm-signup" element={<ConfirmSignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
