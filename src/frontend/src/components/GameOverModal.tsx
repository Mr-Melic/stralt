import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skull } from "lucide-react";
import type React from "react";

interface GameOverModalProps {
  isOpen: boolean;
  onRespawn: () => void;
  xpLost?: number;
  dokaLost?: number;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onRespawn,
  xpLost,
  dokaLost,
}) => {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onRespawn();
      }}
    >
      <AlertDialogContent className="bg-gray-800 border-red-500">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Skull className="w-16 h-16 text-red-500" />
          </div>
          <AlertDialogTitle className="text-center text-2xl text-red-400">
            Game Over
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-300 space-y-2">
            <span className="block">
              You have been defeated in battle! You respawn on a new map — but
              at a cost.
            </span>
            {(xpLost !== undefined && xpLost > 0) ||
            (dokaLost !== undefined && dokaLost > 0) ? (
              <span
                className="block mt-2 rounded px-3 py-2 text-sm font-bold"
                style={{
                  background: "rgba(139,0,0,0.35)",
                  border: "1px solid rgba(220,38,38,0.5)",
                  color: "#fca5a5",
                }}
              >
                {xpLost !== undefined && xpLost > 0 && (
                  <span className="block">
                    📉 −{xpLost} XP lost (20% penalty)
                  </span>
                )}
                {dokaLost !== undefined && dokaLost > 0 && (
                  <span className="block">
                    💸 −{dokaLost} Doka lost (40% penalty)
                  </span>
                )}
              </span>
            ) : null}
            <span className="block text-xs text-gray-400 mt-1">
              Your level is preserved. Keep fighting!
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center">
          <AlertDialogAction
            onClick={onRespawn}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2"
          >
            Respawn on New Map
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GameOverModal;
