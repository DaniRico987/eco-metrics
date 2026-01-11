import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import {
  Settings,
  Plus,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  GET_METRICS,
  GET_MY_COMPANY,
  TOGGLE_METRIC,
  REQUEST_METRIC,
} from "../../graphql/companyQueries";
import { Metric, CompanyMetric } from "../../types";
import { CreateMetricWizard } from "./CreateMetricWizard";
import { useSnackbar } from "../../context/SnackbarContext";
import { getReadableErrorMessage } from "../../utils/errorHandler";

export const MetricSettings: React.FC = () => {
  const { show, error: showError } = useSnackbar();
  const { data: catalogData, loading: loadingCatalog } = useQuery(GET_METRICS);
  const {
    data: companyData,
    loading: loadingCompany,
    refetch: refetchCompany,
  } = useQuery(GET_MY_COMPANY);

  const [toggleMetric, { loading: toggling }] = useMutation(TOGGLE_METRIC, {
    onCompleted: () => refetchCompany(),
  });

  const [requestMetric, { loading: requesting }] = useMutation(REQUEST_METRIC, {
    onCompleted: () => {
      setRequestDescription("");
      show("Solicitud enviada correctamente", "success");
      setRequestMode(false);
    },
  });

  const [requestMode, setRequestMode] = useState(false);
  const [wizardMode, setWizardMode] = useState(false);
  const [requestDescription, setRequestDescription] = useState("");

  if (loadingCatalog || loadingCompany) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const metrics = catalogData?.metrics || [];
  const activeMetricIds =
    companyData?.myCompany?.companyMetrics
      ?.filter((cm: CompanyMetric) => cm.isActive)
      ?.map((cm: CompanyMetric) => cm.metricId) || [];

  const handleToggle = async (metricId: string) => {
    try {
      await toggleMetric({ variables: { metricId } });
    } catch (err) {
      showError(getReadableErrorMessage(err as Error));
    }
  };

  const handleRequest = async () => {
    if (!requestDescription.trim()) return;
    try {
      await requestMetric({ variables: { description: requestDescription } });
    } catch (err) {
      showError(getReadableErrorMessage(err as Error));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold font-display tracking-tight">
            Métricas de la Organización
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setWizardMode(true)}
            className="flex-1 sm:flex-initial btn glass gap-2 border-primary/20 text-primary hover:bg-primary/20 text-xs sm:text-sm py-2 px-3 sm:px-4"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Nueva Propia</span>
          </button>
          <button
            onClick={() => setRequestMode(!requestMode)}
            className="flex-1 sm:flex-initial btn glass gap-2 border-white/10 text-text-secondary hover:bg-white/5 text-xs sm:text-sm py-2 px-3 sm:px-4"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Solicitar</span>
          </button>
        </div>
      </div>

      {wizardMode && (
        <CreateMetricWizard onClose={() => setWizardMode(false)} />
      )}

      {requestMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-primary/5 border-primary/20 p-6 space-y-4"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-bold">
                ¿Necesitas una métrica personalizada?
              </h3>
              <p className="text-sm text-text-secondary">
                Describe la métrica que te gustaría medir (ej: Huella Hídrica de
                Producto, Alcance 3 de Viajes). Nuestro equipo de sostenibilidad
                la validará y la añadirá al catálogo.
              </p>
            </div>
          </div>
          <textarea
            className="input min-h-[100px] bg-bg-dark/50"
            placeholder="Describe aquí tu necesidad..."
            value={requestDescription}
            onChange={(e) => setRequestDescription(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setRequestMode(false)} className="btn glass">
              Cancelar
            </button>
            <button
              disabled={requesting || !requestDescription.trim()}
              onClick={handleRequest}
              className="btn btn-primary px-8 gap-2"
            >
              {requesting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Enviar Solicitud</span>
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric: Metric) => {
          const isActive = activeMetricIds.includes(metric.id);
          return (
            <div
              key={metric.id}
              className={`card p-6 border-2 transition-all cursor-pointer group ${
                isActive
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:border-white/10 grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
              }`}
              onClick={() => !toggling && handleToggle(metric.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-white/5 text-text-muted"
                  }`}
                >
                  {(() => {
                    const Icon =
                      (LucideIcons as any)[metric.icon || "Leaf"] ||
                      LucideIcons.Leaf;
                    return <Icon />;
                  })()}
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-primary border-primary text-white"
                      : "border-white/20"
                  }`}
                >
                  {isActive && <Check className="w-4 h-4" />}
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1">{metric.name}</h3>
              <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                {metric.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Unidad: {metric.unit}
                </span>
                {toggling && (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
