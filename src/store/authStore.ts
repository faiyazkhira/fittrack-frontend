import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  onboarded: boolean;
};

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
  setUser: (user: User | null) => void;
}

// export const useAuthStore = create<AuthState>((set) => ({
//   token: localStorage.getItem("token"),
//   refreshToken: localStorage.getItem("refreshToken"),

//   setTokens: (access, refresh) => {
//     localStorage.setItem("token", access);
//     localStorage.setItem("refreshToken", refresh);
//     set({ token: access, refreshToken: refresh });
//   },
//   clearTokens: () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("refreshToken");
//     set({ token: null, refreshToken: null });
//   },
// }));

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      setTokens: (access: string, refresh: string) =>
        set({ token: access, refreshToken: refresh }),
      clearTokens: () => set({ token: null, refreshToken: null, user: null }),
      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: "auth-storage",
    }
  )
);
