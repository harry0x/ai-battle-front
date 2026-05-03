import { useRef, useEffect, useState } from "react";
import { useMessages, useSendMessage } from "../../hooks/useMessages.js";
import MessageBubble from "./MessageBubble.jsx";
import ChatInput from "./ChatInput.jsx";

/**
 * Main chat window component.
 * Displays messages and input for a specific chat.
 */
export default function ChatWindow({ chatId }) {
  const isGuest = chatId === "guest";
  
  // Only fetch messages if not a guest
  const { data: messageData, isLoading, error } = useMessages(isGuest ? null : chatId);
  const sendMessage = useSendMessage(chatId);
  const scrollRef = useRef(null);

  const [guestMessages, setGuestMessages] = useState([]);
  const messages = isGuest ? guestMessages : (messageData?.messages || []);

  const [tempUserMessage, setTempUserMessage] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState(null);

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
      
      setTempUserMessage(newUserMsg);
      setStreamingMessage({
        role: "assistant",
        _id: `temp-assistant-${Date.now()}`,
        content: JSON.stringify({ mistral: "", cohere: "", judge: null }),
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
          setStreamingMessage((prev) => {
            if (!prev) return prev;
            const data = JSON.parse(prev.content || '{"mistral":"","cohere":"","judge":null}');
            if (event.type === "mistral_chunk") data.mistral += event.chunk;
            if (event.type === "cohere_chunk") data.cohere += event.chunk;
            return { ...prev, content: JSON.stringify(data) };
          });
        } else if (event.type === "judge_result") {
          setStreamingMessage((prev) => {
            if (!prev) return prev;
            const data = JSON.parse(prev.content);
            data.judge = event.data;
            data.judge.winner =
              (data.judge.solution_1_score || 0) >
              (data.judge.solution_2_score || 0)
                ? "Mistral"
                : (data.judge.solution_2_score || 0) >
                    (data.judge.solution_1_score || 0)
                  ? "Cohere"
                  : "Tie";
            data.judge.mistralScore = data.judge.solution_1_score;
            data.judge.cohereScore = data.judge.solution_2_score;
            data.judge.mistralReasoning = data.judge.solution_1_reasoning;
            data.judge.cohereReasoning = data.judge.solution_2_reasoning;
            return { ...prev, content: JSON.stringify(data) };
          });
        } else if (event.type === "done") {
          setStreamingMessage((prev) => {
            if (isGuest && prev) {
              setGuestMessages(msgs => [...msgs, prev]);
            }
            return null;
          });
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
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            >
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
      {/* Guest Header */}
      {isGuest && (
        <div className="absolute top-4 right-6 z-10 flex items-center gap-3 animate-fade-up">
          <button 
            onClick={() => window.location.href = '/login'} 
            className="px-4 py-2 rounded-full text-sm font-medium hover:bg-surface-sunken transition-colors text-text-primary"
          >
            Log in
          </button>
          <button 
            onClick={() => window.location.href = '/register'} 
            className="px-4 py-2 rounded-full bg-text-primary text-surface text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign up
          </button>
        </div>
      )}

      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8 text-center animate-fade-up">
            What's on your mind today?
          </h1>
          <div className="w-full max-w-3xl animate-fade-up">
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
