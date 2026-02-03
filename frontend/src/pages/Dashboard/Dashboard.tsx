import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Activity,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Loader2,
  MoreVertical,
  Download,
  FileSpreadsheet,
  FileText,
  Settings,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { EcoInsights } from "../../components/EcoInsights";
import { ImpactPulse } from "../../components/ImpactPulse";
import { ImpactCharts } from "../../components/ImpactCharts";
import { useNavigate, Link } from "react-router-dom";
import { ImpactRecord, Company, Goal } from "../../types";

interface DashboardProps {
  records: ImpactRecord[];
  myCompany: Company | null;
  goals: Goal[];
  loadingImpact: boolean;
  onAnalyzeMetric: (type: string, content: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  records,
  myCompany,
  goals,
  loadingImpact,
  onAnalyzeMetric,
}) => {
  const navigate = useNavigate();
  const latestRecord = records[0];
  const previousRecord = records[1];

  const activeMetrics =
    myCompany?.companyMetrics?.filter((cm) => cm.isActive) || [];

  const calculateTrend = (metricId: string) => {
    if (!previousRecord) return "+0%";

    const currentVal =
      latestRecord?.values.find((v) => v.metricId === metricId)?.amount || 0;
    const prevVal =
      previousRecord?.values.find((v) => v.metricId === metricId)?.amount || 0;

    if (prevVal === 0) return "0%";
    const diff = ((currentVal - prevVal) / prevVal) * 100;
    return `${diff > 0 ? "+" : ""}${diff.toFixed(0)}%`;
  };

  const getMetricValue = (
    record: ImpactRecord | undefined,
    metricId: string,
  ) => {
    return record?.values.find((v) => v.metricId === metricId)?.amount || 0;
  };

  if (loadingImpact) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Dashboard Corporativo
            </span>
          </div>
          <h1 className="text-4xl font-extrabold mb-1">Panel de Control</h1>
          <p className="text-text-secondary">
            Monitorea el impacto ambiental de tu organización.
          </p>
        </div>
        <button
          onClick={() => navigate("/impact")}
          className="btn btn-primary shadow-lg shadow-primary/20 px-6 py-3"
        >
          + Nuevo Registro
        </button>
      </div>

      {myCompany && !myCompany.isConfigured && (
        <div className="mb-8 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-500">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Configuración Pendiente
              </h3>
              <p className="text-text-secondary">
                Tu empresa aún no ha seleccionado las métricas de impacto.
                Configúralas para comenzar a medir.
              </p>
            </div>
          </div>
          <Link
            to="/onboarding"
            className="btn bg-yellow-500 hover:bg-yellow-400 text-black font-bold whitespace-nowrap px-6 py-3 rounded-xl"
          >
            Configurar Métricas
          </Link>
        </div>
      )}

      {records.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Impacto Total"
              value={`${Number(latestRecord.totalImpact).toFixed(1)} ptos`}
              color="var(--primary)"
              icon={Activity}
              trend={(() => {
                if (!previousRecord) return "0%";
                const current = Number(latestRecord.totalImpact);
                const prev = Number(previousRecord.totalImpact);
                if (prev === 0) return "0%";
                const diff = ((current - prev) / prev) * 100;
                return `${diff > 0 ? "+" : ""}${diff.toFixed(0)}%`;
              })()}
            />

            {activeMetrics.map((cm) => {
              const Icon =
                (LucideIcons as any)[cm.metric.icon || "Activity"] ||
                LucideIcons.Activity;
              return (
                <StatCard
                  key={cm.id}
                  title={cm.metric.name}
                  value={`${getMetricValue(latestRecord, cm.metricId)} ${
                    cm.metric.unit
                  }`}
                  color={cm.metric.color || "var(--primary)"}
                  icon={Icon}
                  trend={calculateTrend(cm.metricId)}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EcoInsights
                records={records}
                company={myCompany}
                goals={goals}
                onAnalyzeMetric={onAnalyzeMetric}
              />
            </div>
            <div className="lg:col-span-1 h-full">
              <ImpactPulse
                score={Math.max(
                  0,
                  Math.min(100, 100 - Number(latestRecord.totalImpact) * 2),
                )}
              />
            </div>
          </div>

          <ImpactCharts
            records={records}
            goals={goals}
            activeMetrics={activeMetrics}
          />

          <div className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold">Historial de Impacto</h3>
              </div>
              <div className="relative group">
                <button className="p-2 hover:bg-white/5 rounded-xl transition-all">
                  <MoreVertical className="w-5 h-5 text-text-muted" />
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-50">
                  <div className="w-48 glass rounded-2xl shadow-2xl overflow-hidden p-2 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-bold transition-all text-left">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      Exportar CSV
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-bold transition-all text-left">
                      <Download className="w-4 h-4 text-primary" />
                      Descargar PDF
                    </button>
                    <div className="h-px bg-white/5 my-1" />
                    <button
                      onClick={() => navigate("/reports")}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-bold transition-all text-left"
                    >
                      <FileText className="w-4 h-4 text-blue-400" />
                      Ver Reportes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-white/5">
                  <tr className="text-text-secondary text-sm font-bold uppercase tracking-wider">
                    <th className="pb-4 px-4">Periodo</th>
                    {activeMetrics.map((cm) => (
                      <th key={cm.id} className="pb-4 px-4 text-center">
                        {cm.metric.name}
                      </th>
                    ))}
                    <th className="pb-4 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.map((r: ImpactRecord) => (
                    <tr
                      key={r.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-4 px-4 font-semibold">
                        {r.month}/{r.year}
                      </td>
                      {activeMetrics.map((cm) => (
                        <td
                          key={cm.id}
                          className="py-4 px-4 text-text-secondary text-center"
                        >
                          {getMetricValue(r, cm.metricId)} {cm.metric.unit}
                        </td>
                      ))}
                      <td className="py-4 px-4 text-right">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-black group-hover:scale-110 inline-block transition-transform">
                          {Number(r.totalImpact).toFixed(1)} ptos
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mt-8 p-12 border-dashed flex flex-col items-center justify-center text-center bg-white/[0.02]">
          <div className="bg-white/5 p-4 rounded-full mb-4">
            <BarChart3 className="w-10 h-10 text-text-muted" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            No hay registros suficientes
          </h3>
          <p className="text-text-secondary max-w-sm mx-auto">
            Empieza a registrar el impacto mensual para visualizar comparativas,
            tendencias y estadísticas detalladas.
          </p>
          <button
            onClick={() => navigate("/impact")}
            className="btn glass mt-8 px-6"
          >
            Empezar ahora
          </button>
        </div>
      )}
    </motion.div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  color: string;
  trend: string;
  icon: React.ElementType;
}

function StatCard({ title, value, color, trend, icon: Icon }: StatCardProps) {
  const isReduction = trend.startsWith("-");
  return (
    <div className="card relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-300">
      <div
        className="absolute bottom-0 left-0 w-full h-1 transition-all duration-500 group-hover:h-2 opacity-50"
        style={{ backgroundColor: color }}
      />
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className="p-2 rounded-lg bg-white/5 transition-colors group-hover:bg-white/10"
              style={{ color }}
            >
              <Icon className="w-4 h-4" />
            </div>
          )}
          <p className="text-sm font-semibold text-text-secondary uppercase tracking-tight">
            {title}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 mt-1">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isReduction
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {isReduction ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <TrendingUp className="w-3 h-3" />
            )}
            {trend}
          </span>
        </div>
      </div>
      <h4 className="text-3xl font-extrabold">{value}</h4>
    </div>
  );
}
