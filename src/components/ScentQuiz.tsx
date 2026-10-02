"use client";

import { useMemo, useState } from "react";
import Glyph from "./Glyph";
import QuizResult from "./QuizResult";
import { QUESTIONS } from "@/lib/quiz-questions";
import { recommend, derivePersonality, type Match } from "@/lib/quiz";
import { CATALOGUE } from "@/lib/products";

/* One question per screen so it never feels like a form. State is a
   plain answers map; scoring lives in lib/quiz so it stays testable. */
export default function ScentQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const total = QUESTIONS.length;
  const question = QUESTIONS[step];

  const matches: Match[] = useMemo(
    () => (done ? recommend(answers, CATALOGUE) : []),
    [done, answers]
  );
  const personality = useMemo(
    () => (done ? derivePersonality(answers) : ""),
    [done, answers]
  );

  function choose(optionId: string) {
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
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
    return (
      <QuizResult
        personality={personality}
        matches={matches}
        onRetake={restart}
        onBack={back}
      />
    );
  }

  const pct = ((step + 1) / total) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">
          Question {step + 1} of {total}
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="text-[0.85rem] text-taupe underline-offset-4 transition-colors hover:text-espresso hover:underline"
          >
            Back
          </button>
        )}
      </div>

      <div
        className="mt-3 h-1 w-full overflow-hidden rounded-full"
        style={{ background: "var(--color-sage)" }}
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label="Quiz progress"
      >
        <div
          className="h-full rounded-full bg-sage-mid transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <fieldset key={question.id} className="mt-9 border-0 p-0">
        <legend className="font-display text-3xl leading-tight sm:text-[2.6rem]">
          {question.prompt}
        </legend>
        {question.hint && (
          <p className="mt-3 measure text-[0.95rem] text-taupe">
            {question.hint}
          </p>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => choose(option.id)}
              className="group flex items-start gap-4 rounded-[--radius-card] border border-line bg-cream p-5 text-left transition-all duration-200 hover:border-sage-mid hover:shadow-[--shadow-soft]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage text-sage-deep transition-colors duration-200 group-hover:bg-sage-mid group-hover:text-ivory">
                <Glyph name={option.glyph ?? "leaf"} />
              </span>
              <span className="min-w-0">
                <span className="block font-medium leading-snug">
                  {option.label}
                </span>
                {option.blurb && (
                  <span className="mt-1 block text-[0.85rem] leading-relaxed text-taupe">
                    {option.blurb}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}