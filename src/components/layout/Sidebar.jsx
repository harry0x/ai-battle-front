import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useChats, useCreateChat, useDeleteChat } from "../../hooks/useChats.js";
import { useAuth } from "../../hooks/useAuth.js";
import { formatDate } from "../../utils/formatDate.js";

/**
 * Sidebar component with recent chats, new chat button, and user actions.
 */
export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { data: chatData, isLoading } = useChats();
  const createChat = useCreateChat();
  const deleteChat = useDeleteChat();
  const [search, setSearch] = useState("");

  const chats = chatData?.chats || [];
  const filteredChats = search
    ? chats.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    : chats;

  const handleNewChat = async () => {
    try {
      const { chat } = await createChat.mutateAsync();
      navigate(`/chat/${chat._id}`);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (confirm("Delete this chat?")) {
      await deleteChat.mutateAsync(chatId);
      if (location.pathname.includes(chatId)) {
        navigate("/");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <aside className="w-72 h-full flex flex-col bg-surface-raised border-r border-border flex-shrink-0">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-indigo-400 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L2 4.5V9.5L7 13L12 9.5V4.5L7 1Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
              <path d="M7 5V9" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M5 7H9" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-text-primary tracking-tight">
            {import.meta.env.VITE_APP_NAME || "AI Battle"}
          </span>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-surface-sunken transition-colors text-text-muted"
          aria-label="Close sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={handleNewChat}
          disabled={createChat.isPending}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 cursor-pointer"
          id="new-chat-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {createChat.isPending ? "Creating..." : "New Chat"}
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-surface-sunken border border-transparent focus:border-accent/30 focus:outline-none text-text-primary placeholder:text-text-muted transition-colors"
            id="search-chats"
          />
        </div>
      </div>

      {/* Chat List */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-text-muted">
              {search ? "No chats found" : "No chats yet"}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isActive = location.pathname === `/chat/${chat._id}`;
            return (
              <button
                key={chat._id}
                onClick={() => navigate(`/chat/${chat._id}`)}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:bg-surface-sunken"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isActive ? "text-accent" : "text-text-primary"}`}>
                    {chat.title}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {formatDate(chat.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(e, chat._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 hover:text-red-500 transition-all text-text-muted cursor-pointer"
                  aria-label="Delete chat"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  </svg>
                </button>
              </button>
            );
          })
        )}
      </nav>

      {/* Navigation */}
      <div className="px-2 py-2 border-t border-border">
        <button
          onClick={() => navigate("/history")}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
            location.pathname === "/history"
              ? "bg-accent/10 text-accent"
              : "text-text-secondary hover:bg-surface-sunken"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          History
        </button>
      </div>

      {/* User section */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-indigo-400 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">{user?.name || "User"}</p>
              <p className="text-[10px] text-text-muted truncate">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 transition-colors text-text-muted cursor-pointer"
            aria-label="Logout"
            id="logout-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
