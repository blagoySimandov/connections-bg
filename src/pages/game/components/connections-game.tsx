import { useCallback, useState } from "react";
import type { Puzzle, SolvedGroup, AttemptHistory } from "@/shared/types";
import { useGameState } from "../hooks/use-game-state";
import { useGameLogic } from "../hooks/use-game-logic";
import { shuffleArray } from "../utils/game-utils";
import { GameHeader } from "./game-header";
import { OneAwayPopup } from "./one-away-popup";
import { SolvedGroupsDisplay } from "./solved-groups-display";
import { WordGrid } from "./word-grid";
import { MistakesIndicator } from "./mistakes-indicator";
import { GameActions } from "./game-actions";
import { GameEndScreen } from "./game-end-screen";
import { BarChart3 } from "lucide-react";
import {
  END_SCREEN_DELAY,
  INCORRECT_DELAY,
  WORD_SUBMIT_DELAY,
} from "../constants";
import { useAuth } from "@/shared/hooks/use-auth";
import { useAnalytics } from "@/shared/hooks/use-analytics";
import { syncService, ANALYTICS_EVENTS } from "@/shared/services";

interface ConnectionsGameProps {
  puzzle: Puzzle;
}

const MAX_MISTAKES = 4;

export function ConnectionsGame({ puzzle }: ConnectionsGameProps) {
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();

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
  } = useGameState(puzzle, user?.uid || null);

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

  const syncGameCompletion = useCallback(
    (
      won: boolean,
      finalMistakes: number,
      finalSolvedGroups: SolvedGroup[],
      finalAttemptHistory: AttemptHistory[],
    ) => {
      if (!puzzle.id) return;

      syncService.syncGameCompletion(
        user?.uid || null,
        puzzle.id,
        puzzle.date,
        {
          won,
          mistakes: finalMistakes,
          solvedGroups: finalSolvedGroups,
          attemptHistory: finalAttemptHistory,
        }
      );
    },
    [user, puzzle],
  );

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

    trackEvent(ANALYTICS_EVENTS.SHUFFLE_CLICKED, {
      puzzle_id: puzzle.id,
      puzzle_date: puzzle.date,
    });
  }, [words, solvedGroups, mistakes, attemptHistory, setWords, saveGameState, trackEvent, puzzle]);

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

    trackEvent(ANALYTICS_EVENTS.DESELECT_CLICKED, {
      puzzle_id: puzzle.id,
      puzzle_date: puzzle.date,
    });
  }, [setSelectedWords, trackEvent, puzzle]);

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
        const gameIsWon = newSolvedGroups.length === 4;

        if (gameIsWon) {
          syncGameCompletion(
            true,
            mistakes,
            newSolvedGroups,
            newAttemptHistory,
          );

          trackEvent(ANALYTICS_EVENTS.GAME_COMPLETED, {
            puzzle_id: puzzle.id,
            puzzle_date: puzzle.date,
            won: true,
            mistakes: mistakes,
            total_attempts: newAttemptHistory.length,
          });
        }

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
        }, WORD_SUBMIT_DELAY);

        return;
      }
    }

    const newMistakes = mistakes + 1;
    const newAttemptHistory = [...attemptHistory, { categories }];
    const isLastMistake = newMistakes >= MAX_MISTAKES;
    const oneAway = isOneAway(categories);

    if (oneAway) {
      triggerOneAwayMessage();
      trackEvent(ANALYTICS_EVENTS.ONE_AWAY_DETECTED, {
        puzzle_id: puzzle.id,
        puzzle_date: puzzle.date,
        mistakes: newMistakes,
      });
    }

    trackEvent(ANALYTICS_EVENTS.MISTAKE_MADE, {
      puzzle_id: puzzle.id,
      puzzle_date: puzzle.date,
      mistakes: newMistakes,
      one_away: oneAway,
    });

    setIsIncorrect(true);

    if (isLastMistake) {
      syncGameCompletion(false, newMistakes, solvedGroups, newAttemptHistory);

      trackEvent(ANALYTICS_EVENTS.GAME_COMPLETED, {
        puzzle_id: puzzle.id,
        puzzle_date: puzzle.date,
        won: false,
        mistakes: newMistakes,
        total_attempts: newAttemptHistory.length,
      });

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
      }, END_SCREEN_DELAY);
    } else {
      setTimeout(() => setIsIncorrect(false), INCORRECT_DELAY);
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
    puzzle.id,
    puzzle.date,
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
    syncGameCompletion,
    trackEvent,
  ]);

  return (
    <div className="max-w-2xl mx-auto px-2 py-6 sm:p-6 relative">
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
