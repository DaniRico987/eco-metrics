import React from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  TrendingDown,
  AlertCircle,
  Users,
  Sparkles,
} from "lucide-react";

import { ImpactRecord, Company, Goal } from "../types";

interface EcoInsightsProps {
  records: ImpactRecord[];
  company?: Company | null;
  goals?: Goal[];
  onAnalyzeMetric?: (metricType: string, context: string) => void;
}

export const EcoInsights: React.FC<EcoInsightsProps> = ({
  records,
  company,
  goals = [],
  onAnalyzeMetric,
}) => {
  if (!records || records.length < 2) return null;

  // Sort records by date to ensure proper comparison
  const sortedRecords = [...records].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  const latest = sortedRecords[0];
  const previous = sortedRecords[1];
  const employees = company?.employeesCount || 1;
  const activeMetrics =
    company?.companyMetrics?.filter((cm) => cm.isActive) || [];

  const insights = activeMetrics.map((cm) => {
    const val =
      latest.values.find((v) => v.metricId === cm.metricId)?.amount || 0;
    const prevVal =
      previous.values.find((v) => v.metricId === cm.metricId)?.amount || 0;

    // Avoid division by zero
    let diff = 0;
    if (prevVal !== 0) {
      diff = ((val - prevVal) / prevVal) * 100;
    }

    const isGood = diff <= 0;
    const perCapita = val / employees;

    const goal = goals.find(
      (g) => g.metricId === cm.metricId && g.year === latest.year
    );
    const goalMet = goal ? val <= Number(goal.target) : null;

    return {
      title: cm.metric.name,
      value: val,
      prevValue: prevVal,
      unit: cm.metric.unit,
      icon: <TrendingDown className="w-5 h-5" />, // Reusing generic, could be mapped or part of Metric
      color: cm.metric.color || "text-primary",
      bg: "bg-white/5", // Generic bg or derived from color
      type: cm.metric.name, // Using name as type identifier
      diff: diff.toFixed(1),
      isGood,
      perCapita: perCapita.toFixed(2),
      goalMet,
      goalValue: goal?.target,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          Análisis de Impacto Detallado
        </h2>
        <div className="text-xs font-bold uppercase tracking-widest text-text-muted bg-white/5 px-3 py-1 rounded-full border border-white/5">
          Mes Actual vs Anterior
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 rounded-3xl relative overflow-hidden group border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
          >
            {insight.goalMet && (
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-lg z-10">
                META CUMPLIDA
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className={`${insight.bg} ${insight.color} p-3 rounded-2xl`}>
                {insight.icon}
              </div>
              <div
                className={`flex items-center gap-1 font-black text-sm px-2 py-1 rounded-lg ${
                  insight.isGood
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {Math.abs(Number(insight.diff))}%
              </div>
            </div>

            <h3 className="text-lg font-bold mb-1">{insight.title}</h3>

            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                <Users className="w-3 h-3" />
                <span>
                  {insight.perCapita} {insight.unit} / empleado
                </span>
              </div>
              {insight.goalValue && (
                <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                  Objetivo: {insight.goalValue} {insight.unit}
                </div>
              )}
            </div>

            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              {insight.isGood
                ? `Reducción efectiva detectada. Tu estrategia de optimización está funcionando para ${insight.title.toLowerCase()}.`
                : `Incremento de consumo crítico. Se recomienda auditar el área de ${insight.title.toLowerCase()} para identificar fugas o desperdicios.`}
            </p>

            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary cursor-help">
                <AlertCircle className="w-4 h-4" />
                Sugerencia
              </div>
              <button
                onClick={() => {
                  const contextStr = `Métrica: ${
                    insight.title
                  }. Valor Actual: ${insight.value} ${
                    insight.unit
                  }. Valor Mes Anterior: ${insight.prevValue} ${
                    insight.unit
                  }. Objetivo: ${
                    insight.goalValue || "N/A"
                  }. Empleados: ${employees}.`;
                  onAnalyzeMetric?.(insight.title, contextStr);
                }}
                className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-300 group/ai relative"
                title="Consultar con IA"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
