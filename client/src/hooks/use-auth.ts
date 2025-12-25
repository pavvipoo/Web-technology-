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

  const loginAsNewUser = (email: string, name: string) => {
    localStorage.setItem("auth", "true");
    localStorage.setItem("userType", "new");
    localStorage.setItem("username", name);
    localStorage.setItem("email", email);
    localStorage.setItem("joinDate", new Date().toISOString());
    setIsAuthenticated(true);
    setLocation("/dashboard");
  };

  const loginAsExistingUser = (email: string) => {
    const username = email.split("@")[0];
    localStorage.setItem("auth", "true");
    localStorage.setItem("userType", "existing");
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    if (!localStorage.getItem("joinDate")) {
      localStorage.setItem("joinDate", new Date().toISOString());
    }
    setIsAuthenticated(true);
    setLocation("/dashboard");
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
