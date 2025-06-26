import { create } from "zustand";
type AuthState = {
  token: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),

  setTokens: (access, refresh) => {
    localStorage.setItem("token", access);
    localStorage.setItem("refreshToken", refresh);
    set({ token: access, refreshToken: refresh });
  },
  clearTokens: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    set({ token: null, refreshToken: null });
  },
}));
