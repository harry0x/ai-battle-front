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
        <div className="flex items-baseline justify-center mb-10 select-none">
          <span className="text-5xl font-medium tracking-wider text-text-secondary font-mono lowercase">
            versus
          </span>
          <span className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-accent to-orange-400 ml-1">
            AI
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
