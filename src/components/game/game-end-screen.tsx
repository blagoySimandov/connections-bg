import { GameResults } from "./game-results";
import type { SolvedGroup, AttemptHistory } from "./types/game-types";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Trophy, Frown } from "lucide-react";

interface GameEndScreenProps {
  isWon: boolean;
  date: Date;
  mistakes: number;
  attemptHistory: AttemptHistory[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameEndScreen({
  isWon,
  date,
  mistakes,
  attemptHistory,
  isOpen,
  onOpenChange,
}: GameEndScreenProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-[90vw] max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95">
          <Dialog.Close className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={20} className="text-gray-500" />
          </Dialog.Close>

          <div className="space-y-8">
            <div className="text-center space-y-4">
              {isWon ? (
                <>
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                      <Trophy size={40} className="text-white" />
                    </div>
                  </div>
                  <Dialog.Title className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Поздравления!
                  </Dialog.Title>
                  <Dialog.Description className="text-xl text-gray-600 dark:text-gray-400">
                    Решихте пъзела!
                  </Dialog.Description>
                  <div className="inline-block px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Грешки: {mistakes}/4
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <Frown size={40} className="text-white" />
                    </div>
                  </div>
                  <Dialog.Title className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                    Край на Играта
                  </Dialog.Title>
                  <Dialog.Description className="text-xl text-gray-600 dark:text-gray-400">
                    Нямате повече опити
                  </Dialog.Description>
                </>
              )}
            </div>

            <GameResults
              attemptHistory={attemptHistory}
              mistakes={mistakes}
              date={date}
              gameWon={isWon}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
