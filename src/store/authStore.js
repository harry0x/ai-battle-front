import { create } from "zustand";
import { setAccessToken, clearAccessToken } from "../lib/axios.js";

/**
 * Auth store using Zustand.
 * Access token is kept in memory only (NOT localStorage) for security.
 */
const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // true until initial auth check completes

  /**
   * Set user data and access token after login/register.
   */
  setAuth: (user, accessToken) => {
    setAccessToken(accessToken);
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  /**
   * Update just the user profile data.
   */
  setUser: (user) => {
    set({ user, isAuthenticated: true, isLoading: false });
  },

  /**
   * Update just the access token (after refresh).
   */
  setToken: (accessToken) => {
    setAccessToken(accessToken);
    set({ accessToken });
  },

  /**
   * Clear all auth state on logout.
   */
  clearAuth: () => {
    clearAccessToken();
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  /**
   * Mark loading as complete (after initial auth check).
   */
  setLoading: (isLoading) => {
    set({ isLoading });
  },
}));

export default useAuthStore;
