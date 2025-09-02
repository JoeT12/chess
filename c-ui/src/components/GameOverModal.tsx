import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type GameOverModalProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onClick: () => void;
};

export default function GameOverModal({
  isOpen,
  message,
  onClose,
  onClick,
}: GameOverModalProps) {
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Game Over!</DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-around mt-1">
          <Button
            className="mt-2 bg-chessGreen text-white py-2 rounded-md"
            onClick={onClick}
          >
            Return to Lobby
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
