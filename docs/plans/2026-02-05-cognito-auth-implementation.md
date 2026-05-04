# Cognito Auth & User-Scoped Storage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Cognito authentication to stuffsy-web and scope storage to individual users in stuffsy-api.

**Architecture:** Frontend uses AuthContext for token management with axios interceptors. API applies auth middleware to storage routes and prefixes all file keys with userId.

**Tech Stack:** React 19, TypeScript, Gin, AWS Cognito

---

## Task 1: API - Apply Auth Middleware to Storage Routes

**Files:**
- Modify: `stuffsy-api/cmd/app/main.go:120-128`

**Step 1: Update storage routes to use auth middleware**

In `main.go`, change the storage routes to be protected:

```go
// Storage routes (protected)
files := api.Group("/files")
files.Use(httphandler.AuthMiddleware(authUsecase))
{
    files.POST("", storageHandler.UploadFile)
    files.GET("", storageHandler.ListFiles)
    files.DELETE("/:key", storageHandler.DeleteFile)
    files.GET("/:key/url", storageHandler.GetPresignedURL)
}
```

**Step 2: Run API to verify it compiles**

Run: `cd C:/Users/Admin/Desktop/stuffsy-api && go build ./...`
Expected: No errors

**Step 3: Commit**

```bash
cd C:/Users/Admin/Desktop/stuffsy-api
git add cmd/app/main.go
git commit -m "feat: protect storage routes with auth middleware"
```

---

## Task 2: API - Add User Scoping to Storage Handler

**Files:**
- Modify: `stuffsy-api/internal/controller/http/storage_handler.go`

**Step 1: Update UploadFile to prefix with userId**

```go
// UploadFile handles file upload via multipart/form-data
func (h *StorageHandler) UploadFile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file provided"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}
	defer src.Close()

	// Prefix key with userId
	key := userID.(string) + "/" + file.Filename
	contentType := file.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	if err := h.storage.Upload(c.Request.Context(), key, src, contentType); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload file"})
		return
	}

	url, err := h.storage.GetURL(c.Request.Context(), key, time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate URL"})
		return
	}

	resp := UploadFileResponse{
		Key: file.Filename, // Return original filename to client
		URL: url,
	}

	c.JSON(http.StatusOK, resp)
}
```

**Step 2: Update ListFiles to filter by userId prefix**

```go
// ListFiles returns all files for the authenticated user
func (h *StorageHandler) ListFiles(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Always filter by user's prefix
	prefix := userID.(string) + "/"

	files, err := h.storage.List(c.Request.Context(), prefix)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list files"})
		return
	}

	fileInfos := make([]FileInfo, 0, len(files))
	for _, f := range files {
		// Strip userId prefix from key for client
		displayKey := strings.TrimPrefix(f.Key, prefix)
		fileInfos = append(fileInfos, FileInfo{
			Key:          displayKey,
			Size:         f.Size,
			ContentType:  f.ContentType,
			LastModified: f.LastModified.Format(time.RFC3339),
		})
	}

	resp := ListFilesResponse{
		Files: fileInfos,
	}

	c.JSON(http.StatusOK, resp)
}
```

**Step 3: Update DeleteFile to validate ownership**

```go
// DeleteFile removes a file from storage
func (h *StorageHandler) DeleteFile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	key := c.Param("key")
	if key == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File key is required"})
		return
	}

	// Construct full key with userId prefix
	fullKey := userID.(string) + "/" + key

	if err := h.storage.Delete(c.Request.Context(), fullKey); err != nil {
		if errors.IsNotFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "File deleted successfully"})
}
```

**Step 4: Update GetPresignedURL to validate ownership**

