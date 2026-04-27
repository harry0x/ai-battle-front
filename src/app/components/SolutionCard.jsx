import MarkdownRenderer from './MarkdownRenderer';

export default function SolutionCard({ label, solution, score, isWinner, index }) {
  return (
    <div
      className={`bg-surface-raised rounded-xl p-6 animate-fade-up ${
        isWinner ? 'ring-1 ring-green/20' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      id={`solution-${label.toLowerCase().replace(/\s/g, '-')}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-text-primary tracking-tight">
          {label}
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isWinner
              ? 'bg-green-light text-green'
              : 'bg-blue-light text-blue'
          }`}
        >
          {isWinner && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {score}/10
        </span>
      </div>

      {/* Markdown content */}
      <MarkdownRenderer content={solution} />
    </div>
  );
}
