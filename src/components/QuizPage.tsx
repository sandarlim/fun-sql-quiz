import React, { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SqlCodeBlock from "@/components/SqlCodeBlock";
import QuizResult from "@/components/QuizResult";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Terminal, Loader2 } from "lucide-react";

export interface SqlQuestion {
  id: number;
  title: string;
  query_a: string;
  query_b: string;
  answer: "same" | "different";
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<SqlQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<"same" | "different" | null>(null);
  const [answers, setAnswers] = useState<Record<number, "same" | "different">>({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from("sql_questions")
        .select("*");
      if (!error && data) {
        // Shuffle
        const shuffled = [...data].sort(() => Math.random() - 0.5) as SqlQuestion[];
        setQuestions(shuffled);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  const question = questions[currentIdx];
  const isAnswered = selected !== null;
  const isCorrect = selected === question?.answer;
  const totalQuestions = questions.length;

  const score = Object.entries(answers).reduce((acc, [idx, ans]) => {
    return acc + (questions[parseInt(idx)]?.answer === ans ? 1 : 0);
  }, 0);

  const handleSelect = (choice: "same" | "different") => {
    if (isAnswered) return;
    setSelected(choice);
    setAnswers((prev) => ({ ...prev, [currentIdx]: choice }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelected(null);
    setAnswers({});
    setShowResult(false);
    // Re-shuffle
    setQuestions((q) => [...q].sort(() => Math.random() - 0.5));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        No questions found.
      </div>
    );
  }

  if (showResult) {
    return (
      <QuizResult
        score={score}
        total={totalQuestions}
        answers={answers}
        questions={questions}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold tracking-tight">SQL Showdown</h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Question <span className="text-foreground font-semibold">{currentIdx + 1}</span> / {totalQuestions}
          </span>
          <span className="text-primary font-semibold">Score: {score}</span>
        </div>
      </header>

      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${((currentIdx + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-4xl animate-fade-in">
          <div className="mb-6 flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              question.difficulty === "easy"
                ? "bg-success/15 text-success"
                : question.difficulty === "medium"
                ? "bg-accent/15 text-accent"
                : "bg-destructive/15 text-destructive"
            }`}>
              {question.difficulty}
            </span>
            <span className="text-xs text-muted-foreground">{question.topic}</span>
          </div>

          <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
          <p className="text-muted-foreground mb-6">
            Will these two queries produce the <span className="text-foreground font-medium">same output</span> or <span className="text-foreground font-medium">different output</span>?
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <SqlCodeBlock sql={question.query_a} label="Query A" />
            <SqlCodeBlock sql={question.query_b} label="Query B" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleSelect("same")}
              disabled={isAnswered}
              className={`relative rounded-lg border-2 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                !isAnswered
                  ? "border-border hover:border-primary hover:glow-primary cursor-pointer"
                  : selected === "same"
                  ? isCorrect ? "border-success glow-success" : "border-destructive glow-destructive"
                  : question.answer === "same" ? "border-success/50" : "border-border opacity-50"
              }`}
            >
              {isAnswered && selected === "same" && (
                isCorrect ? <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-success" /> : <XCircle className="absolute top-3 right-3 h-5 w-5 text-destructive" />
              )}
              {isAnswered && selected !== "same" && question.answer === "same" && (
                <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-success/60" />
              )}
              Same Output
            </button>
            <button
              onClick={() => handleSelect("different")}
              disabled={isAnswered}
              className={`relative rounded-lg border-2 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                !isAnswered
                  ? "border-border hover:border-primary hover:glow-primary cursor-pointer"
                  : selected === "different"
                  ? isCorrect ? "border-success glow-success" : "border-destructive glow-destructive"
                  : question.answer === "different" ? "border-success/50" : "border-border opacity-50"
              }`}
            >
              {isAnswered && selected === "different" && (
                isCorrect ? <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-success" /> : <XCircle className="absolute top-3 right-3 h-5 w-5 text-destructive" />
              )}
              {isAnswered && selected !== "different" && question.answer === "different" && (
                <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-success/60" />
              )}
              Different Output
            </button>
          </div>

          {isAnswered && (
            <div className={`rounded-lg border p-5 mb-6 animate-fade-in ${
              isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
            }`}>
              <p className="text-sm font-medium mb-1">{isCorrect ? "✓ Correct!" : "✗ Not quite."}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {isAnswered && (
            <div className="flex justify-end animate-fade-in">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                {currentIdx < totalQuestions - 1 ? <>Next <ArrowRight className="h-4 w-4" /></> : <>See Results <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
