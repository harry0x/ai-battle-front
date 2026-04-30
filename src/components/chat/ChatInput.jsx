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
    <div className="flex-shrink-0 border-t border-border bg-surface-raised/80 backdrop-blur-lg">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-end gap-3 bg-surface-sunken rounded-2xl border border-border focus-within:border-accent/40 transition-colors px-4 py-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none py-1.5 max-h-40 leading-relaxed"
            id="chat-input"
          />
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="flex-shrink-0 w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            id="send-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-text-muted text-center mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
