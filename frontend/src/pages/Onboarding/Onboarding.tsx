import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GET_METRICS,
  COMPLETE_ONBOARDING,
  GET_MY_COMPANY,
} from "../../graphql/companyQueries";
import { Metric } from "../../types";
import { Leaf, Check, Loader, Sparkles, Plus } from "lucide-react";
import { CreateMetricWizard } from "../Management/CreateMetricWizard";

export const Onboarding = () => {
  const navigate = useNavigate();
  const [wizardMode, setWizardMode] = useState(false);
  const { data, loading, refetch: refetchMetrics } = useQuery(GET_METRICS);
  const [completeOnboarding, { loading: submitting }] = useMutation(
    COMPLETE_ONBOARDING,
    {
      refetchQueries: [{ query: GET_MY_COMPANY }],
      onCompleted: () => {
        navigate("/");
        window.location.reload(); // Reload to refresh global app state if needed
      },
    }
  );

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const toggleMetric = (id: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      if (selectedMetrics.length === 0) return;
      await completeOnboarding({
        variables: { metricIds: selectedMetrics },
      });
    } catch (error) {
      console.error("Error onboarding:", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dark">
        <Loader className="w-10 h-10 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-dark text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full z-10"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Configuración Inicial</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
            Personaliza tu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
              Impacto
            </span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Selecciona las métricas que son relevantes para tu empresa. Podrás
            agregar más adelante si lo necesitas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {data?.metrics.map((metric: Metric) => {
            const isSelected = selectedMetrics.includes(metric.id);
            return (
              <motion.div
                key={metric.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleMetric(metric.id)}
                className={`
                  relative p-6 rounded-2xl border cursor-pointer transition-all duration-300
                  ${
                    isSelected
                      ? "bg-primary/20 border-primary"
                      : "bg-surface-light/30 border-white/10 hover:border-white/20"
                  }
                  glass
                `}
              >
                <div
                  className={`p-3 rounded-xl w-fit mb-4 transition-colors ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-white/5 text-text-secondary"
                  }`}
                >
                  <Leaf className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold mb-2">{metric.name}</h3>
                <p className="text-sm text-text-secondary">
                  Unidad: {metric.unit}
                </p>

                <div
                  className={`absolute top-4 right-4 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? "bg-primary border-primary" : "border-white/20"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </motion.div>
            );
          })}

          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setWizardMode(true)}
            className="p-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="p-4 bg-primary/20 text-primary rounded-full group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-primary">Nueva Métrica</h3>
              <p className="text-xs text-text-muted">
                Crea una métrica propia con IA
              </p>
            </div>
          </motion.div>
        </div>

        {wizardMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-bg-dark/80 backdrop-blur-sm">
            <div className="max-w-xl w-full">
              <CreateMetricWizard
                onClose={() => setWizardMode(false)}
                onCreated={(id) => {
                  refetchMetrics();
                  setSelectedMetrics((prev) => [...prev, id]);
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={submitting || selectedMetrics.length === 0}
            className={`
              btn btn-primary text-lg px-8 py-3 rounded-xl shadow-xl shadow-primary/20 
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
            `}
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" /> Configurando...
              </>
            ) : (
              <>
                Comenzar <Check className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
