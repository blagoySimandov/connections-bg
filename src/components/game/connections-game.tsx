import { useCallback, useState } from "react";
import type { Puzzle } from "@/types";
import { useGameState } from "./hooks/use-game-state";
import { useGameLogic } from "./hooks/use-game-logic";
import { shuffleArray } from "./utils/game-utils";
import { GameHeader } from "./game-header";
import { OneAwayPopup } from "./one-away-popup";
import { SolvedGroupsDisplay } from "./solved-groups-display";
import { WordGrid } from "./word-grid";
import { MistakesIndicator } from "./mistakes-indicator";
import { GameActions } from "./game-actions";
import { GameEndScreen } from "./game-end-screen";
import { BarChart3 } from "lucide-react";

interface ConnectionsGameProps {
  puzzle: Puzzle;
}

const MAX_MISTAKES = 4;

export function ConnectionsGame({ puzzle }: ConnectionsGameProps) {
  const {
    words,
    selectedWords,
    solvedGroups,
    mistakes,
    attemptHistory,
    showOneAway,
    setWords,
    setSelectedWords,
    setSolvedGroups,
    setMistakes,
    setAttemptHistory,
    saveGameState,
    triggerOneAwayMessage,
  } = useGameState(puzzle);

  const {
    getCategoryForWord,
    isOneAway,
    isWordSolved,
    getWordDifficulty,
    checkGameWon,
    checkGameLost,
  } = useGameLogic(puzzle, solvedGroups);

  const gameWon = checkGameWon();
  const gameLost = checkGameLost(mistakes, MAX_MISTAKES);

  const [hasClosedResults, setHasClosedResults] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [animatingWords, setAnimatingWords] = useState<string[]>([]);
  const isResultsOpen = (gameWon || gameLost) && !hasClosedResults;

  const handleResultsOpenChange = (open: boolean) => {
    if (!open) {
      setHasClosedResults(true);
    }
  };

  const handleShuffle = useCallback(() => {
    const remainingWords = words.filter(
      (word: string) =>
        !solvedGroups.some((group) => group.words.includes(word)),
    );
    const solved = words.filter((word: string) =>
      solvedGroups.some((group) => group.words.includes(word)),
    );
    const newWords = [...solved, ...shuffleArray(remainingWords)];
    setWords(newWords);

    saveGameState({
      mistakes,
      solvedGroups,
      attemptHistory,
      words: newWords,
    });
  }, [words, solvedGroups, mistakes, attemptHistory, setWords, saveGameState]);

  const handleWordClick = useCallback(
    (word: string) => {
      setSelectedWords((prev: Set<string>) => {
        const newSelected = new Set(prev);
        if (newSelected.has(word)) {
          newSelected.delete(word);
        } else {
          if (newSelected.size < 4) {
            newSelected.add(word);
          }
        }
        return newSelected;
      });
    },
    [setSelectedWords],
  );

  const handleDeselectAll = useCallback(() => {
    setSelectedWords(new Set());
  }, [setSelectedWords]);

  const handleSubmit = useCallback(() => {
    if (selectedWords.size !== 4) return;

    const selectedArray = Array.from(selectedWords);
    const categories = selectedArray.map((word) => getCategoryForWord(word));

    for (const [category, theme] of Object.entries(puzzle.solution)) {
      const isCorrect = theme.words.every((word) =>
        selectedArray.includes(word),
      );

      if (isCorrect) {
        const newSolvedGroups = [
          ...solvedGroups,
          {
            category,
            difficulty: theme.difficulty,
            words: theme.words,
          },
        ];
        const newWords = words.filter(
          (word: string) => !theme.words.includes(word),
        );
        const newAttemptHistory = [...attemptHistory, { categories }];

        setAnimatingWords(theme.words);
        setSelectedWords(new Set());

        setTimeout(() => {
          setSolvedGroups(newSolvedGroups);
          setWords([...theme.words, ...newWords]);
          setAttemptHistory(newAttemptHistory);
          setAnimatingWords([]);

          saveGameState({
            mistakes,
            solvedGroups: newSolvedGroups,
            attemptHistory: newAttemptHistory,
            words: [...theme.words, ...newWords],
          });
        }, 500);

        return;
      }
    }

    const newMistakes = mistakes + 1;
    const newAttemptHistory = [...attemptHistory, { categories }];
    const isLastMistake = newMistakes >= MAX_MISTAKES;

    if (isOneAway(categories)) {
      triggerOneAwayMessage();
    }

    setIsIncorrect(true);

    if (isLastMistake) {
      setTimeout(() => {
        setIsIncorrect(false);
        setMistakes(newMistakes);
        setAttemptHistory(newAttemptHistory);
        saveGameState({
          mistakes: newMistakes,
          solvedGroups,
          attemptHistory: newAttemptHistory,
          words,
        });
      }, 900);
    } else {
      setTimeout(() => setIsIncorrect(false), 600);
      setMistakes(newMistakes);
      setAttemptHistory(newAttemptHistory);
      saveGameState({
        mistakes: newMistakes,
        solvedGroups,
        attemptHistory: newAttemptHistory,
        words,
      });
    }
  }, [
    selectedWords,
    getCategoryForWord,
    puzzle.solution,
    solvedGroups,
    words,
    attemptHistory,
    mistakes,
    isOneAway,
    setSolvedGroups,
    setWords,
    setAttemptHistory,
    setSelectedWords,
    setMistakes,
    saveGameState,
    triggerOneAwayMessage,
  ]);

  return (
    <div className="max-w-2xl mx-auto p-6 relative">
      <OneAwayPopup show={showOneAway} />

      <GameHeader date={puzzle.date} />

      <main className="space-y-6">
        <p className="text-center text-lg font-medium">
          Направете групи с по 4 думи!
        </p>

        <SolvedGroupsDisplay
          solvedGroups={solvedGroups}
          gameEnded={gameLost || gameWon}
          gameLost={gameLost}
          puzzle={puzzle}
        />

        {!gameWon && !gameLost && (
          <>
            <WordGrid
              words={words}
              selectedWords={selectedWords}
              solvedGroups={solvedGroups}
              isWordSolved={isWordSolved}
              getWordDifficulty={getWordDifficulty}
              onWordClick={handleWordClick}
              isIncorrect={isIncorrect}
              animatingWords={animatingWords}
            />

            <MistakesIndicator mistakes={mistakes} maxMistakes={MAX_MISTAKES} />

            <GameActions
              selectedCount={selectedWords.size}
              onShuffle={handleShuffle}
              onDeselectAll={handleDeselectAll}
              onSubmit={handleSubmit}
            />
          </>
        )}

        {(gameWon || gameLost) && (
          <div className="flex justify-center">
            <button
              onClick={() => setHasClosedResults(false)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full transition-colors shadow-lg hover:shadow-xl"
            >
              <BarChart3 size={20} />
              Виж Резултатите
            </button>
          </div>
        )}

        <GameEndScreen
          isWon={gameWon}
          date={puzzle.date}
          mistakes={mistakes}
          attemptHistory={attemptHistory}
          isOpen={isResultsOpen}
          onOpenChange={handleResultsOpenChange}
        />
      </main>
    </div>
  );
}
