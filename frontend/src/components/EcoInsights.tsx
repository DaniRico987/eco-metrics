import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";

interface EcoInsightsProps {
  records: any[];
}

export const EcoInsights: React.FC<EcoInsightsProps> = ({ records }) => {
  if (!records || records.length < 2) return null;

  const latest = records[0];
  const previous = records[1];

  const insights = [
    {
      title: "Consumo de Energía",
      value: Number(latest.energyKwh),
      prevValue: Number(previous.energyKwh),
      unit: "kWh",
      icon: <TrendingDown className="w-5 h-5" />,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      title: "Uso de Agua",
      value: Number(latest.waterM3),
      prevValue: Number(previous.waterM3),
      unit: "m³",
      icon: <TrendingDown className="w-5 h-5" />,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      title: "Generación de Residuos",
      value: Number(latest.wasteKg),
      prevValue: Number(previous.wasteKg),
      unit: "kg",
      icon: <TrendingDown className="w-5 h-5" />,
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
  ].map((item) => {
    const diff = ((item.value - item.prevValue) / item.prevValue) * 100;
    const isGood = diff <= 0;
    return {
      ...item,
      diff: diff.toFixed(1),
      isGood,
      icon: isGood ? (
        <TrendingDown className="w-5 h-5" />
      ) : (
        <TrendingUp className="w-5 h-5" />
      ),
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {insights.map((insight, index) => (
        <motion.div
          key={insight.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass p-6 rounded-3xl relative overflow-hidden group border border-white/5 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`${insight.bg} ${insight.color} p-3 rounded-2xl`}>
              <Lightbulb className="w-6 h-6" />
            </div>
            <div
              className={`flex items-center gap-1 font-bold text-sm ${
                insight.isGood ? "text-green-400" : "text-red-400"
              }`}
            >
              {insight.icon}
              {Math.abs(Number(insight.diff))}%
            </div>
          </div>

          <h3 className="text-lg font-bold mb-1">{insight.title}</h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            {insight.isGood
              ? `¡Excelente! Has reducido el consumo en un ${Math.abs(
                  Number(insight.diff)
                )}% respecto al mes anterior.`
              : `Atención: Tu consumo ha subido. Revisa tus procesos para optimizar el uso de ${insight.title.toLowerCase()}.`}
          </p>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted">
            <AlertCircle className="w-4 h-4 text-primary" />
            Tip de Sostenibilidad
          </div>
        </motion.div>
      ))}
    </div>
  );
};
