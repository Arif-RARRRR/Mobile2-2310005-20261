import { UserData } from "@/services/authService";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface AuthContextValue {
  user: UserData | null;
  token: string | null;
  setSession: (user: UserData, token: string) => void;
  updateUser: (user: UserData) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const setSession = (userData: UserData, authToken: string) => {
    setUser(userData);
    setToken(authToken);
  };

  // Perbarui data user (nama, email, foto) tanpa menyentuh token
  const updateUser = useCallback((userData: UserData) => {
    setUser(userData);
  }, []);

  const clearSession = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setSession, updateUser, clearSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus dipanggil di dalam AuthProvider.");
  }
  return ctx;
}