// context/UserContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import apiBissaKerja from "@/lib/api-bissa-kerja";

type User = {
  name: string;
  email: string;
  avatar?: string;
  role: string;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<boolean>;
  // Utility functions for role-based access
  getRole: () => string | null;
  isRole: (role: string) => boolean;
  hasRole: (roles: string[]) => boolean;
  isUser: () => boolean;
  isCompany: () => boolean;
  canAccess: (allowedRoles: string[]) => boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiBissaKerja.get("/user");

      const mergedUser = {
        ...response.data.user,
        role: response.data.role,
      };
      setUser(mergedUser);
    } catch (error) {
      setUser(null);
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = Cookies.get("token");

      // Jika tidak ada token, langsung lakukan logout lokal
      if (!token) {
        setUser(null);
        Cookies.remove("token");
        Cookies.remove("isLogin");
        Cookies.remove("role");
        Cookies.remove("userProfile");
        return true;
      }

      // Kirim request logout ke backend
      await apiBissaKerja.post("/logout");
    } catch (error: any) {
      console.log(
        "Gagal logout dari server:",
        error?.response?.data || error.message
      );
    } finally {
      // Apapun hasilnya, hapus token & reset state lokal
      setUser(null);
      Cookies.remove("token");
      Cookies.remove("isLogin");
      Cookies.remove("role");
      Cookies.remove("userProfile");
      return true;
    }
  };

  // Utility functions untuk role-based authorization
  const getRole = (): string | null => {
    return user?.role || null;
  };

  const isRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasRole = (roles: string[]): boolean => {
    return user?.role ? roles.includes(user.role) : false;
  };

  const isUser = (): boolean => {
    return user?.role === "user";
  };

  const isCompany = (): boolean => {
    return user?.role === "company" || user?.role === "perusahaan";
  };

  const canAccess = (allowedRoles: string[]): boolean => {
    return user?.role ? allowedRoles.includes(user.role) : false;
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setUser,
        refreshUser,
        logout,
        getRole,
        isRole,
        hasRole,
        isUser,
        isCompany,
        canAccess,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// HOC untuk proteksi komponen berdasarkan role
export const withRoleProtection = (
  Component: React.ComponentType<any>,
  allowedRoles: string[]
) => {
  return function ProtectedComponent(props: any) {
    const { canAccess, loading } = useUser();

    if (loading) {
      return <div>Loading...</div>; // Atau komponen loading Anda
    }

    if (!canAccess(allowedRoles)) {
      return <div>Access Denied</div>; // Atau komponen access denied Anda
    }

    return <Component {...props} />;
  };
};

// Hook khusus untuk conditional rendering
export const useRoleBasedRender = () => {
  const { isUser, isCompany, canAccess, hasRole } = useUser();

  const renderForUser = (component: React.ReactNode) => {
    return isUser() ? component : null;
  };

  const renderForCompany = (component: React.ReactNode) => {
    return isCompany() ? component : null;
  };

  const renderForRoles = (component: React.ReactNode, roles: string[]) => {
    return canAccess(roles) ? component : null;
  };

  return {
    renderForUser,
    renderForCompany,
    renderForRoles,
  };
};
