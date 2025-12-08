// src/providers/UserProvider.tsx
// Global UserProvider for guest + email sign-in

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface UserState {
  loading: boolean;
  user: {
    userId: string;
    email?: string | null;
    plan: "free" | "pro";
    coins: number;
    totalTokens: number;
  } | null;
}

interface UserContextType extends UserState {
  signInWithEmail: (email: string, password?: string, isGoogleAuth?: boolean) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserState>({
    loading: true,
    user: null,
  });

  const loadUser = useCallback(async () => {
    try {
      // Check localStorage for existing userId
      const storedUserId = typeof window !== "undefined" ? localStorage.getItem("jjj_user_id") : null;
      const storedEmail = typeof window !== "undefined" ? localStorage.getItem("jjj_email") : null;

      let response: Response;
      
      if (storedUserId) {
        // Try to get existing user
        response = await fetch("/api/user/me", {
          headers: {
            "x-user-id": storedUserId,
          },
        });
      } else {
        // Create guest user
        response = await fetch("/api/auth/guest", {
          method: "POST",
        });
      }

      if (!response.ok) {
        throw new Error("Failed to load user");
      }

      const data = await response.json();
      
      if (data.ok && data.user) {
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("jjj_user_id", data.user.userId);
          if (data.user.email) {
            localStorage.setItem("jjj_email", data.user.email);
          } else {
            localStorage.removeItem("jjj_email");
          }
        }

        setState({
          loading: false,
          user: data.user,
        });
      } else {
        throw new Error(data.error || "Failed to load user");
      }
    } catch (error) {
      console.error("Error loading user:", error);
      // Set loading to false even on error
      setState({
        loading: false,
        user: null,
      });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const signInWithEmail = useCallback(async (email: string, password?: string, isGoogleAuth?: boolean) => {
    try {
      const userId = typeof window !== "undefined" ? localStorage.getItem("jjj_user_id") : null;
      
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userId ? { "x-user-id": userId } : {}),
        },
        body: JSON.stringify({ email, password, isGoogleAuth }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to sign in");
      }

      const data = await response.json();
      
      if (data.ok && data.user) {
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("jjj_user_id", data.user.userId);
          if (data.user.email) {
            localStorage.setItem("jjj_email", data.user.email);
          }
        }

        setState({
          loading: false,
          user: data.user,
        });
      } else {
        throw new Error(data.error || "Failed to sign in");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const userId = typeof window !== "undefined" ? localStorage.getItem("jjj_user_id") : null;
      
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userId ? { "x-user-id": userId } : {}),
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create account");
      }

      const data = await response.json();
      
      if (data.ok && data.user) {
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("jjj_user_id", data.user.userId);
          if (data.user.email) {
            localStorage.setItem("jjj_email", data.user.email);
          }
        }

        setState({
          loading: false,
          user: data.user,
        });
      } else {
        throw new Error(data.error || "Failed to create account");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Clear localStorage first
      if (typeof window !== "undefined") {
        localStorage.removeItem("jjj_user_id");
        localStorage.removeItem("jjj_email");
      }

      // Update state immediately
      setState({
        loading: false,
        user: null,
      });

      // Call logout API
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (apiError) {
        console.error("Logout API error:", apiError);
        // Continue with logout even if API fails
      }

      // Force reload to clear all state and cookies
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      // Still clear everything and redirect
      if (typeof window !== "undefined") {
        localStorage.removeItem("jjj_user_id");
        localStorage.removeItem("jjj_email");
      }
      setState({
        loading: false,
        user: null,
      });
      window.location.href = "/";
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      const userId = typeof window !== "undefined" ? localStorage.getItem("jjj_user_id") : null;
      
      // Clear localStorage first
      if (typeof window !== "undefined") {
        localStorage.removeItem("jjj_user_id");
        localStorage.removeItem("jjj_email");
      }

      // Update state immediately
      setState({
        loading: false,
        user: null,
      });

      // Call delete account API
      try {
        const response = await fetch("/api/auth/delete-account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(userId ? { "x-user-id": userId } : {}),
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete account");
        }
      } catch (apiError: any) {
        console.error("Delete account API error:", apiError);
        // Continue with redirect even if API fails (account might already be deleted)
      }

      // Force reload to clear all state and cookies
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      // Still clear everything and redirect
      if (typeof window !== "undefined") {
        localStorage.removeItem("jjj_user_id");
        localStorage.removeItem("jjj_email");
      }
      setState({
        loading: false,
        user: null,
      });
      window.location.href = "/";
      throw error;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  return (
    <UserContext.Provider
      value={{
        ...state,
        signInWithEmail,
        signUpWithEmail,
        logout,
        deleteAccount,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useJjjUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useJjjUser must be used within a UserProvider");
  }
  return context;
}