```go
// GetPresignedURL generates a presigned download URL
func (h *StorageHandler) GetPresignedURL(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	key := c.Param("key")
	if key == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File key is required"})
		return
	}

	// Construct full key with userId prefix
	fullKey := userID.(string) + "/" + key

	expiration := time.Hour
	url, err := h.storage.GetURL(c.Request.Context(), fullKey, expiration)
	if err != nil {
		if errors.IsNotFound(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate URL"})
		return
	}

	expiresAt := time.Now().Add(expiration)
	resp := PresignedURLResponse{
		URL:       url,
		ExpiresAt: expiresAt.Format(time.RFC3339),
	}

	c.JSON(http.StatusOK, resp)
}
```

**Step 5: Add strings import**

Add `"strings"` to the imports at the top of the file.

**Step 6: Build to verify**

Run: `cd C:/Users/Admin/Desktop/stuffsy-api && go build ./...`
Expected: No errors

**Step 7: Commit**

```bash
cd C:/Users/Admin/Desktop/stuffsy-api
git add internal/controller/http/storage_handler.go
git commit -m "feat: scope storage operations to authenticated user"
```

---

## Task 3: Web - Create Auth Service

**Files:**
- Create: `stuffsy-web/src/services/auth_service.ts`

**Step 1: Create the auth service file**

```typescript
import axios from "axios";

export interface AuthTokens {
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  email_verified: boolean;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface SignUpResponse {
  user_id: string;
  confirmed: boolean;
}

export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  const response = await axios.post<SignUpResponse>("/v1/api/auth/signup", data);
  return response.data;
}

export async function confirmSignUp(email: string, confirmationCode: string): Promise<void> {
  await axios.post("/v1/api/auth/confirm-signup", {
    email,
    confirmation_code: confirmationCode,
  });
}

export async function signIn(email: string, password: string): Promise<AuthTokens> {
  const response = await axios.post<AuthTokens>("/v1/api/auth/signin", {
    email,
    password,
  });
  return response.data;
}

export async function forgotPassword(email: string): Promise<void> {
  await axios.post("/v1/api/auth/forgot-password", { email });
}

export async function confirmForgotPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  await axios.post("/v1/api/auth/confirm-forgot-password", {
    email,
    code,
    new_password: newPassword,
  });
}

export async function refreshToken(refreshToken: string): Promise<AuthTokens> {
  const response = await axios.post<AuthTokens>("/v1/api/auth/refresh", {
    refresh_token: refreshToken,
  });
  return response.data;
}

export async function getUser(accessToken: string): Promise<User> {
  const response = await axios.get<User>("/v1/api/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

export async function signOut(accessToken: string): Promise<void> {
  await axios.post(
    "/v1/api/auth/signout",
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
}
```

**Step 2: Commit**

```bash
cd C:/Users/Admin/Desktop/stuffsy-web
git add src/services/auth_service.ts
git commit -m "feat: add auth service for Cognito API calls"
```

---

## Task 4: Web - Create AuthContext

**Files:**
- Create: `stuffsy-web/src/contexts/AuthContext.tsx`

**Step 1: Create the AuthContext file**

```tsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import * as authService from "@/services/auth_service";
import type { User, AuthTokens } from "@/services/auth_service";
import axios from "axios";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const REFRESH_TOKEN_KEY = "stuffsy_refresh_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessTokenRef = useRef<string | null>(null);
  const refreshTimeoutRef = useRef<number | null>(null);

  const clearAuth = useCallback(() => {
    accessTokenRef.current = null;
    setUser(null);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  const scheduleRefresh = useCallback((expiresIn: number) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    // Refresh 60 seconds before expiry
    const refreshTime = (expiresIn - 60) * 1000;
    if (refreshTime > 0) {
      refreshTimeoutRef.current = window.setTimeout(async () => {
        const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (storedRefresh) {
          try {
            const tokens = await authService.refreshToken(storedRefresh);
            accessTokenRef.current = tokens.access_token;
            localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
            scheduleRefresh(tokens.expires_in);
          } catch {
            clearAuth();
          }
        }
      }, refreshTime);
    }
  }, [clearAuth]);

  const setTokens = useCallback((tokens: AuthTokens) => {
    accessTokenRef.current = tokens.access_token;
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    scheduleRefresh(tokens.expires_in);
  }, [scheduleRefresh]);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authService.signIn(email, password);
    setTokens(tokens);
    const userData = await authService.getUser(tokens.access_token);
    setUser(userData);
  }, [setTokens]);

  const logout = useCallback(async () => {
    if (accessTokenRef.current) {
      try {
        await authService.signOut(accessTokenRef.current);
      } catch {
        // Ignore signout errors
      }
    }
    clearAuth();
  }, [clearAuth]);

  const getAccessToken = useCallback(() => accessTokenRef.current, []);

  // Initialize: try to restore session from refresh token
  useEffect(() => {
    const init = async () => {
      const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (storedRefresh) {
        try {
          const tokens = await authService.refreshToken(storedRefresh);
          setTokens(tokens);
          const userData = await authService.getUser(tokens.access_token);
          setUser(userData);
        } catch {
          clearAuth();
        }
      }
      setIsLoading(false);
    };
    init();
  }, [setTokens, clearAuth]);

  // Setup axios interceptor
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const token = accessTokenRef.current;
      if (token && config.url?.startsWith("/v1/api/files")) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
          if (storedRefresh) {
            try {
              const tokens = await authService.refreshToken(storedRefresh);
              setTokens(tokens);
              originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
              return axios(originalRequest);
            } catch {
              clearAuth();
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [setTokens, clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

**Step 2: Commit**

```bash
cd C:/Users/Admin/Desktop/stuffsy-web
git add src/contexts/AuthContext.tsx
git commit -m "feat: add AuthContext with token management and axios interceptor"
```

---

## Task 5: Web - Create ProtectedRoute Component

**Files:**
- Create: `stuffsy-web/src/components/auth/ProtectedRoute.tsx`

**Step 1: Create the ProtectedRoute file**

```tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

**Step 2: Commit**

```bash
cd C:/Users/Admin/Desktop/stuffsy-web
git add src/components/auth/ProtectedRoute.tsx
git commit -m "feat: add ProtectedRoute component"
```

---

## Task 6: Web - Create Login Page

**Files:**
- Create: `stuffsy-web/src/components/pages/LoginPage.tsx`

**Step 1: Create the LoginPage file**

```tsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/storage";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 403) {
          setError("Please confirm your email before signing in");
        } else {
          setError(axiosError.response?.data?.error || "Invalid credentials");
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </span>
              )}
            </Button>
            <div className="text-center text-sm space-y-2">
              <Link
                to="/forgot-password"
                className="text-primary hover:underline cursor-pointer"
              >
                Forgot password?
              </Link>
              <p className="text-slate-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline cursor-pointer">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Commit**

```bash
cd C:/Users/Admin/Desktop/stuffsy-web
git add src/components/pages/LoginPage.tsx
git commit -m "feat: add LoginPage component"
```

---

## Task 7: Web - Create Signup Page

**Files:**
- Create: `stuffsy-web/src/components/pages/SignupPage.tsx`

**Step 1: Create the SignupPage file**

```tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "@/services/auth_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

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
      navigate("/confirm-signup", { state: { email } });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 409) {
          setError("An account with this email already exists");
        } else {
          setError(axiosError.response?.data?.error || "Failed to create account");
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                minLength={8}
                required
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign up
                </span>
              )}
            </Button>
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline cursor-pointer">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Commit**

```bash
cd C:/Users/Admin/Desktop/stuffsy-web
git add src/components/pages/SignupPage.tsx
git commit -m "feat: add SignupPage component"
```

---

## Task 8: Web - Create Confirm Signup Page

**Files:**
- Create: `stuffsy-web/src/components/pages/ConfirmSignupPage.tsx`

**Step 1: Create the ConfirmSignupPage file**

```tsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { confirmSignUp } from "@/services/auth_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function ConfirmSignupPage() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await confirmSignUp(email, code);
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

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Confirm your email</CardTitle>
          <CardDescription>
            We sent a verification code to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Verification code
              </label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Confirming...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Confirm
                </span>
              )}
            </Button>
            <p className="text-center text-sm text-slate-600">
              <Link to="/login" className="text-primary hover:underline cursor-pointer">
                Back to sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Commit**

```bash
cd C:/Users/Admin/Desktop/stuffsy-web
git add src/components/pages/ConfirmSignupPage.tsx
git commit -m "feat: add ConfirmSignupPage component"
```

---

## Task 9: Web - Create Forgot Password Page

**Files:**
- Create: `stuffsy-web/src/components/pages/ForgotPasswordPage.tsx`

**Step 1: Create the ForgotPasswordPage file**

```tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "@/services/auth_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

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
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot password?</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a reset code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send reset code
                </span>
              )}
            </Button>
            <p className="text-center text-sm text-slate-600">
              <Link to="/login" className="text-primary hover:underline cursor-pointer">
                Back to sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Commit**

```bash
cd C:/Users/Admin/Desktop/stuffsy-web
git add src/components/pages/ForgotPasswordPage.tsx
git commit -m "feat: add ForgotPasswordPage component"
```

---

## Task 10: Web - Create Reset Password Page

**Files:**
- Create: `stuffsy-web/src/components/pages/ResetPasswordPage.tsx`

**Step 1: Create the ResetPasswordPage file**

```tsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { confirmForgotPassword } from "@/services/auth_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound } from "lucide-react";

export function ResetPasswordPage() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await confirmForgotPassword(email, code, newPassword);
      navigate("/login", { state: { message: "Password reset successful! Please sign in." } });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || "Failed to reset password");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>
            Enter the code sent to your email and your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Reset code
              </label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New password
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                minLength={8}
                required
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Resetting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Reset password
                </span>
              )}
            </Button>
            <p className="text-center text-sm text-slate-600">
              <Link to="/login" className="text-primary hover:underline cursor-pointer">
                Back to sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Commit**

```bash
cd C:/Users/Admin/Desktop/stuffsy-web
git add src/components/pages/ResetPasswordPage.tsx
git commit -m "feat: add ResetPasswordPage component"
```

---

## Task 11: Web - Update Navbar with Auth State

**Files:**
- Modify: `stuffsy-web/src/components/layout/Navbar.tsx`

**Step 1: Update Navbar to show auth state**

Replace entire file:

```tsx
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
```

**Step 2: Commit**

```bash
cd C:/Users/Admin/Desktop/stuffsy-web
git add src/components/layout/Navbar.tsx
git commit -m "feat: update Navbar with auth state and logout"
```

---

## Task 12: Web - Update App.tsx with Routes and AuthProvider

**Files:**
- Modify: `stuffsy-web/src/App.tsx`

**Step 1: Update App.tsx with new routes and AuthProvider**

Replace entire file:

```tsx
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
```

**Step 2: Build to verify**

Run: `cd C:/Users/Admin/Desktop/stuffsy-web && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
cd C:/Users/Admin/Desktop/stuffsy-web
git add src/App.tsx
git commit -m "feat: add auth routes and wrap app with AuthProvider"
```

---

## Task 13: Verification - Test Full Flow

**Step 1: Start API**

Run: `cd C:/Users/Admin/Desktop/stuffsy-api && go run cmd/app/main.go`

**Step 2: Start Web (in separate terminal)**

Run: `cd C:/Users/Admin/Desktop/stuffsy-web && npm run dev`

**Step 3: Manual test checklist**

- [ ] Navigate to /storage → redirects to /login
- [ ] Sign up with new account
- [ ] Confirm email with code
- [ ] Sign in → redirects to /storage
- [ ] Upload a file → file appears in list
- [ ] Download file works
- [ ] Delete file works
- [ ] Logout → navbar shows Login
- [ ] Sign in with different account → cannot see first user's files
