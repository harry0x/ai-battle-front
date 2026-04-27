import { useState, useRef, useEffect } from 'react';
import './App.css';
import ChatInput from './components/ChatInput';
import MessageGroup from './components/MessageGroup';

// Sample data — replace with API calls
const sampleData = {
  problem: "Write a code for Factorial function in js",
  solution_1: "### Iterative Approach\n\n```javascript\nfunction factorial(n) {\n  if (n < 0) return NaN;\n  if (n === 0 || n === 1) return 1;\n\n  let result = 1;\n  for (let i = 2; i <= n; i++) {\n    result *= i;\n  }\n  return result;\n}\n\nconsole.log(factorial(5)); // 120\n```\n\n**Key points:**\n- O(n) time complexity, O(1) space\n- Handles edge cases (negative, zero)\n- Uses a simple loop — easy to understand",
  solution_2: "### Recursive Approach\n\n```javascript\nfunction factorial(n) {\n  if (n < 0) return undefined;\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nconsole.log(factorial(5)); // 120\n```\n\n**Key points:**\n- Elegant and concise\n- Mirrors the mathematical definition\n- Risk of stack overflow for very large `n`",
  judge: {
    solution_1_score: 9,
    solution_2_score: 8,
    solution_1_reasoning: "The **iterative approach** is highly recommended for JavaScript. It avoids call stack limitations, handles negative inputs by returning `NaN` (mathematically correct), and is generally more memory efficient for large values.",
    solution_2_reasoning: "The **recursive approach** is elegant and mirrors the mathematical definition closely. However, it risks stack overflow for large inputs and returns `undefined` instead of `NaN` for negative numbers, which is less semantically correct."
  }
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading]);

  const handleSubmit = (question) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { ...sampleData, problem: question },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-8 py-4 bg-surface-raised/80 backdrop-blur-lg sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-[#818cf8] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L2 4.5V9.5L7 13L12 9.5V4.5L7 1Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
              <path d="M7 5V9" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M5 7H9" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-text-primary tracking-tight">AI Judge</span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
            id="clear-chat"
          >
            Clear chat
          </button>
        )}
      </header>

      {/* Messages area */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto pb-36">
        <div className="max-w-[860px] mx-auto px-6 py-8">
          {/* Empty state */}
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-up">
              <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M12 8V16" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 12H16" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-text-primary mb-2 tracking-tight">
                Compare AI Solutions
              </h1>
              <p className="text-sm text-text-secondary mb-10 text-center max-w-sm leading-relaxed">
                Ask a coding question and get two independent solutions with an expert judge analysis.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'Write a factorial function in JS',
                  'Implement binary search in Python',
                  'Create a debounce utility',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSubmit(q)}
                    className="text-xs text-text-secondary bg-surface-sunken hover:bg-border-light px-4 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message groups */}
          <div className="space-y-16">
            {messages.map((msg, i) => (
              <MessageGroup key={i} data={msg} index={i} />
            ))}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start mt-12 animate-fade-up">
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                Analyzing solutions...
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input bar */}
      <ChatInput onSubmit={handleSubmit} disabled={loading} />
    </div>
  );
}
