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
      setTempUserMessage({ role: 'user', content, _id: 'temp-user', createdAt: new Date().toISOString() });
      setStreamingMessage({
        role: 'assistant',
        _id: 'temp-assistant',
        content: JSON.stringify({ mistral: "", cohere: "", judge: null }),
        createdAt: new Date().toISOString()
      });

      await sendMessage.mutateAsync({
        content,
        onEvent: (event) => {
          if (event.type === 'user_message') {
            setTempUserMessage(null);
          } else if (event.type === 'mistral_chunk' || event.type === 'cohere_chunk') {
            setStreamingMessage(prev => {
              const data = prev ? JSON.parse(prev.content) : { mistral: "", cohere: "", judge: null };
              if (event.type === 'mistral_chunk') data.mistral += event.chunk;
              if (event.type === 'cohere_chunk') data.cohere += event.chunk;
              return { ...prev, content: JSON.stringify(data) };
            });
          } else if (event.type === 'judge_result') {
            setStreamingMessage(prev => {
              const data = prev ? JSON.parse(prev.content) : { mistral: "", cohere: "", judge: null };
              data.judge = event.data;
              data.judge.winner = (data.judge.solution_1_score || 0) > (data.judge.solution_2_score || 0) 
                ? "Mistral" 
                : (data.judge.solution_2_score || 0) > (data.judge.solution_1_score || 0)
                ? "Cohere" : "Tie";
              data.judge.mistralScore = data.judge.solution_1_score;
              data.judge.cohereScore = data.judge.solution_2_score;
              data.judge.mistralReasoning = data.judge.solution_1_reasoning;
              data.judge.cohereReasoning = data.judge.solution_2_reasoning;
              return { ...prev, content: JSON.stringify(data) };
            });
          } else if (event.type === 'done') {
            setStreamingMessage(null);
          } else if (event.type === 'error') {
            setStreamingMessage({
               role: 'assistant',
               _id: 'temp-assistant-error',
               content: JSON.stringify({ error: true, message: event.message }),
               createdAt: new Date().toISOString()
            });
          }
        }
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setTempUserMessage(null);
      setStreamingMessage(null);
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
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-1">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                Loading messages...
              </div>
            </div>
          ) : messages.length === 0 && !tempUserMessage ? (
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
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg._id} message={msg} />
              ))}
              {tempUserMessage && <MessageBubble key="temp-user" message={tempUserMessage} />}
              {streamingMessage && <MessageBubble key="temp-assistant" message={streamingMessage} />}
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <ChatInput onSubmit={handleSend} disabled={sendMessage.isPending} />
    </div>
  );
}
