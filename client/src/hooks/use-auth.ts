import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  AuthError,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        const { user: newUser } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(newUser, {
          displayName: username,
        });

        setUser(newUser);
        setIsAuthenticated(true);
        setLocation("/dashboard");
        return { success: true };
      } catch (error) {
        const authError = error as AuthError;
        let message = "An error occurred during sign up";

        if (authError.code === "auth/email-already-in-use") {
          message = "Email already in use";
        } else if (authError.code === "auth/invalid-email") {
          message = "Invalid email address";
        } else if (authError.code === "auth/weak-password") {
          message = "Password is too weak (min 6 characters)";
        } else if (authError.message) {
          message = authError.message;
        }

        return { success: false, error: message };
      }
    },
    [setLocation]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { user: loginUser } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        setUser(loginUser);
        setIsAuthenticated(true);
        setLocation("/dashboard");
        return { success: true };
      } catch (error) {
        const authError = error as AuthError;
        let message = "Invalid email or password";

        if (authError.code === "auth/user-not-found") {
          message = "Invalid email or password";
        } else if (authError.code === "auth/wrong-password") {
          message = "Invalid email or password";
        } else if (authError.code === "auth/invalid-email") {
          message = "Invalid email address";
        } else if (authError.message) {
          message = authError.message;
        }

        return { success: false, error: message };
      }
    },
    [setLocation]
  );

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
      setLocation("/");
    } catch (error) {
      const authError = error as AuthError;
      console.error("Logout error:", authError.message);
    }
  }, [setLocation]);

  const loginAsNewUser = (email: string, username: string, password: string) => {
    return signUp(email, password, username);
  };

  const loginAsExistingUser = (email: string, password: string) => {
    return login(email, password);
  };

  const loginWithGithub = async () => {
    console.log("GitHub login not yet implemented with Firebase");
    return { success: false, error: "GitHub login coming soon" };
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    loginAsNewUser,
    loginAsExistingUser,
    loginWithGithub,
    logout,
    signUp,
    login,
  };
}
