import { createContext, useContext } from "react";
import type { User, UserRole } from "@/types";

export const DEMO_ACCOUNTS: Record<string, { password: string; user: User }> = {
  "customer@test.com": {
    password: "123456",
    user: {
      id: "cust-001",
      name: "Alex Johnson",
      email: "customer@test.com",
      role: "customer",
      phone: "+1 555-0101",
      address: "123 Main St, Springfield",
      joinedAt: "2024-01-15",
    },
  },
  "farmer@test.com": {
    password: "123456",
    user: {
      id: "farm-001",
      name: "Robert Green",
      email: "farmer@test.com",
      role: "farmer",
      phone: "+1 555-0202",
      address: "Sunny Acres Farm, Rural Route 5",
      joinedAt: "2023-08-20",
    },
  },
  "admin@test.com": {
    password: "123456",
    user: {
      id: "admin-001",
      name: "Sarah Admin",
      email: "admin@test.com",
      role: "admin",
      phone: "+1 555-0303",
      address: "HQ, 456 Business Ave",
      joinedAt: "2023-01-01",
    },
  },
  "delivery@test.com": {
    password: "123456",
    user: {
      id: "del-001",
      name: "Mike Rider",
      email: "delivery@test.com",
      role: "delivery",
      phone: "+1 555-0404",
      address: "45 Fast Lane, City",
      joinedAt: "2024-03-10",
    },
  },
};

export const ROLE_DASHBOARD: Record<UserRole, string> = {
  customer: "/dashboard/customer",
  farmer: "/dashboard/farmer",
  admin: "/dashboard/admin",
  delivery: "/dashboard/delivery",
};

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => ({ success: false, message: "" }),
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem("ftf_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const storeUser = (user: User) => {
  localStorage.setItem("ftf_user", JSON.stringify(user));
};

export const clearUser = () => {
  localStorage.removeItem("ftf_user");
};
