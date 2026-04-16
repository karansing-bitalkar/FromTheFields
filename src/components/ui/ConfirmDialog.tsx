import { motion, AnimatePresence } from "framer-motion";
import { RiAlertLine } from "react-icons/ri";

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmClass?: string;
}

export default function ConfirmDialog({
  isOpen, onConfirm, onCancel, title, message,
  confirmText = "Confirm", confirmClass = "bg-destructive text-white"
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-sm bg-card rounded-2xl shadow-2xl z-10 p-6 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <RiAlertLine className="text-destructive text-2xl" />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm mb-6">{message}</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${confirmClass}`}>
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
