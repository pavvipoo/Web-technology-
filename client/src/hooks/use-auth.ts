import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/firebase";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setUsername((session.user.user_metadata as any)?.username || "");
        setEmail(session.user.email || "");
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setUsername((session.user.user_metadata as any)?.username || "");
        setEmail(session.user.email || "");
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        if (!email || !password || !username) {
          return { success: false, error: "All fields required" };
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });

        if (error) return { success: false, error: error.message };

        // If signUp returned a session, user is already signed in.
        if (data.session) {
          setIsAuthenticated(true);
          if (data.user) {
            setUsername((data.user.user_metadata as any)?.username || username);
            setEmail(data.user.email || email);
          }
          setLocation("/dashboard");
          return { success: true };
        }

        // Otherwise, attempt to sign in immediately (if email confirmation isn't required).
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!signInError && signInData.session) {
          setIsAuthenticated(true);
          if (signInData.user) {
            setUsername((signInData.user.user_metadata as any)?.username || username);
            setEmail(signInData.user.email || email);
          }
          setLocation("/dashboard");
          return { success: true };
        }

        // If we reach here there is no session (email confirmation may be required).
        return { success: true, message: "Please check your email to confirm your account." };
      } catch (err) {
        return { success: false, error: "Sign up failed" };
      }
    },
    [setLocation]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        if (!email || !password) {
          return { success: false, error: "Email and password are required" };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) return { success: false, error: error.message };

        setIsAuthenticated(!!data.session);
        if (data.user) {
          setUsername((data.user.user_metadata as any)?.username || "");
          setEmail(data.user.email || email);
        }
        setLocation("/dashboard");
        return { success: true };
      } catch (err) {
        console.error("Login error:", err);
        return { success: false, error: "Login failed. Please try again." };
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
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "github" });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: "OAuth login failed" };
    }
  };

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
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
