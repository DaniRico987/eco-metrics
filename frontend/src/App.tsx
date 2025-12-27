import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  LayoutDashboard,
  Users as UsersIcon,
  PlusCircle,
  ChevronRight,
  Menu,
  X,
  FileText,
} from "lucide-react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import { Auth } from "./pages/Auth/Auth";
import { Management } from "./pages/Management/Management";
import { ImpactEntry } from "./pages/Impact/ImpactEntry";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Profile } from "./pages/Profile/Profile";
import { Reports } from "./pages/Reports/Reports";
import { GET_DASHBOARD_DATA } from "./graphql/impactQueries";
import { useQuery } from "@apollo/client";
import { AiChat } from "./components/AiChat";

function App() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState({ type: "", content: "" });

  const navigate = useNavigate();
  const location = useLocation();

  const { data: dashboardData, loading: loadingImpact } = useQuery(
    GET_DASHBOARD_DATA,
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
    navigate("/");
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
      path: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["USER", "COMPANY_MANAGER", "SUPER_ADMIN"],
    },
    {
      path: "/impact",
      label: "Cargar Datos",
      icon: PlusCircle,
      roles: ["USER", "COMPANY_MANAGER"],
    },
    {
      path: "/reports",
      label: "Reportes",
      icon: FileText,
      roles: ["USER", "COMPANY_MANAGER", "SUPER_ADMIN"],
    },
    {
      path: "/management",
      label: "Gestionar Equipo",
      icon: UsersIcon,
      roles: ["COMPANY_MANAGER", "SUPER_ADMIN"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const records = [...(dashboardData?.impactRecords || [])].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  const myCompany = dashboardData?.myCompany;
  const goals = dashboardData?.myCompanyGoals || [];

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
                  <span className="text-xl font-bold tracking-tight text-white">
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
            {filteredMenu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group relative ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                  }`}
                >
                  <item.icon
                    className={`w-6 h-6 shrink-0 ${
                      isActive
                        ? ""
                        : "group-hover:scale-110 transition-transform"
                    }`}
                  />
                  {isSidebarOpen && (
                    <span className="font-semibold">{item.label}</span>
                  )}
                  {isActive && isSidebarOpen && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-bg-surface-glass border border-white/10 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/5 space-y-2">
            <Link
              to="/profile"
              className={`flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group ${
                !isSidebarOpen && "justify-center"
              } ${
                location.pathname === "/profile" ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="bg-primary/20 p-2 rounded-xl text-primary shrink-0">
                <UserIcon className="w-5 h-5" />
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate text-white">
                    {user?.name || "Usuario"}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </Link>

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
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <Dashboard
                    records={records}
                    myCompany={myCompany}
                    goals={goals}
                    loadingImpact={loadingImpact}
                    onAnalyzeMetric={(type, content) => {
                      setChatContext({ type, content });
                      setIsChatOpen(true);
                    }}
                  />
                }
              />
              <Route path="/management" element={<Management />} />
              <Route
                path="/impact"
                element={<ImpactEntry onSuccess={() => navigate("/")} />}
              />
              <Route path="/reports" element={<Reports />} />
              <Route
                path="/profile"
                element={
                  <Profile
                    user={user}
                    company={myCompany}
                    onLogout={handleLogout}
                  />
                }
              />
            </Routes>
          </AnimatePresence>
        </div>
      </main>

      <AiChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        metricType={chatContext.type}
        initialContext={chatContext.content}
      />
    </div>
  );
}

export default App;
