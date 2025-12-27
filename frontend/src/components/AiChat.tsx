import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { useLazyQuery } from "@apollo/client";
import { GET_AI_INSIGHT } from "../graphql/aiQueries";

interface AiChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext: string;
  metricType?: string;
}

export const AiChat: React.FC<AiChatProps> = ({
  isOpen,
  onClose,
  initialContext,
  metricType,
}) => {
  const [messages, setMessages] = useState<
    { role: "ai" | "user"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [getInsight, { loading }] = useLazyQuery(GET_AI_INSIGHT, {
    fetchPolicy: "network-only",
  });

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "ai",
          content: `¡Hola! Soy tu asistente. Veo que estamos analizando ${
            metricType?.toLowerCase() || "la sostenibilidad"
          }. ¿En qué puedo ayudarte?`,
        },
      ]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    const newMessages = [
      ...messages,
      { role: "user" as const, content: userMsg },
    ];
    setMessages(newMessages);

    try {
      const { data } = await getInsight({
        variables: {
          history: newMessages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: initialContext,
        },
      });

      if (data?.getAiInsight) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: data.getAiInsight },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Lo siento, hubo un error conectando con el servicio de IA.",
        },
      ]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-bg-surface-glass border-l border-white/10 shadow-2xl z-[101] flex flex-col backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-xl text-primary">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">
                    EcoAssistant
                  </h3>
                  <span className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-2 h-2" /> AI Contextual
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-white/5 border border-white/10 text-text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] font-black uppercase">
                      {msg.role === "user" ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Bot className="w-3 h-3" />
                      )}
                      {msg.role === "user" ? "Tú" : "EcoAssistant"}
                    </div>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs text-text-secondary">
                      Analizando métricas...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white/5 border-t border-white/10">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Pregúntame sobre tus datos..."
                  className="input flex-1 pr-12 h-12"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-text-muted mt-3 text-center">
                EcoAssistant utiliza Llama 3 para darte consejos basados en tu
                contexto histórico.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
