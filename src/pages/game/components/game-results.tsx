import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { AttemptHistory, SolvedGroup } from "../types";
import { EMOJI_SQUARES } from "../constants";

interface GameResultsProps {
  attemptHistory: AttemptHistory[];
  mistakes: number;
  date: Date;
  gameWon: boolean;
}

function generateShareableText(
  attemptHistory: AttemptHistory[],
  mistakes: number,
  date: Date,
  gameWon: boolean,
): string {
  const dateStr = date.toLocaleDateString("bg-BG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const resultLine = `${mistakes}/4 грешки ${gameWon ? "✅" : "❌"}`;

  const emojiLines = attemptHistory
    .map((attempt) => {
      const sortedCategories = [...attempt.categories].sort((a, b) => a - b);
      const emojis = sortedCategories
        .map((cat) => EMOJI_SQUARES[cat as SolvedGroup["difficulty"]])
        .join("");

      return emojis;
    })
    .join("\n");

  return `Connections BG\n${dateStr}\n${resultLine}\n\n${emojiLines}`;
}

export function GameResults({
  attemptHistory,
  mistakes,
  date,
  gameWon,
}: GameResultsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = generateShareableText(
    attemptHistory,
    mistakes,
    date,
    gameWon,
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (attemptHistory.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Няма опити за показване
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
          История на Опитите
        </h3>
        <div className="flex flex-col gap-2 items-center">
          {attemptHistory.map((attempt, index) => {
            const sortedCategories = [...attempt.categories].sort(
              (a, b) => a - b,
            );

            return (
              <div key={index} className="flex gap-1.5 items-center">
                {sortedCategories.map((category, i) => (
                  <span key={i} className="text-2xl">
                    {EMOJI_SQUARES[category as SolvedGroup["difficulty"]]}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-black hover:bg-gray-800 text-white font-semibold rounded-full transition-colors shadow-lg hover:shadow-xl"
      >
        {copied ? (
          <>
            <Check size={20} />
            Копирано!
          </>
        ) : (
          <>
            <Copy size={20} />
            Сподели Резултатите
          </>
        )}
      </button>
    </div>
  );
}
