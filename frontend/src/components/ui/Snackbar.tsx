import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

export type SnackbarType = "success" | "error" | "info" | "warning";

interface SnackbarProps {
  message: string;
  type: SnackbarType;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

const variants = {
  initial: { opacity: 0, y: -20, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.9 },
};

const typeConfig = {
  success: {
    icon: CheckCircle,
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    iconColor: "text-green-400",
  },
  error: {
    icon: AlertCircle,
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    iconColor: "text-red-400",
  },
  info: {
    icon: Info,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    iconColor: "text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    iconColor: "text-yellow-400",
  },
};

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type,
  isOpen,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-md shadow-2xl min-w-[320px] max-w-[90vw] ${config.color}`}
        >
          <Icon className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
          <p className="font-medium text-sm flex-1">{message}</p>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
