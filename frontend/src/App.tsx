import { motion } from "framer-motion";
import { Leaf, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-50 py-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Eco<span className="text-primary">Metrics</span>
            </span>
          </div>
          <button className="btn btn-primary">Iniciar Sesión</button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container py-20">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
          >
            Mide y reduce el{" "}
            <span className="gradient-text">impacto ambiental</span> de tu
            empresa.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-secondary mb-10 leading-relaxed"
          >
            Nuestra plataforma te ayuda a rastrear el consumo de energía, agua,
            residuos y transporte, generando reportes automáticos para una
            gestión sostenible y eficiente.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <button className="btn btn-primary px-8 py-3 text-lg">
              Empezar ahora <ArrowRight className="w-5 h-5" />
            </button>
            <button className="btn glass px-8 py-3 text-lg">Saber más</button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <FeatureCard
            icon={<BarChart3 />}
            title="Métricas en Tiempo Real"
            description="Visualiza el consumo de tu empresa con gráficos dinámicos y actualizados."
            delay={0.3}
          />
          <FeatureCard
            icon={<ShieldCheck />}
            title="Datos Seguros"
            description="Tu información está protegida con estándares de seguridad de nivel industrial."
            delay={0.4}
          />
          <FeatureCard
            icon={<Leaf />}
            title="Certificación Eco"
            description="Obtén reportes detallados listos para certificaciones de sostenibilidad."
            delay={0.5}
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card"
    >
      <div className="bg-primary/10 p-3 rounded-xl w-fit mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-text-secondary text-sm">{description}</p>
    </motion.div>
  );
}

export default App;
