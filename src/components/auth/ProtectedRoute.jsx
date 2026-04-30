import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore.js";
import { useAuth } from "../../hooks/useAuth.js";

/**
 * Protected route wrapper.
 * Verifies authentication on mount, redirects to /login if not authenticated.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { checkAuth } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
