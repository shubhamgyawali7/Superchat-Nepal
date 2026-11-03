"use client";
import { useState, useEffect, useCallback } from "react";

const jsonRequest = (path, options = {}) =>
  fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        setUser(null);
        setProfile(null);
        return null;
      }

      const data = await res.json();
      setUser(data.user ?? null);
      setProfile(data.profile ?? null);
      return data.user ?? null;
    } catch (err) {
      console.error("Session fetch error:", err);
      setUser(null);
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Register
  const register = async (email, password, username) => {
    setError(null);
    setLoading(true);
    try {
      const res = await jsonRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setUser(data.user ?? null);
      setProfile(data.profile ?? null);
      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await jsonRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      setUser(data.user ?? null);
      setProfile(data.profile ?? null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setError(null);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  // Update Profile
  const updateProfile = async (updates) => {
    setError(null);
    try {
      const res = await jsonRequest("/api/streamer/profile", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setProfile(data.profile);
      return { success: true, profile: data.profile };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    refresh,
  };
}

export default useAuth;
