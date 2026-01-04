import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart,
  Pie,
  ReferenceLine,
} from "recharts";

import React from "react";
import { ImpactRecord, Goal, CompanyMetric } from "../types";

interface ImpactChartsProps {
  records: ImpactRecord[];
  goals: Goal[];
  activeMetrics: CompanyMetric[];
}

export const ImpactCharts: React.FC<ImpactChartsProps> = ({
  records,
  goals,
  activeMetrics,
}) => {
  if (!records || records.length === 0) return null;
  if (!activeMetrics || activeMetrics.length === 0) return null;

  // Prepare data for the history chart (Line Chart)
  const chronodata = [...records]
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    })
    .map((r) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataPoint: any = {
        name: `${r.month}/${r.year}`,
        total: Number(r.totalImpact),
      };
      activeMetrics.forEach((cm) => {
        const val =
          r.values.find((v) => v.metricId === cm.metricId)?.amount || 0;
        dataPoint[cm.metric.name] = val;
      });
      return dataPoint;
    });

  const latest = records[0];

  // Pie data from latest record
  const pieData = activeMetrics
    .map((cm) => {
      const val =
        latest.values.find((v) => v.metricId === cm.metricId)?.amount || 0;
      return {
        name: cm.metric.name,
        value: val,
        color: cm.metric.color || "var(--primary)",
      };
    })
    .filter((d) => d.value > 0);

  // Helper to find specific goal
  const getGoal = (metricId: string) => {
    return goals.find((g) => g.metricId === metricId && g.year === latest.year)
      ?.target;
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color?: string;
      payload?: { color?: string };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-2xl shadow-2xl border-white/10 flex flex-col gap-2 min-w-[120px]">
          {label && (
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted border-b border-white/5 pb-2 mb-1">
              {label}
            </p>
          )}
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                  style={{
                    backgroundColor: entry.color || entry.payload?.color,
                  }}
                />
                <span className="text-[11px] font-bold text-text-secondary uppercase tracking-tight">
                  {entry.name}:
                </span>
              </div>
              <span className="font-black text-white text-xs">
                {Number(entry.value).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 mt-6 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend History Chart */}
        <div className="card p-4 sm:p-6 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Tendencias Históricas</h3>
              <p className="text-xs text-text-secondary">
                Evolución mensual de consumo (Todos los recursos)
              </p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chronodata} style={{ outline: "none" }}>
                <defs>
                  {activeMetrics.map((cm, i) => (
                    <linearGradient
                      key={cm.id}
                      id={`color${i}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={cm.metric.color || "var(--primary)"}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={cm.metric.color || "var(--primary)"}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                {activeMetrics.map((cm, i) => (
                  <Area
                    key={cm.id}
                    type="monotone"
                    dataKey={cm.metric.name}
                    stroke={cm.metric.color || "var(--primary)"}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#color${i})`}
                    activeDot={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="card p-4 sm:p-6 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Distribución de Impacto</h3>
              <p className="text-xs text-text-secondary">
                Balance por categoría (Mes actual)
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="h-[300px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{ outline: "none" }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    isAnimationActive={true}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{ outline: "none" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 w-full md:w-1/2 px-4">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                  <span className="text-sm text-text-secondary font-bold">
                    {Number(item.value).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="card p-4 sm:p-6 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Comparativa de Recursos</h3>
            <p className="text-xs text-text-secondary">
              Visión desagregada de todas las métricas activas
            </p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chronodata} style={{ outline: "none" }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />

              {activeMetrics.map((cm) => {
                const goal = getGoal(cm.metricId);
                return goal ? (
                  <ReferenceLine
                    key={`ref-${cm.id}`}
                    y={Number(goal)}
                    stroke={cm.metric.color || "var(--primary)"}
                    strokeDasharray="5 5"
                    label={{
                      position: "top",
                      value: `Meta ${cm.metric.name}`,
                      fill: cm.metric.color,
                      fontSize: 10,
                    }}
                  />
                ) : null;
              })}

              {activeMetrics.map((cm) => (
                <Bar
                  key={cm.id}
                  dataKey={cm.metric.name}
                  fill={cm.metric.color || "var(--primary)"}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                  activeBar={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
