import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, SnackbarType } from "../components/ui/Snackbar";

interface SnackbarContextType {
  show: (message: string, type?: SnackbarType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<SnackbarType>("info");
  const [duration, setDuration] = useState(4000);

  const show = useCallback(
    (msg: string, type: SnackbarType = "info", duration = 4000) => {
      setMessage(msg);
      setType(type);
      setDuration(duration);
      setIsOpen(true);
    },
    []
  );

  const success = useCallback((msg: string) => show(msg, "success"), [show]);
  const error = useCallback((msg: string) => show(msg, "error"), [show]);
  const info = useCallback((msg: string) => show(msg, "info"), [show]);
  const warning = useCallback((msg: string) => show(msg, "warning"), [show]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <SnackbarContext.Provider value={{ show, success, error, info, warning }}>
      {children}
      <Snackbar
        isOpen={isOpen}
        message={message}
        type={type}
        onClose={handleClose}
        duration={duration}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
