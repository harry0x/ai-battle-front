import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../../hooks/useAuth.js";

/**
 * Main application layout.
 * Shows sidebar only for logged-in users.
 * Guests get a clean, full-screen chat experience.
 */
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  // Guest users: no sidebar, clean full-width layout
  if (!user) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-surface noise-bg">
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <Outlet />
        </main>
      </div>
    );
  }

  // Logged-in users: sidebar + content
  return (
    <div className="h-screen flex overflow-hidden bg-surface noise-bg">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Sidebar toggle when closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 p-2.5 rounded-xl bg-surface-raised border border-border text-text-muted hover:text-text-primary hover:bg-surface-sunken transition-all duration-200"
            aria-label="Open sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        <Outlet />
      </main>
    </div>
  );
}
