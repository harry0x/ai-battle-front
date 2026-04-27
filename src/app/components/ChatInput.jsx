import { useState, useRef } from 'react';

export default function ChatInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-surface via-surface to-transparent pb-6 pt-8 pointer-events-none z-10">
      <div className="max-w-[860px] mx-auto px-6 pointer-events-auto">
        <div className="flex items-end gap-3 bg-surface-raised rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.06)] border border-border-light px-5 py-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask a coding question..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent text-text-primary text-[0.9375rem] leading-relaxed placeholder:text-text-muted outline-none min-h-[28px] max-h-[160px] py-1"
            id="chat-input"
          />
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-accent to-[#818cf8] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            id="send-button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
