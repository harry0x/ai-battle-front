import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { formatTime } from "../../utils/formatDate.js";
import useAuthStore from "../../store/authStore.js";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-all"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      )}
    </button>
  );
};

export default function MessageBubble({ message }) {
  const { user } = useAuthStore();
  const isUser = message.role === "user";
  const [expandedModel, setExpandedModel] = useState(null);

  let isComparison = false;
  let isError = false;
  let comparisonData = null;

  if (!isUser) {
    try {
      comparisonData = JSON.parse(message.content);
      if (comparisonData.mistral && comparisonData.cohere) {
        isComparison = true;
      }
      if (comparisonData.error) {
        isError = true;
      }
    } catch (e) {
      // It's just a normal string
    }
  }

  if (isComparison) {
    return (
      <div className="flex flex-col w-full animate-fade-up mt-6 mb-8">
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Battle Results</span>
          </div>
        </div>
        
        {/* Parallel Agent View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Agent 1 */}
          <div className="flex flex-col bg-surface-raised rounded-2xl border border-border overflow-hidden hover:border-agent1/30 transition-colors">
            <div className="p-3 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-agent1/15 text-agent1 text-xs font-bold">1</span>
                Agent 1
              </h3>
              <div className="flex items-center gap-1">
                <CopyButton text={comparisonData.mistral} />
                <button
                  onClick={() => setExpandedModel('mistral')}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-sunken transition-all"
                  title="Expand"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 prose prose-sm max-w-none text-text-secondary overflow-y-auto max-h-[600px]">
              {comparisonData.mistral ? (
                <ReactMarkdown>{comparisonData.mistral}</ReactMarkdown>
              ) : (
                <div className="flex items-center gap-2 text-text-muted animate-pulse py-4">
                  <div className="w-3 h-3 border-2 border-agent1 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Agent 1 is thinking...</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Agent 2 */}
          <div className="flex flex-col bg-surface-raised rounded-2xl border border-border overflow-hidden hover:border-agent2/30 transition-colors">
            <div className="p-3 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-agent2/15 text-agent2 text-xs font-bold">2</span>
                Agent 2
              </h3>
              <div className="flex items-center gap-1">
                <CopyButton text={comparisonData.cohere} />
                <button
                  onClick={() => setExpandedModel('cohere')}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-sunken transition-all"
                  title="Expand"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 prose prose-sm max-w-none text-text-secondary overflow-y-auto max-h-[600px]">
              {comparisonData.cohere ? (
                <ReactMarkdown>{comparisonData.cohere}</ReactMarkdown>
              ) : (
                <div className="flex items-center gap-2 text-text-muted animate-pulse py-4">
                  <div className="w-3 h-3 border-2 border-agent2 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Agent 2 is thinking...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Judge Agent Section */}
        {comparisonData.judge ? (
          <div className="bg-surface-raised rounded-2xl border border-accent/20 overflow-hidden">
            {/* Judge Header */}
            <div className="p-4 flex items-center justify-between border-b border-accent/10">
              <h3 className="text-sm font-bold text-accent flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-accent/15 text-accent">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Judge Agent
              </h3>
              <div className="bg-accent text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg shadow-accent/20">
                Winner: {comparisonData.judge.winner}
              </div>
            </div>

            {/* Scores Grid */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-agent1/15 text-agent1 text-[10px] font-bold">1</span>
                  <span className="text-sm font-semibold text-text-primary">
                    Agent 1 
                    <span className="font-normal text-text-secondary ml-1">
                      {comparisonData.judge.mistralScore}/10
                    </span>
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed pl-7">
                  {comparisonData.judge.mistralReasoning}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded flex items-center justify-center bg-agent2/15 text-agent2 text-[10px] font-bold">2</span>
                  <span className="text-sm font-semibold text-text-primary">
                    Agent 2
                    <span className="font-normal text-text-secondary ml-1">
                      {comparisonData.judge.cohereScore}/10
                    </span>
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed pl-7">
                  {comparisonData.judge.cohereReasoning}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-4 flex items-center gap-3 px-1">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm text-text-muted">Judge Agent is evaluating...</span>
          </div>
        )}

        {/* Full Screen Modal */}
        {expandedModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up">
            <div className="bg-surface rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-border">
              <div className="p-4 border-b border-border flex justify-between items-center bg-surface-raised">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  {expandedModel === 'mistral' ? (
                    <><span className="w-7 h-7 rounded-lg flex items-center justify-center bg-agent1/15 text-agent1 text-sm font-bold">1</span> Agent 1</>
                  ) : (
                    <><span className="w-7 h-7 rounded-lg flex items-center justify-center bg-agent2/15 text-agent2 text-sm font-bold">2</span> Agent 2</>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  <CopyButton text={expandedModel === 'mistral' ? comparisonData.mistral : comparisonData.cohere} />
                  <button onClick={() => setExpandedModel(null)} className="p-2 bg-surface-sunken hover:bg-border rounded-xl transition-colors text-text-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto flex-1 prose prose-sm md:prose-base max-w-none text-text-primary">
                <ReactMarkdown>{expandedModel === 'mistral' ? comparisonData.mistral : comparisonData.cohere}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // User message bubble
  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-fade-up">
        <div className="max-w-[75%] rounded-2xl rounded-br-md px-5 py-3 bg-accent text-white shadow-sm shadow-accent/10">
          <div className="prose prose-sm leading-snug [&>p]:m-0 prose-invert">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for system/error messages
  return (
    <div className="flex justify-start mb-4 animate-fade-up">
      <div
        className={`max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2.5 ${
          isError 
            ? "bg-red-500/10 text-red-400 border border-red-500/20"
            : "text-text-primary bg-surface-raised border border-border"
        }`}
      >
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[10px] font-medium ${isError ? "text-red-400/70" : "text-text-muted"}`}>
            {isError ? "System Error" : "AI Assistant"}
          </span>
        </div>

        <div className="prose text-sm leading-snug text-text-primary [&>p]:m-0">
          <ReactMarkdown>{isError ? comparisonData?.message : message.content}</ReactMarkdown>
        </div>

        <div className="flex justify-start mt-1">
          <span className={`text-[10px] ${isError ? "text-red-400/50" : "text-text-muted"}`}>
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
