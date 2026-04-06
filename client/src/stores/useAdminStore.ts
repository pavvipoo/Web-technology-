import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "../../../shared/schema";

interface AdminState {
  admin: User | null;
  isAuthenticated: boolean;
  setAdmin: (admin: User | null) => void;
  logout: () => Promise<void>;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      setAdmin: (admin) => set({ admin, isAuthenticated: !!admin }),
      logout: async () => {
        try {
          await fetch("/api/admin/logout", { method: "POST" });
          set({ admin: null, isAuthenticated: false });
        } catch (err) {
          console.error("Logout failed:", err);
          set({ admin: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "admin-storage",
    }
  )
);
