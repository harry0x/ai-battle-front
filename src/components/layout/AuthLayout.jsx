import { Outlet, Navigate } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../../store/authStore.js";
import { useAuth } from "../../hooks/useAuth.js";

/**
 * Layout wrapper for authentication pages (login, register).
 * Redirects to home if user is already authenticated.
 */
export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { checkAuth } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface noise-bg">
        <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface noise-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center shadow-lg shadow-accent/20 animate-pulse-glow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 8V16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">
            AI Battle
          </span>
        </div>

        {/* Auth form content */}
        <div className="bg-surface-raised rounded-2xl border border-border p-8">
          <Outlet />
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          Built with ❤️ for AI enthusiasts
        </p>
      </div>
    </div>
  );
}
