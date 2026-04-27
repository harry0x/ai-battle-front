import MarkdownRenderer from './MarkdownRenderer';

export default function JudgeVerdict({ judge }) {
  const s1Wins = judge.solution_1_score >= judge.solution_2_score;
  const winner = s1Wins ? 'Solution 1' : 'Solution 2';

  return (
    <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
      {/* Section label */}
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent">
          <path d="M8 1L10 5.5L15 6.2L11.5 9.5L12.4 14.5L8 12.1L3.6 14.5L4.5 9.5L1 6.2L6 5.5L8 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Judge's Analysis
        </span>
      </div>

      {/* Reasoning grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-surface-sunken rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-primary">Solution 1</span>
            <span className="text-lg font-bold text-accent tabular-nums">{judge.solution_1_score}/10</span>
          </div>
          <MarkdownRenderer content={judge.solution_1_reasoning} />
        </div>
        <div className="bg-surface-sunken rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-primary">Solution 2</span>
            <span className="text-lg font-bold text-text-secondary tabular-nums">{judge.solution_2_score}/10</span>
          </div>
          <MarkdownRenderer content={judge.solution_2_reasoning} />
        </div>
      </div>

      {/* Recommendation chip */}
      <div className="inline-flex items-center gap-2 text-xs font-medium text-green bg-green-light px-3 py-1.5 rounded-full">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Recommended: {winner}
      </div>
    </div>
  );
}
