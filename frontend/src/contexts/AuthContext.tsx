import { useEffect, useState, useCallback } from "react";
import { api } from "../libs/axios";
import { createContext } from "use-context-selector";
import { jwtDecode } from "jwt-decode";

interface User {
  userId: string;
  organizationId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

interface JwtPayload {
  id: string;
  email: string;
  organizacaoId: string;
  exp: number;
  iat: number;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (email: string, senha: string) => {
    const response = await api.post("/auth/login", { email, senha });
    const token = response.data.token;

    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const decoded = jwtDecode<JwtPayload>(token);
    setUser({ userId: decoded.id, organizationId: decoded.organizacaoId });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  }, []);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setIsLoading(false); // <- finalize o carregamento mesmo sem token
    return;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (decoded.exp * 1000 < Date.now()) {
      logout();
      setIsLoading(false);
      return;
    }

    setUser({
      userId: decoded.id,
      organizationId: decoded.organizacaoId
    });

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } catch {
    logout();
  } finally {
    setIsLoading(false);
  }
}, [logout]);


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
