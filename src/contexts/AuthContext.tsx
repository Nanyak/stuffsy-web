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
const USERNAME_KEY = "stuffsy_username";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessTokenRef = useRef<string | null>(null);
  const refreshTimeoutRef = useRef<number | null>(null);

  const clearAuth = useCallback(() => {
    accessTokenRef.current = null;
    setUser(null);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
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
        const storedUsername = localStorage.getItem(USERNAME_KEY);
        if (storedRefresh && storedUsername) {
          try {
            const tokens = await authService.refreshToken(storedRefresh, storedUsername);
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
    localStorage.setItem(USERNAME_KEY, email);
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
      const storedUsername = localStorage.getItem(USERNAME_KEY);
      if (storedRefresh && storedUsername) {
        try {
          const tokens = await authService.refreshToken(storedRefresh, storedUsername);
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
          const storedUsername = localStorage.getItem(USERNAME_KEY);
          if (storedRefresh && storedUsername) {
            try {
              const tokens = await authService.refreshToken(storedRefresh, storedUsername);
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
