import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    setIsAuthenticated(auth === "true");
    setIsLoading(false);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        if (!email || !password || !username) {
          return { success: false, error: "All fields required" };
        }

        if (password.length < 6) {
          return { success: false, error: "Password must be at least 6 characters" };
        }

        const userId = `user_${Date.now()}`;
        localStorage.setItem("auth", "true");
        localStorage.setItem("userId", userId);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("password_hash", btoa(password));
        localStorage.setItem("joinDate", new Date().toISOString());

        setIsAuthenticated(true);
        setLocation("/dashboard");
        return { success: true };
      } catch (error) {
        return { success: false, error: "Sign up failed" };
      }
    },
    [setLocation]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const storedEmail = localStorage.getItem("email");
        const storedPasswordHash = localStorage.getItem("password_hash");

        if (!storedEmail || !storedPasswordHash) {
          return { success: false, error: "Invalid email or password" };
        }

        if (storedEmail === email && storedPasswordHash === btoa(password)) {
          localStorage.setItem("auth", "true");
          setIsAuthenticated(true);
          setLocation("/dashboard");
          return { success: true };
        }

        return { success: false, error: "Invalid email or password" };
      } catch (error) {
        return { success: false, error: "Login failed" };
      }
    },
    [setLocation]
  );

  const loginAsNewUser = (email: string, username: string, password: string) => {
    return signUp(email, password, username);
  };

  const loginAsExistingUser = (email: string, password: string) => {
    return login(email, password);
  };

  const loginWithGithub = async () => {
    return { success: false, error: "GitHub login coming soon" };
  };

  const logout = useCallback(() => {
    localStorage.clear();
    setIsAuthenticated(false);
    setLocation("/");
  }, [setLocation]);

  return {
    isAuthenticated,
    isLoading,
    loginAsNewUser,
    loginAsExistingUser,
    loginWithGithub,
    logout,
    signUp,
    login,
  };
}
