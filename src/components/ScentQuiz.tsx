"use client";

import { useMemo, useState } from "react";
import { QUESTIONS } from "@/lib/quiz-questions";
import { recommend, type Match } from "@/lib/quiz";
import { CATALOGUE } from "@/lib/products";
import QuizResult from "./QuizResult";

/* The quiz. One question per screen so it never feels like a form.
   State is a plain answers map; the scoring lives in lib/quiz so it can
   be tested without a browser. */
export default function ScentQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const total = QUESTIONS.length;
  const question = QUESTIONS[step];
  const picked = question ? answers[question.id] : undefined;

  const matches: Match[] = useMemo(
    () => (done ? recommend(answers, CATALOGUE) : []),
    [done, answers]
  );

  function choose(optionId: string) {
    if (!question) return;
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    // Advance by itself; Back stays available on every step.
    if (step + 1 < total) setStep(step + 1);
    else setDone(true);
  }

  function back() {
    if (done) {
      setDone(false);
      setStep(total - 1);
      return;
    }
    setStep(Math.max(0, step - 1));
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  if (done) {
    return <QuizResult matches={matches} onRetake={restart} />;
  }

  return (
    <div className="rise">
      <div className="flex items-center justify-between gap-4">
        <p className="tag">
          Question {step + 1} of {total}
        </p>
        {step > 0 && (
          <button type="button" onClick={back} className="tag hover:text-cocoa">
            Back
          </button>
        )}
      </div>

      {/* Progress as a thin gold rule — structure, not decoration. */}
      <div
        className="mt-3 h-px w-full"
        style={{ background: "var(--rule)" }}
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label="Quiz progress"
      >
        <div
          className="h-px bg-gold transition-all duration-300"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      {question && (
        <fieldset className="mt-8 border-0 p-0">
          <legend className="font-display text-3xl sm:text-4xl">
            {question.prompt}
          </legend>
          {question.hint && (
            <p className="mt-2 measure text-[0.9rem] text-taupe">{question.hint}</p>
          )}

          <div
            className={`mt-8 grid gap-3 ${
              question.options.length > 4
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "sm:grid-cols-2"
            }`}
          >
            {question.options.map((option) => {
              const active = picked === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => choose(option.id)}
                  aria-pressed={active}
                  className={`rounded-sm border p-4 text-left transition-colors duration-200 ${
                    active
                      ? "border-gold bg-gold/8"
                      : "border-line bg-porcelain hover:border-gold"
                  }`}
                >
                  <span className="block font-medium">{option.label}</span>
                  {option.blurb && (
                    <span className="mt-1 block text-[0.85rem] text-taupe">
                      {option.blurb}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <p className="mt-8 text-[0.85rem] text-taupe">
        {Object.keys(answers).length} of {total} answered. You can go back and change
        any answer before you see your match.
      </p>
    </div>
  );
}
