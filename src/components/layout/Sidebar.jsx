import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useChats,
  useCreateChat,
  useDeleteChat,
} from "../../hooks/useChats.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../hooks/useTheme.js";
import { formatDate } from "../../utils/formatDate.js";

/**
 * Sidebar component for logged-in users.
 * Shows recent chats, new chat button, history, and user profile.
 */
export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { data: chatData, isLoading } = useChats(1, 20, !!user);
  const createChat = useCreateChat();
  const deleteChat = useDeleteChat();
  const [search, setSearch] = useState("");
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

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
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-baseline select-none">
          <span className="text-sm font-medium tracking-wider text-text-secondary font-mono lowercase">
            versus
          </span>
          <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-accent to-orange-400 ml-0.5">
            AI
          </span>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-surface-sunken transition-colors text-text-muted hover:text-text-primary"
          aria-label="Close sidebar"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-2">
        <button
          onClick={handleNewChat}
          disabled={createChat.isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-accent/20"
          id="new-chat-btn"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          {createChat.isPending ? "Creating..." : "New Chat"}
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
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
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/15"
                    : "text-text-secondary hover:bg-surface-sunken border border-transparent"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium truncate ${isActive ? "text-accent" : "text-text-primary"}`}
                  >
                    {chat.title}
                  </p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {formatDate(chat.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(e, chat._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-all text-text-muted cursor-pointer"
                  aria-label="Delete chat"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  </svg>
                </button>
              </button>
            );
          })
        )}
      </nav>

      {/* Navigation - History */}
      <div className="px-2 py-2 border-t border-border">
        <button
          onClick={() => navigate("/history")}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
            location.pathname === "/history"
              ? "bg-accent/10 text-accent"
              : "text-text-secondary hover:bg-surface-sunken"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-text-muted truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={cycleTheme}
              className="p-1.5 rounded-lg hover:bg-surface-sunken transition-colors text-text-muted cursor-pointer"
              title={`Theme: ${theme}`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : theme === "dark" ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              )}
            </button>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors text-text-muted cursor-pointer"
              aria-label="Logout"
              id="logout-btn"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
