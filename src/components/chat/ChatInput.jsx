import { useState, useRef, useEffect } from "react";

/**
 * Chat input component with auto-resize textarea and submit.
 */
export default function ChatInput({ onSubmit, disabled = false }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + "px";
    }
  }, [value]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-shrink-0 glass border-t border-border">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-end gap-3 bg-surface-raised rounded-2xl border border-border focus-within:border-accent/40 focus-within:shadow-[0_0_0_3px_var(--color-accent-glow)] transition-all px-4 py-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none py-1.5 max-h-40 leading-relaxed"
            id="chat-input"
          />
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center hover:brightness-110 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm shadow-accent/20"
            id="send-btn"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
