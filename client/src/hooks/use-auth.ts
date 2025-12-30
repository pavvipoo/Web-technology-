import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    setIsAuthenticated(auth === "true");
    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
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
        const passwordHash = btoa(`${email}:${password}`);
        
        localStorage.setItem("auth", "true");
        localStorage.setItem("userId", userId);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("passwordHash", passwordHash);
        localStorage.setItem("joinDate", new Date().toISOString());
        localStorage.setItem("bookmarks", JSON.stringify([]));
        localStorage.setItem("searchHistory", JSON.stringify([]));

        setIsAuthenticated(true);
        setUsername(username);
        setEmail(email);
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
        const storedPasswordHash = localStorage.getItem("passwordHash");

        if (!storedEmail || !storedPasswordHash) {
          return { success: false, error: "Invalid email or password" };
        }

        const incomingHash = btoa(`${email}:${password}`);

        if (storedEmail === email && storedPasswordHash === incomingHash) {
          localStorage.setItem("auth", "true");
          setIsAuthenticated(true);
          setEmail(email);
          setUsername(localStorage.getItem("username") || "");
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
    setUsername("");
    setEmail("");
    setLocation("/");
  }, [setLocation]);

  return {
    isAuthenticated,
    isLoading,
    username,
    email,
    loginAsNewUser,
    loginAsExistingUser,
    loginWithGithub,
    logout,
    signUp,
    login,
  };
}
