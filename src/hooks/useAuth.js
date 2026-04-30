import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";
import { loginApi, registerApi, logoutApi, getMeApi, refreshTokenApi } from "../api/authApi.js";
import { setAccessToken } from "../lib/axios.js";

/**
 * Custom hook for authentication actions.
 * Manages login, register, logout, and initial auth check.
 */
export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, setAuth, clearAuth, setUser, setLoading, setToken } =
    useAuthStore();

  /**
   * Attempt to hydrate auth state on initial load.
   * Tries refresh token → getMe to restore session.
   */
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      // Try to refresh the access token from httpOnly cookie
      const refreshData = await refreshTokenApi();
      setToken(refreshData.accessToken);
      setAccessToken(refreshData.accessToken);

      // Fetch user profile
      const { user: userData } = await getMeApi();
      setUser(userData);
    } catch {
      clearAuth();
    }
  }, [setLoading, setToken, setUser, clearAuth]);

  /**
   * Login a user.
   */
  const login = useCallback(
    async (email, password) => {
      const { user: userData, accessToken } = await loginApi(email, password);
      setAuth(userData, accessToken);
      navigate("/");
    },
    [setAuth, navigate]
  );

  /**
   * Register a new user.
   */
  const register = useCallback(
    async (name, email, password) => {
      const { user: userData, accessToken } = await registerApi(name, email, password);
      setAuth(userData, accessToken);
      navigate("/");
    },
    [setAuth, navigate]
  );

  /**
   * Logout the current user.
   */
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Logout even if API call fails
    }
    clearAuth();
    navigate("/login");
  }, [clearAuth, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };
}
