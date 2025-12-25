import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    setIsAuthenticated(auth === "true");
    setIsLoading(false);
  }, []);

  const loginAsNewUser = (email: string, username: string, password: string) => {
    // Store user credentials in localStorage (simulated)
    const userId = `user_${Date.now()}`;
    localStorage.setItem("auth", "true");
    localStorage.setItem("userId", userId);
    localStorage.setItem("userType", "new");
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    // In a real app, NEVER store passwords in localStorage
    // For this demo only, we're storing it for validation
    localStorage.setItem("password_hash", btoa(password));
    localStorage.setItem("joinDate", new Date().toISOString());
    setIsAuthenticated(true);
    setLocation("/dashboard");
  };

  const loginAsExistingUser = (email: string, password: string) => {
    // Validate stored credentials
    const storedEmail = localStorage.getItem("email");
    const storedPasswordHash = localStorage.getItem("password_hash");
    
    if (storedEmail === email && storedPasswordHash === btoa(password)) {
      localStorage.setItem("auth", "true");
      if (!localStorage.getItem("userType")) {
        localStorage.setItem("userType", "existing");
      }
      setIsAuthenticated(true);
      setLocation("/dashboard");
    } else {
      // Invalid credentials - don't set auth
      console.error("Invalid email or password");
    }
  };

  const loginWithGithub = () => {
    localStorage.setItem("auth", "true");
    localStorage.setItem("userType", "github");
    localStorage.setItem("username", "github_user");
    localStorage.setItem("avatar", "https://avatars.githubusercontent.com/u/1?v=4");
    localStorage.setItem("joinDate", new Date().toISOString());
    setIsAuthenticated(true);
    setLocation("/dashboard");
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setLocation("/");
  };

  return { 
    isAuthenticated, 
    isLoading, 
    loginAsNewUser, 
    loginAsExistingUser, 
    loginWithGithub,
    logout 
  };
}
