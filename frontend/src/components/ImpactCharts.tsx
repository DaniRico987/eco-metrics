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

interface ImpactChartsProps {
  records: any[];
  goals: any[];
}

export const ImpactCharts: React.FC<ImpactChartsProps> = ({
  records,
  goals,
}) => {
  if (!records || records.length === 0) return null;

  // Get goals for the current year (taking latest record's year as current)
  const currentYear = records[0]?.year;
  const energyGoal = goals.find(
    (g) => g.category === "ENERGY" && g.year === currentYear
  )?.target;
  const waterGoal = goals.find(
    (g) => g.category === "WATER" && g.year === currentYear
  )?.target;

  // Prepare data for the history chart (Line Chart)
  const chronodata = [...records]
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    })
    .map((r) => ({
      name: `${r.month}/${r.year}`,
      energía: Number(r.energyKwh),
      agua: Number(r.waterM3),
      residuos: Number(r.wasteKg),
      total: Number(r.totalImpact),
    }));

  const latest = records[0];
  const pieData = [
    { name: "Energía", value: Number(latest.energyKwh), color: "#fbbf24" },
    { name: "Agua", value: Number(latest.waterM3) * 10, color: "#3b82f6" }, // Scaled for visibility
    { name: "Residuos", value: Number(latest.wasteKg), color: "#ef4444" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-surface border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-sm font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-text-secondary uppercase">
                {entry.name}:
              </span>
              <span className="font-bold text-text-primary">
                {entry.value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend History Chart */}
        <div className="card p-6 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Tendencias Históricas</h3>
              <p className="text-xs text-text-secondary">
                Evolución mensual de consumo energético{" "}
                {energyGoal && `(Meta: ${energyGoal} kWh)`}
              </p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chronodata}>
                <defs>
                  <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
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
                <Tooltip content={<CustomTooltip />} />
                {energyGoal && (
                  <ReferenceLine
                    y={energyGoal}
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    label={{
                      position: "right",
                      value: "Meta",
                      fill: "#ef4444",
                      fontSize: 10,
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="energía"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorImpact)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="card p-6 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Distribución de Impacto</h3>
              <p className="text-xs text-text-secondary">
                Balance por categoría (Mes actual)
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-around h-[300px]">
            <div className="h-full w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
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
                    {item.value.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="card p-6 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold">Comparativa de Recursos</h3>
            <p className="text-xs text-text-secondary">
              Agua vs Energía a través del tiempo
            </p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chronodata}>
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
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
              {waterGoal && (
                <ReferenceLine
                  y={waterGoal}
                  stroke="#3b82f6"
                  strokeDasharray="5 5"
                  label={{
                    position: "top",
                    value: "Meta Agua",
                    fill: "#3b82f6",
                    fontSize: 10,
                  }}
                />
              )}
              <Bar
                dataKey="energía"
                fill="#fbbf24"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="agua"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
