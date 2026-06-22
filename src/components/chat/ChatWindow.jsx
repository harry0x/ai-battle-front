import { useRef, useEffect, useState } from "react";
import { useMessages, useSendMessage } from "../../hooks/useMessages.js";
import { useTheme } from "../../hooks/useTheme.js";
import MessageBubble from "./MessageBubble.jsx";
import ChatInput from "./ChatInput.jsx";

/**
 * Main chat window component.
 * Displays messages and input for a specific chat.
 */
export default function ChatWindow({ chatId }) {
  const isGuest = chatId === "guest";
  const { theme, setTheme } = useTheme();
  
  // Only fetch messages if not a guest
  const { data: messageData, isLoading, error } = useMessages(isGuest ? null : chatId);
  const sendMessage = useSendMessage(chatId);
  const scrollRef = useRef(null);

  const [guestMessages, setGuestMessages] = useState([]);
  const messages = isGuest ? guestMessages : (messageData?.messages || []);

  const [tempUserMessage, setTempUserMessage] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState(null);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, tempUserMessage, streamingMessage]);

  const handleSend = async (content) => {
    try {
      const newUserMsg = {
        role: "user",
        content,
        _id: `temp-user-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      const assistantId = `temp-assistant-${Date.now()}`;
      let currentData = { mistral: "", cohere: "", judge: null };
      
      setTempUserMessage(newUserMsg);
      setStreamingMessage({
        role: "assistant",
        _id: assistantId,
        content: JSON.stringify(currentData),
        createdAt: new Date().toISOString(),
      });

      const onEvent = (event) => {
        if (event.type === "user_message") {
          if (isGuest) {
            setGuestMessages(prev => [...prev, newUserMsg]);
          }
          setTempUserMessage(null);
        } else if (
          event.type === "mistral_chunk" ||
          event.type === "cohere_chunk"
        ) {
          if (event.type === "mistral_chunk") currentData.mistral += event.chunk;
          if (event.type === "cohere_chunk") currentData.cohere += event.chunk;
          
          setStreamingMessage(prev => prev ? { ...prev, content: JSON.stringify(currentData) } : prev);
        } else if (event.type === "judge_result") {
          currentData.judge = event.data;
          currentData.judge.winner =
            (currentData.judge.solution_1_score || 0) >
            (currentData.judge.solution_2_score || 0)
              ? "Agent 1"
              : (currentData.judge.solution_2_score || 0) >
                  (currentData.judge.solution_1_score || 0)
                ? "Agent 2"
                : "Tie";
          currentData.judge.mistralScore = currentData.judge.solution_1_score;
          currentData.judge.cohereScore = currentData.judge.solution_2_score;
          currentData.judge.mistralReasoning = currentData.judge.solution_1_reasoning;
          currentData.judge.cohereReasoning = currentData.judge.solution_2_reasoning;
          
          setStreamingMessage(prev => prev ? { ...prev, content: JSON.stringify(currentData) } : prev);
        } else if (event.type === "done") {
          if (isGuest) {
            const finalMsg = {
              role: "assistant",
              _id: assistantId,
              content: JSON.stringify(currentData),
              createdAt: new Date().toISOString(),
            };
            setGuestMessages(msgs => [...msgs, finalMsg]);
          }
          setStreamingMessage(null);
        } else if (event.type === "error") {
          setStreamingMessage({
            role: "assistant",
            _id: "temp-assistant-error",
            content: JSON.stringify({ error: true, message: event.message }),
            createdAt: new Date().toISOString(),
          });
        }
      };

      if (isGuest) {
        const { streamGuestMessageApi } = await import("../../api/chatApi.js");
        await streamGuestMessageApi(content, onEvent);
      } else {
        await sendMessage.mutateAsync({ content, onEvent });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setTempUserMessage(null);
      setStreamingMessage(null);
    }
  };

  if (error && !isGuest) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-3">
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

  const isEmpty = messages.length === 0 && !tempUserMessage;
  const isGenerating = !!(tempUserMessage || streamingMessage) || (sendMessage && sendMessage.isPending);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-surface">
      {/* Guest Top Bar */}
      {isGuest && (
        <div className="glass border-b border-border px-6 py-3 flex items-center justify-between z-10 animate-fade-up">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L2 4.5V9.5L7 13L12 9.5V4.5L7 1Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M7 5V9" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M5 7H9" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-text-primary tracking-tight">AI Battle</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={cycleTheme}
              className="p-2 rounded-xl hover:bg-surface-sunken transition-colors text-text-muted hover:text-text-primary cursor-pointer"
              title={`Theme: ${theme}`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              ) : theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              )}
            </button>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-surface-sunken transition-colors text-text-secondary"
            >
              Log in
            </button>
            <button 
              onClick={() => window.location.href = '/register'} 
              className="px-4 py-1.5 rounded-xl bg-accent text-white text-sm font-semibold hover:brightness-110 transition-all shadow-sm shadow-accent/20"
            >
              Sign up
            </button>
          </div>
        </div>
      )}

      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {/* Hero section */}
          <div className="text-center mb-10 animate-fade-up">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center mx-auto mb-5 animate-pulse-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M12 8V16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3 tracking-tight">
              Ask <span className="text-gradient">anything</span>
            </h1>
            <p className="text-sm text-text-muted max-w-md leading-relaxed">
              Two AI agents compete to give you the best answer.<br/>A judge agent evaluates and picks the winner.
            </p>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl animate-fade-up" style={{ animationDelay: "100ms" }}>
            {[
              "Explain quantum computing",
              "Write a Python sorting algorithm",
              "Compare React vs Vue",
              "Design a REST API"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary bg-surface-raised border border-border hover:border-accent/30 hover:text-accent transition-all cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="w-full max-w-3xl animate-fade-up" style={{ animationDelay: "200ms" }}>
            <ChatInput onSubmit={handleSend} disabled={isGenerating} />
          </div>
        </div>
      ) : (
        <>
          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 py-6 space-y-1">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                    Loading messages...
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <MessageBubble key={msg._id} message={msg} />
                  ))}
                  {tempUserMessage && (
                    <MessageBubble key="temp-user" message={tempUserMessage} />
                  )}
                  {streamingMessage && (
                    <MessageBubble
                      key="temp-assistant"
                      message={streamingMessage}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Input Area (Bottom) */}
          <div className="max-w-5xl mx-auto w-full">
            <ChatInput onSubmit={handleSend} disabled={isGenerating} />
          </div>
        </>
      )}
    </div>
  );
}
