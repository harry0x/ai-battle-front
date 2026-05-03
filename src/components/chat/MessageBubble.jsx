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
      className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
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
  const [expandedModel, setExpandedModel] = useState(null); // 'mistral' | 'cohere' | null

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
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">AI Battle Results</span>
        </div>
        
        {/* Parallel View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 mt-4">
          {/* Mistral Box */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-surface-sunken border border-border text-text-primary text-xs">M</span>
                Mistral
              </h3>
              <div className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                <CopyButton text={comparisonData.mistral} />
                <button
                  onClick={() => setExpandedModel('mistral')}
                  className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
                  title="Full Screen"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="prose prose-sm max-w-none text-text-primary">
              <ReactMarkdown>{comparisonData.mistral}</ReactMarkdown>
            </div>
          </div>
          
          {/* Cohere Box */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-surface-sunken border border-border text-text-primary text-xs">C</span>
                Cohere
              </h3>
              <div className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                <CopyButton text={comparisonData.cohere} />
                <button
                  onClick={() => setExpandedModel('cohere')}
                  className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
                  title="Full Screen"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="prose prose-sm max-w-none text-text-primary">
              <ReactMarkdown>{comparisonData.cohere}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Judge Section */}
        {comparisonData.judge ? (
          <div className="pt-6 border-t border-border mt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-surface-sunken border border-border text-text-primary text-xs">G</span>
                Gemini Judge
              </h3>
              <div className="bg-surface-sunken text-text-primary text-xs font-semibold px-3 py-1 rounded-full border border-border">
                Winner: <span className="text-accent ml-1">{comparisonData.judge.winner}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-sm font-semibold text-text-primary">Mistral Score: <span className="font-normal text-text-secondary">{comparisonData.judge.mistralScore}/10</span></span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {comparisonData.judge.mistralReasoning}
                </p>
              </div>
              <div>
                 <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm font-semibold text-text-primary">Cohere Score: <span className="font-normal text-text-secondary">{comparisonData.judge.cohereScore}/10</span></span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {comparisonData.judge.cohereReasoning}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-6 border-t border-border mt-2 flex items-center gap-3">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm text-text-muted">Gemini is evaluating...</span>
          </div>
        )}

        {/* Full Screen Modal */}
        {expandedModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up">
            <div className="bg-surface rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-border">
              <div className="p-4 border-b border-border flex justify-between items-center bg-surface-raised">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  {expandedModel === 'mistral' ? (
                    <><span className="w-6 h-6 rounded flex items-center justify-center bg-blue-500/20 text-blue-500 text-sm">M</span> Mistral Model</>
                  ) : (
                    <><span className="w-6 h-6 rounded flex items-center justify-center bg-emerald-500/20 text-emerald-500 text-sm">C</span> Cohere Model</>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  <CopyButton text={expandedModel === 'mistral' ? comparisonData.mistral : comparisonData.cohere} />
                  <button onClick={() => setExpandedModel(null)} className="p-2 bg-surface-sunken hover:bg-border rounded-lg transition-colors text-text-primary">
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

  // Simple pill-shaped bubble for user messages
  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-fade-up">
        <div className="max-w-[80%] rounded-3xl px-5 py-2.5 bg-surface-raised text-text-primary">
          <div className="prose text-sm leading-snug [&>p]:m-0 text-text-primary">
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
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isError 
            ? "bg-red-500/10 text-red-400 border border-red-500/20 rounded-bl-md"
            : "text-text-primary rounded-bl-md"
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
