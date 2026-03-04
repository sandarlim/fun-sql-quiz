import React from "react";
import { SqlQuestion } from "@/data/sqlQuestions";
import { RotateCcw, Trophy, Target, TrendingUp } from "lucide-react";

interface QuizResultProps {
  score: number;
  total: number;
  answers: Record<number, "same" | "different">;
  questions: SqlQuestion[];
  onRestart: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ score, total, questions, answers, onRestart }) => {
  const pct = Math.round((score / total) * 100);

  const grade =
    pct >= 90 ? { label: "SQL Master", color: "text-primary" } :
    pct >= 70 ? { label: "Proficient", color: "text-success" } :
    pct >= 50 ? { label: "Intermediate", color: "text-accent" } :
    { label: "Keep Practicing", color: "text-destructive" };

  // Topic breakdown
  const topicStats: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, idx) => {
    if (!topicStats[q.topic]) topicStats[q.topic] = { correct: 0, total: 0 };
    topicStats[q.topic].total++;
    if (answers[idx] === q.answer) topicStats[q.topic].correct++;
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
          <p className={`text-xl font-semibold ${grade.color}`}>{grade.label}</p>
        </div>

        {/* Score circle */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-primary glow-primary">
            <div className="text-center">
              <span className="text-3xl font-bold">{score}</span>
              <span className="text-muted-foreground text-lg">/{total}</span>
              <p className="text-xs text-muted-foreground">{pct}%</p>
            </div>
          </div>
        </div>

        {/* Topic breakdown */}
        <div className="rounded-lg border bg-card p-5 mb-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            Topic Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(topicStats).map(([topic, stats]) => (
              <div key={topic} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{topic}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs w-8 text-right">
                    {stats.correct}/{stats.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
