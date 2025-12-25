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

  const login = () => {
    localStorage.setItem("auth", "true");
    setIsAuthenticated(true);
    setLocation("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
    setLocation("/");
  };

  return { isAuthenticated, isLoading, login, logout };
}
