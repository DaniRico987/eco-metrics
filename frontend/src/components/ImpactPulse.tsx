import React from "react";
import { motion } from "framer-motion";

interface ImpactPulseProps {
  score: number;
}

export const ImpactPulse: React.FC<ImpactPulseProps> = ({ score }) => {
  // score is 0-100 (percentage of health/efficiency)
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="glass p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center h-full relative overflow-hidden border border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 blur-[80px] rounded-full" />

      <div className="relative w-48 h-48 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          {/* Base Circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            className="text-white/[0.03]"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            fill="transparent"
            stroke="var(--primary)"
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            className="drop-shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]"
          />
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-black text-white"
          >
            {Math.round(score)}
          </motion.span>
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            Eco Score
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-black mb-3">Salud Ambiental</h3>
      <p className="text-text-secondary text-sm leading-relaxed max-w-[200px]">
        {score > 80
          ? "Tu empresa está liderando el camino hacia la sostenibilidad."
          : score > 50
          ? "Vas por buen camino, pero hay margen de mejora."
          : "Es momento de tomar acciones drásticas para reducir tu impacto."}
      </p>

      {/* Pulsing indicator */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest"
      >
        <div className="w-2 h-2 rounded-full bg-primary" />
        Sincronizado
      </motion.div>
    </div>
  );
};
