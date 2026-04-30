import { Link } from "react-router-dom";

/**
 * 404 Not Found page.
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="text-center animate-fade-up">
        <div className="text-7xl font-bold text-accent/20 mb-4">404</div>
        <h1 className="text-xl font-semibold text-text-primary mb-2">Page not found</h1>
        <p className="text-sm text-text-secondary mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>
      </div>
    </div>
  );
}
