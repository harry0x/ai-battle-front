import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChats, useDeleteChat } from "../hooks/useChats.js";
import { formatDate } from "../utils/formatDate.js";

/**
 * Chat history page with paginated list of all chats.
 */
export default function HistoryPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useChats(page);
  const deleteChat = useDeleteChat();

  const chats = data?.chats || [];
  const hasMore = data?.hasMore || false;
  const total = data?.total || 0;

  const handleDelete = async (e, chatId) => {
    e.stopPropagation();
    if (confirm("Delete this chat permanently?")) {
      await deleteChat.mutateAsync(chatId);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Chat History</h1>
            <p className="text-sm text-text-secondary mt-1">
              {total} conversation{total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="flex items-center gap-3 text-sm text-text-muted">
              <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              Loading chats...
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-sm text-red-500">Failed to load chats</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-16 animate-fade-up">
            <div className="w-14 h-14 rounded-2xl bg-surface-sunken flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <p className="text-sm text-text-secondary">No chats yet</p>
            <p className="text-xs text-text-muted mt-1">Start a new conversation to see it here</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {chats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => navigate(`/chat/${chat._id}`)}
                  className="w-full group flex items-center justify-between p-4 rounded-xl border border-border bg-surface-raised hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                      {chat.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[11px] text-text-muted">
                        Created {formatDate(chat.createdAt)}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        Updated {formatDate(chat.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => handleDelete(e, chat._id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all text-text-muted cursor-pointer"
                      aria-label="Delete chat"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      </svg>
                    </button>
                    <svg className="text-text-muted group-hover:text-accent transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-surface-sunken disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-text-muted">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-surface-sunken disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
