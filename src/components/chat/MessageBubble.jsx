import ReactMarkdown from "react-markdown";
import { formatTime } from "../../utils/formatDate.js";
import useAuthStore from "../../store/authStore.js";

/**
 * Single message bubble component.
 * Renders user messages right-aligned.
 * Parses assistant messages to render side-by-side model comparisons.
 */
export default function MessageBubble({ message }) {
  const { user } = useAuthStore();
  const isUser = message.role === "user";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col bg-surface-sunken rounded-2xl border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-transparent p-3 border-b border-border">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded flex items-center justify-center bg-blue-500/20 text-blue-500">M</span>
                Mistral Model
              </h3>
            </div>
            <div className="p-4 prose prose-sm prose-invert max-w-none text-text-secondary overflow-y-auto max-h-[400px]">
              <ReactMarkdown>{comparisonData.mistral}</ReactMarkdown>
            </div>
          </div>
          
          <div className="flex flex-col bg-surface-sunken rounded-2xl border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-3 border-b border-border">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded flex items-center justify-center bg-emerald-500/20 text-emerald-500">C</span>
                Cohere Model
              </h3>
            </div>
            <div className="p-4 prose prose-sm prose-invert max-w-none text-text-secondary overflow-y-auto max-h-[400px]">
              <ReactMarkdown>{comparisonData.cohere}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Judge Section */}
        <div className="bg-accent/5 rounded-2xl border border-accent/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
             <div className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Winner: {comparisonData.judge.winner}
             </div>
          </div>
          <div className="p-4 border-b border-accent/10">
            <h3 className="text-sm font-bold text-accent flex items-center gap-2">
              <span className="text-lg">⚖️</span> Judge Evaluation (Gemini)
            </h3>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Mistral Score</span>
                <span className="text-xl font-black text-blue-400 leading-none">{comparisonData.judge.mistralScore}<span className="text-sm text-text-muted">/10</span></span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {comparisonData.judge.mistralReasoning}
              </p>
            </div>
            <div>
               <div className="flex items-end gap-2 mb-2">
                <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Cohere Score</span>
                <span className="text-xl font-black text-emerald-400 leading-none">{comparisonData.judge.cohereScore}<span className="text-sm text-text-muted">/10</span></span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {comparisonData.judge.cohereReasoning}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for user messages or normal text/error messages
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-up`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-accent text-white rounded-br-md"
            : isError 
            ? "bg-red-500/10 text-red-400 border border-red-500/20 rounded-bl-md"
            : "bg-surface-sunken text-text-primary rounded-bl-md"
        }`}
      >
        <div className={`flex items-center gap-2 mb-1 ${isUser ? "justify-end" : ""}`}>
          <span className={`text-[10px] font-medium ${isUser ? "text-white/70" : isError ? "text-red-400/70" : "text-text-muted"}`}>
            {isUser ? (user?.name || "You") : isError ? "System Error" : "AI Assistant"}
          </span>
        </div>

        <div className={`prose text-sm leading-relaxed ${isUser ? "prose-invert" : ""}`}>
          <ReactMarkdown>{isError ? comparisonData.message : message.content}</ReactMarkdown>
        </div>

        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mt-1.5`}>
          <span className={`text-[10px] ${isUser ? "text-white/50" : isError ? "text-red-400/50" : "text-text-muted"}`}>
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
