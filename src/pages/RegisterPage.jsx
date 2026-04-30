import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

/**
 * Registration page with name, email, password, and confirm password.
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      return "All fields are required";
    }
    if (name.length < 2) {
      return "Name must be at least 2 characters";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-text-primary mb-1">Create account</h1>
      <p className="text-sm text-text-secondary mb-6">Start your AI journey</p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="register-name" className="block text-xs font-medium text-text-secondary mb-1.5">
            Name
          </label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="register-email" className="block text-xs font-medium text-text-secondary mb-1.5">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="register-password" className="block text-xs font-medium text-text-secondary mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 chars, 1 number, 1 special"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          {/* Password strength indicators */}
          {password && (
            <div className="flex gap-2 mt-2">
              <span className={`text-[10px] ${password.length >= 8 ? "text-green" : "text-text-muted"}`}>
                ✓ 8+ chars
              </span>
              <span className={`text-[10px] ${/\d/.test(password) ? "text-green" : "text-text-muted"}`}>
                ✓ Number
              </span>
              <span className={`text-[10px] ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green" : "text-text-muted"}`}>
                ✓ Special
              </span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="register-confirm" className="block text-xs font-medium text-text-secondary mb-1.5">
            Confirm Password
          </label>
          <input
            id="register-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all"
            autoComplete="new-password"
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-[10px] text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors cursor-pointer"
          id="register-submit"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-accent font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
