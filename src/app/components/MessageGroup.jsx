import SolutionCard from './SolutionCard';
import JudgeVerdict from './JudgeVerdict';

export default function MessageGroup({ data, index }) {
  const s1Wins = data.judge.solution_1_score >= data.judge.solution_2_score;

  return (
    <div className="animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
      {/* User question — right aligned */}
      <div className="flex justify-end mb-8">
        <div className="bg-accent-light text-accent-text text-sm font-medium px-5 py-3 rounded-2xl rounded-br-md max-w-[75%] leading-relaxed">
          {data.problem}
        </div>
      </div>

      {/* Solutions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <SolutionCard
          label="Solution 1"
          solution={data.solution_1}
          score={data.judge.solution_1_score}
          isWinner={s1Wins}
          index={0}
        />
        <SolutionCard
          label="Solution 2"
          solution={data.solution_2}
          score={data.judge.solution_2_score}
          isWinner={!s1Wins}
          index={1}
        />
      </div>

      {/* Judge verdict */}
      <JudgeVerdict judge={data.judge} />
    </div>
  );
}
