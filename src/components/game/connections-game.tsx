import { useState, useEffect } from "react";
import { WordTile } from "./word-tile";
import type { Puzzle } from "@/types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ConnectionsGameProps {
  puzzle: Puzzle;
}

interface SolvedGroup {
  category: string;
  difficulty: 0 | 1 | 2 | 3;
  words: string[];
}

interface AttemptHistory {
  categories: number[];
}

interface GameState {
  mistakes: number;
  solvedGroups: SolvedGroup[];
  attemptHistory: AttemptHistory[];
  words: string[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    //@ts-ignore TODO: Fix this
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

//TODO: Remove useeffect
//Move shuffleArray outside of function
export function ConnectionsGame({ puzzle }: ConnectionsGameProps) {
  const [words, setWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [solvedGroups, setSolvedGroups] = useState<SolvedGroup[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [attemptHistory, setAttemptHistory] = useState<AttemptHistory[]>([]);
  const [showOneAway, setShowOneAway] = useState(false);
  const maxMistakes = 4;

  const getStorageKey = () => {
    return `connections-game-${puzzle.date.toISOString().split('T')[0]}`;
  };

  const saveGameState = (state: GameState) => {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(state));
  };

  const loadGameState = (): GameState | null => {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  };

  const getCategoryForWord = (word: string): number => {
    for (const [_, theme] of Object.entries(puzzle.solution)) {
      if (theme.words.includes(word)) {
        return theme.difficulty;
      }
    }
    return -1;
  };

  const isOneAway = (categories: number[]): boolean => {
    const categoryCounts = categories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const counts = Object.values(categoryCounts);
    return counts.includes(3) && counts.includes(1);
  };

  useEffect(() => {
    const savedState = loadGameState();

    if (savedState) {
      setWords(savedState.words);
      setSolvedGroups(savedState.solvedGroups);
      setMistakes(savedState.mistakes);
      setAttemptHistory(savedState.attemptHistory);
    } else {
      const allWords = Object.values(puzzle.solution).flatMap(
        (theme) => theme.words,
      );
      setWords(shuffleArray(allWords));
    }
  }, [puzzle]);

  const handleShuffle = () => {
    const remainingWords = words.filter(
      (word) => !solvedGroups.some((group) => group.words.includes(word)),
    );
    const solved = words.filter((word) =>
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
  };

  //TODO: useCallback
  const handleWordClick = (word: string) => {
    const newSelected = new Set(selectedWords);
    if (newSelected.has(word)) {
      newSelected.delete(word);
    } else {
      if (newSelected.size < 4) {
        newSelected.add(word);
      }
    }
    setSelectedWords(newSelected);
  };

  const handleDeselectAll = () => {
    setSelectedWords(new Set());
  };

  const handleSubmit = () => {
    if (selectedWords.size !== 4) return;

    const selectedArray = Array.from(selectedWords);
    const categories = selectedArray.map(word => getCategoryForWord(word));

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
        const newWords = words.filter((word) => !theme.words.includes(word));
        const newAttemptHistory = [...attemptHistory, { categories }];

        setSolvedGroups(newSolvedGroups);
        setWords([...theme.words, ...newWords]);
        setAttemptHistory(newAttemptHistory);
        setSelectedWords(new Set());

        saveGameState({
          mistakes,
          solvedGroups: newSolvedGroups,
          attemptHistory: newAttemptHistory,
          words: [...theme.words, ...newWords],
        });
        return;
      }
    }

    const newMistakes = mistakes + 1;
    const newAttemptHistory = [...attemptHistory, { categories }];

    if (isOneAway(categories)) {
      setShowOneAway(true);
      setTimeout(() => {
        setShowOneAway(false);
      }, 2000);
    }

    setMistakes(newMistakes);
    setAttemptHistory(newAttemptHistory);
    setSelectedWords(new Set());

    saveGameState({
      mistakes: newMistakes,
      solvedGroups,
      attemptHistory: newAttemptHistory,
      words,
    });
  };

  const isWordSolved = (word: string) => {
    return solvedGroups.some((group) => group.words.includes(word));
  };

  //TODO: Make it a pure function and move it outside
  const getWordDifficulty = (word: string): 0 | 1 | 2 | 3 | undefined => {
    const group = solvedGroups.find((g) => g.words.includes(word));
    return group?.difficulty;
  };

  const gameWon = solvedGroups.length === 4;
  const gameLost = mistakes >= maxMistakes;

  return (
    <div className="max-w-2xl mx-auto p-6 relative">
      {showOneAway && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black/80 text-white px-8 py-4 rounded-lg text-xl font-bold">
            За Малко...
          </div>
        </div>
      )}

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Connections</h1>
        <p className="text-muted-foreground">
          {puzzle.date.toLocaleDateString("bg-BG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      <main className="space-y-6">
        <p className="text-center text-lg font-medium">
          Направете групи с по 4 думи!
        </p>

        {solvedGroups.map((group, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-md text-center",
              group.difficulty === 0 && "bg-connections-easy text-black",
              group.difficulty === 1 && "bg-connections-medium text-black",
              group.difficulty === 2 && "bg-connections-hard text-white",
              group.difficulty === 3 && "bg-connections-hardest text-white",
            )}
          >
            <h3 className="font-bold uppercase mb-2">{group.category}</h3>
            <p className="text-sm uppercase">{group.words.join(", ")}</p>
          </div>
        ))}

        {!gameWon && !gameLost && (
          <>
            <div className="grid grid-cols-4 gap-2">
              {words
                .filter((w) => !solvedGroups.some((sg) => sg.words.includes(w)))
                .map((word, index) => (
                  <WordTile
                    key={index}
                    word={word}
                    selected={selectedWords.has(word)}
                    solved={isWordSolved(word)}
                    difficulty={getWordDifficulty(word)}
                    onClick={() => handleWordClick(word)}
                  />
                ))}
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center gap-2">
                {Array.from({ length: maxMistakes }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-3 h-3 rounded-full",
                      i < mistakes ? "bg-muted" : "bg-foreground",
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Оставащи опити: {maxMistakes - mistakes}
              </p>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleShuffle}>
                  Разбъркай
                </Button>
                <Button variant="outline" onClick={handleDeselectAll}>
                  Отмаркирай всички
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={selectedWords.size !== 4}
                >
                  Провери
                </Button>
              </div>
            </div>
          </>
        )}

        {gameWon && (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-green-600">Поздравления!</h2>
            <p className="text-lg">Решихте пъзела!</p>
          </div>
        )}

        {gameLost && (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-red-600">Край на Играта</h2>
            <p className="text-lg">Нямате повече опити.</p>
            <div className="space-y-2">
              {Object.entries(puzzle.solution).map(
                ([category, theme], index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-md text-center",
                      theme.difficulty === 0 &&
                      "bg-connections-easy text-black",
                      theme.difficulty === 1 &&
                      "bg-connections-medium text-black",
                      theme.difficulty === 2 &&
                      "bg-connections-hard text-white",
                      theme.difficulty === 3 &&
                      "bg-connections-hardest text-white",
                    )}
                  >
                    <h3 className="font-bold uppercase mb-2">{category}</h3>
                    <p className="text-sm uppercase">
                      {theme.words.join(", ")}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
