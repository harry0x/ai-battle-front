import ReactMarkdown from "react-markdown";
import { formatTime } from "../../utils/formatDate.js";
import useAuthStore from "../../store/authStore.js";

/**
 * Single message bubble component.
 * Renders user messages right-aligned and assistant messages left-aligned.
 */
export default function MessageBubble({ message }) {
  const { user } = useAuthStore();
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-up`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-accent text-white rounded-br-md"
            : "bg-surface-sunken text-text-primary rounded-bl-md"
        }`}
      >
        {/* Sender label */}
        <div className={`flex items-center gap-2 mb-1 ${isUser ? "justify-end" : ""}`}>
          <span className={`text-[10px] font-medium ${isUser ? "text-white/70" : "text-text-muted"}`}>
            {isUser ? (user?.name || "You") : "AI Assistant"}
          </span>
        </div>

        {/* Content */}
        <div className={`prose text-sm leading-relaxed ${isUser ? "prose-invert" : ""}`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {/* Timestamp */}
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mt-1.5`}>
          <span className={`text-[10px] ${isUser ? "text-white/50" : "text-text-muted"}`}>
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
