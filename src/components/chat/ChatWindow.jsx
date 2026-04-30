import { useRef, useEffect } from "react";
import { useMessages, useSendMessage } from "../../hooks/useMessages.js";
import MessageBubble from "./MessageBubble.jsx";
import ChatInput from "./ChatInput.jsx";

/**
 * Main chat window component.
 * Displays messages and input for a specific chat.
 */
export default function ChatWindow({ chatId }) {
  const { data: messageData, isLoading, error } = useMessages(chatId);
  const sendMessage = useSendMessage(chatId);
  const scrollRef = useRef(null);

  const messages = messageData?.messages || [];

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, sendMessage.isPending]);

  const handleSend = async (content) => {
    try {
      await sendMessage.mutateAsync(content);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <p className="text-sm text-text-secondary">Failed to load messages</p>
          <p className="text-xs text-text-muted mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-1">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                Loading messages...
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-up">
              <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-1">Start a conversation</h2>
              <p className="text-sm text-text-secondary">Type a message below to begin.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg._id} message={msg} />
            ))
          )}

          {/* Sending indicator */}
          {sendMessage.isPending && (
            <div className="flex justify-start py-2 animate-fade-up">
              <div className="flex items-center gap-2 text-sm text-text-muted px-4 py-3 rounded-2xl bg-surface-sunken">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                Thinking...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <ChatInput onSubmit={handleSend} disabled={sendMessage.isPending} />
    </div>
  );
}
