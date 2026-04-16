import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, DEMO_ACCOUNTS, getStoredUser, storeUser, clearUser } from "@/lib/auth";
import type { User } from "@/types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
  }, []);

  const login = (email: string, password: string) => {
    const account = DEMO_ACCOUNTS[email.toLowerCase()];
    if (!account) {
      return { success: false, message: "No account found with this email." };
    }
    if (account.password !== password) {
      return { success: false, message: "Incorrect password." };
    }
    storeUser(account.user);
    setUser(account.user);
    return { success: true, message: "Login successful!" };
  };

  const logout = () => {
    clearUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
