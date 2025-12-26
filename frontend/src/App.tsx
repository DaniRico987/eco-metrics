import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  BarChart3,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  LayoutDashboard,
  Users as UsersIcon,
  PlusCircle,
  ChevronRight,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { Auth } from "./pages/Auth/Auth";
import { Management } from "./pages/Management/Management";
import { ImpactEntry } from "./pages/Impact/ImpactEntry";
import { GET_IMPACT_RECORDS } from "./graphql/impactQueries";
import { useQuery } from "@apollo/client";

function App() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "management" | "impact"
  >("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { data: impactData, loading: loadingImpact } = useQuery(
    GET_IMPACT_RECORDS,
    {
      skip: !token || user?.status === "PENDING",
    }
  );

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  if (!token) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  if (user?.status === "PENDING") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg-dark">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-3xl max-w-md text-center"
        >
          <div className="bg-primary/10 p-5 rounded-full w-fit mx-auto mb-6 text-primary">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Solicitud Enviada</h2>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Tu solicitud de acceso a la organización está siendo procesada. El
            administrador de tu empresa debe aprobar tu ingreso antes de que
            puedas ver los datos.
          </p>
          <button onClick={handleLogout} className="btn glass w-full py-3">
            Cerrar Sesión
          </button>
        </motion.div>
      </div>
    );
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["USER", "COMPANY_MANAGER", "SUPER_ADMIN"],
    },
    {
      id: "impact",
      label: "Cargar Datos",
      icon: PlusCircle,
      roles: ["USER", "COMPANY_MANAGER"],
    },
    {
      id: "management",
      label: "Gestionar Equipo",
      icon: UsersIcon,
      roles: ["COMPANY_MANAGER", "SUPER_ADMIN"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const records = impactData?.impactRecords || [];
  const latestRecord = records[0];
  const previousRecord = records[1];

  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return "0%";
    const diff = ((current - previous) / previous) * 100;
    return `${diff > 0 ? "+" : ""}${diff.toFixed(0)}%`;
  };

  return (
    <div className="min-h-screen flex bg-bg-dark text-text-primary">
      {/* Sidebar */}
      <aside
        className={`glass border-none h-screen sticky top-0 transition-all duration-300 z-50 ${
          isSidebarOpen ? "w-72" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-10 px-2">
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2"
                >
                  <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
                    <Leaf className="text-white w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">
                    Eco<span className="text-primary">Metrics</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {filteredMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group relative ${
                  activeTab === item.id
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                }`}
              >
                <item.icon
                  className={`w-6 h-6 shrink-0 ${
                    activeTab === item.id
                      ? ""
                      : "group-hover:scale-110 transition-transform"
                  }`}
                />
                {isSidebarOpen && (
                  <span className="font-semibold">{item.label}</span>
                )}
                {activeTab === item.id && isSidebarOpen && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-bg-surface-glass border border-white/10 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/5 space-y-2">
            <div
              className={`flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 ${
                !isSidebarOpen && "justify-center"
              }`}
            >
              <div className="bg-primary/20 p-2 rounded-xl text-primary shrink-0">
                <UserIcon className="w-5 h-5" />
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate">
                    {user?.name || "Usuario"}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-4 p-3 rounded-2xl text-red-400 hover:bg-red-400/10 transition-colors ${
                !isSidebarOpen && "justify-center"
              }`}
            >
              <LogOut className="w-6 h-6 shrink-0" />
              {isSidebarOpen && (
                <span className="font-semibold">Cerrar Sesión</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-8 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="text-sm font-bold uppercase tracking-wider">
                        Dashboard Corporativo
                      </span>
                    </div>
                    <h1 className="text-4xl font-extrabold mb-1">
                      Panel de Control
                    </h1>
                    <p className="text-text-secondary">
                      Monitorea el impacto ambiental de tu organización.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("impact")}
                    className="btn btn-primary shadow-lg shadow-primary/20 px-6 py-3"
                  >
                    + Nuevo Registro
                  </button>
                </div>

                {loadingImpact ? (
                  <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : records.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <StatCard
                        title="Impacto Total"
                        value={`${Number(latestRecord.totalImpact).toFixed(
                          1
                        )} ptos`}
                        color="var(--primary)"
                        trend={calculateTrend(
                          Number(latestRecord.totalImpact),
                          Number(previousRecord?.totalImpact)
                        )}
                      />
                      <StatCard
                        title="Energía"
                        value={`${latestRecord.energyKwh} kWh`}
                        color="#fbbf24"
                        trend={calculateTrend(
                          latestRecord.energyKwh,
                          previousRecord?.energyKwh
                        )}
                      />
                      <StatCard
                        title="Agua"
                        value={`${latestRecord.waterM3} m³`}
                        color="#3b82f6"
                        trend={calculateTrend(
                          latestRecord.waterM3,
                          previousRecord?.waterM3
                        )}
                      />
                      <StatCard
                        title="Residuos"
                        value={`${latestRecord.wasteKg} kg`}
                        color="#ef4444"
                        trend={calculateTrend(
                          latestRecord.wasteKg,
                          previousRecord?.wasteKg
                        )}
                      />
                    </div>

                    <div className="card mt-8 p-8">
                      <h3 className="text-xl font-bold mb-6">
                        Historial Reciente
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="border-b border-white/5">
                            <tr className="text-text-secondary text-sm font-bold uppercase tracking-wider">
                              <th className="pb-4 px-4 font-bold">Periodo</th>
                              <th className="pb-4 px-4 font-bold">Energía</th>
                              <th className="pb-4 px-4 font-bold">Agua</th>
                              <th className="pb-4 px-4 font-bold">Residuos</th>
                              <th className="pb-4 px-4 font-bold">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {records.map((r: any) => (
                              <tr
                                key={r.id}
                                className="hover:bg-white/[0.02] transition-colors"
                              >
                                <td className="py-4 px-4 font-semibold">
                                  {r.month}/{r.year}
                                </td>
                                <td className="py-4 px-4 text-text-secondary">
                                  {r.energyKwh} kWh
                                </td>
                                <td className="py-4 px-4 text-text-secondary">
                                  {r.waterM3} m³
                                </td>
                                <td className="py-4 px-4 text-text-secondary">
                                  {r.wasteKg} kg
                                </td>
                                <td className="py-4 px-4">
                                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-black">
                                    {Number(r.totalImpact).toFixed(1)} ptos
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="card mt-8 p-12 border-dashed flex flex-col items-center justify-center text-center bg-white/[0.02]">
                    <div className="bg-white/5 p-4 rounded-full mb-4">
                      <BarChart3 className="w-10 h-10 text-text-muted" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      No hay registros suficientes
                    </h3>
                    <p className="text-text-secondary max-w-sm mx-auto">
                      Empieza a registrar el impacto mensual para visualizar
                      comparativas, tendencias y estadísticas detalladas.
                    </p>
                    <button
                      onClick={() => setActiveTab("impact")}
                      className="btn glass mt-8 px-6"
                    >
                      Empezar ahora
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "management" && (
              <motion.div
                key="management"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Management />
              </motion.div>
            )}

            {activeTab === "impact" && (
              <motion.div
                key="impact"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ImpactEntry onSuccess={() => setActiveTab("dashboard")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color, trend }: any) {
  return (
    <div className="card relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-300">
      <div
        className="absolute bottom-0 left-0 w-full h-1 transition-all duration-500 group-hover:h-2 opacity-50"
        style={{ backgroundColor: color }}
      />
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-semibold text-text-secondary uppercase tracking-tight">
          {title}
        </p>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            trend.startsWith("-")
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {trend}
        </span>
      </div>
      <h4 className="text-3xl font-extrabold">{value}</h4>
    </div>
  );
}

export default App;
