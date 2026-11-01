"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { GamerProfile } from "../types";

interface GamerAuthContextType {
  currentGamer: GamerProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (username: string, password?: string) => Promise<boolean>;
  register: (data: {
    username: string;
    password?: string;
    displayName?: string;
    steamId?: string;
    psnId?: string;
  }) => Promise<boolean>;
  loginDemo: (username?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authError: string | null;
  clearError: () => void;
}

const GamerAuthContext = createContext<GamerAuthContextType | undefined>(undefined);

export const GamerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentGamer, setCurrentGamer] = useState<GamerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/forum/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.success && data.gamer) {
          setCurrentGamer(data.gamer);
        } else {
          setCurrentGamer(null);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (active) {
          setCurrentGamer(null);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const openAuthModal = () => {
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthError(null);
    setIsAuthModalOpen(false);
  };

  const clearError = () => setAuthError(null);

  const login = async (username: string, password?: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await fetch("/api/forum/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success && data.gamer) {
        setCurrentGamer(data.gamer);
        setIsAuthModalOpen(false);
        return true;
      }
      setAuthError(data.message || "Failed to sign in");
      return false;
    } catch {
      setAuthError("Network error. Please try again.");
      return false;
    }
  };

  const register = async (data: {
    username: string;
    password?: string;
    displayName?: string;
    steamId?: string;
    psnId?: string;
  }): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await fetch("/api/forum/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.success && resData.gamer) {
        setCurrentGamer(resData.gamer);
        setIsAuthModalOpen(false);
        return true;
      }
      setAuthError(resData.message || "Failed to register profile");
      return false;
    } catch {
      setAuthError("Network error. Please try again.");
      return false;
    }
  };

  const loginDemo = async (username?: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await fetch("/api/forum/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.success && data.gamer) {
        setCurrentGamer(data.gamer);
        setIsAuthModalOpen(false);
        return true;
      }
      setAuthError(data.message || "Demo login failed");
      return false;
    } catch {
      setAuthError("Network error. Please try again.");
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/forum/auth/logout", { method: "POST" });
    } finally {
      setCurrentGamer(null);
    }
  };

  return (
    <GamerAuthContext.Provider
      value={{
        currentGamer,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginDemo,
        logout,
        authError,
        clearError,
      }}
    >
      {children}
    </GamerAuthContext.Provider>
  );
};

export function useGamerAuth() {
  const context = useContext(GamerAuthContext);
  if (!context) {
    throw new Error("useGamerAuth must be used within a GamerAuthProvider");
  }
  return context;
}

