import { useParams, useNavigate } from "react-router-dom";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import { useCreateChat } from "../hooks/useChats.js";
import { useAuth } from "../hooks/useAuth.js";

/**
 * Main chat page.
 * If chatId param exists, shows that chat.
 * If no chatId and user is logged out, shows a guest chat window.
 * Otherwise shows an empty state with new chat prompt.
 */
export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const createChat = useCreateChat();
  const { user } = useAuth();

  const handleNewChat = async () => {
    try {
      const { chat } = await createChat.mutateAsync();
      navigate(`/chat/${chat._id}`);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  if (!chatId) {
    if (!user) {
      // Guest mode — clean chat experience
      return <ChatWindow chatId="guest" />;
    }

    // Logged in user — empty state
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 8V16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">
            Start a <span className="text-gradient">Battle</span>
          </h1>
          <p className="text-sm text-text-muted mb-8 max-w-sm leading-relaxed">
            Create a new chat and let AI agents compete for the best answer.
          </p>
          <button
            onClick={handleNewChat}
            disabled={createChat.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-accent/20"
            id="new-chat-hero-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
