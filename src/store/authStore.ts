import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
};

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
      setTokens: (access, refresh) =>
        set({ token: access, refreshToken: refresh }),
      clearTokens: () => set({ token: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
