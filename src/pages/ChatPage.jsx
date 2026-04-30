import { useParams, useNavigate } from "react-router-dom";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import { useCreateChat } from "../hooks/useChats.js";

/**
 * Main chat page.
 * If chatId param exists, shows that chat.
 * Otherwise shows an empty state with new chat prompt.
 */
export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const createChat = useCreateChat();

  const handleNewChat = async () => {
    try {
      const { chat } = await createChat.mutateAsync();
      navigate(`/chat/${chat._id}`);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  if (!chatId) {
    // Empty state — no chat selected
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 8V16" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 12H16" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2 tracking-tight">
            {import.meta.env.VITE_APP_NAME || "AI Battle"}
          </h1>
          <p className="text-sm text-text-secondary mb-8 max-w-sm leading-relaxed">
            Start a new conversation or select an existing chat from the sidebar.
          </p>
          <button
            onClick={handleNewChat}
            disabled={createChat.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors cursor-pointer"
            id="new-chat-hero-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {createChat.isPending ? "Creating..." : "New Chat"}
          </button>
        </div>
      </div>
    );
  }

  return <ChatWindow chatId={chatId} />;
}
