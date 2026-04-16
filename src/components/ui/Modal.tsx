import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const sizeClasses = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`relative w-full ${sizeClasses[size]} bg-card rounded-2xl shadow-2xl z-10`}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-serif font-bold text-xl">{title}</h3>
              <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
                <RiCloseLine className="text-xl" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
