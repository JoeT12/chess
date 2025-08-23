"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  email: string;
  role: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = async (): Promise<string> => {
    const res = await fetch("http://localhost:8081/api/auth/token", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      await logout();
      throw new Error("Token refresh failed");
    }

    const data = await res.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const newToken = await refreshToken();
        await fetchUser(newToken);
      } catch (err) {
        console.log("No valid session");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchUser = async (token: string) => {
    const res = await fetch("http://localhost:8081/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("User fetch failed");
    const data = await res.json();
    setUser(data);
  };

  const login = async (emailInput: string, password: string) => {
    const res = await fetch("http://localhost:8081/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput, password }),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    setAccessToken(data.accessToken);
    await fetchUser(data.accessToken);
  };

  const logout = async () => {
    await fetch("http://localhost:8081/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setAccessToken(null);
  };

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    if (!accessToken) throw new Error("Not authenticated");

    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("API request failed");
    return res.json();
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, loading, login, logout, apiFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
