import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { Calendar, Send, Loader2, CheckCircle2, Leaf } from "lucide-react";
import {
  CREATE_IMPACT_RECORD,
  GET_IMPACT_RECORDS,
} from "../../graphql/impactQueries";
import { GET_MY_COMPANY } from "../../graphql/companyQueries";
import { getReadableErrorMessage } from "../../utils/errorHandler";
import { CompanyMetric } from "../../types";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
  "Mes 13 (Ajuste)",
];

export const ImpactEntry: React.FC<{ onSuccess: () => void }> = ({
  onSuccess,
}) => {
  const { data: companyData, loading: loadingConfig } =
    useQuery(GET_MY_COMPANY);

  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [metricValues, setMetricValues] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const [createRecord, { loading, error }] = useMutation(CREATE_IMPACT_RECORD, {
    refetchQueries: [{ query: GET_IMPACT_RECORDS }],
    onCompleted: () => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onSuccess();
      }, 2000);
    },
  });

  const activeMetrics =
    companyData?.myCompany?.companyMetrics?.filter(
      (cm: CompanyMetric) => cm.isActive
    ) || [];

  const handleMetricChange = (metricId: string, value: string) => {
    setMetricValues((prev) => ({
      ...prev,
      [metricId]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const values = activeMetrics.map((cm: CompanyMetric) => ({
      metricId: cm.metricId,
      amount: metricValues[cm.metricId] || 0,
    }));

    await createRecord({
      variables: {
        data: {
          month: Number(formData.month),
          year: Number(formData.year),
          values,
        },
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loadingConfig) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-12 text-center"
      >
        <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-6 text-primary">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold mb-2">¡Registro Guardado!</h2>
        <p className="text-text-secondary">
          Los datos han sido procesados y el dashboard se está actualizando.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">
          Nuevo Registro de Impacto
        </h1>
        <p className="text-text-secondary">
          Ingresa los consumos mensuales de tu organización para las métricas
          configuradas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card grid grid-cols-2 gap-4 p-4 sm:p-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary uppercase">
              Mes
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <select
                name="month"
                className="input pl-10 appearance-none bg-bg-surface-glass"
                value={formData.month}
                onChange={handleChange}
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary uppercase">
              Año
            </label>
            <input
              required
              type="number"
              name="year"
              className="input"
              value={formData.year}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMetrics.map((cm: CompanyMetric) => (
            <MetricInput
              key={cm.id}
              label={cm.metric.name}
              unit={cm.metric.unit}
              value={metricValues[cm.metricId] || 0}
              onChange={(e) => handleMetricChange(cm.metricId, e.target.value)}
              // Dynamic styling could be improved here based on metric type if we add 'type' to backend
              color={cm.metric.color || "text-primary"}
              icon={<Leaf />} // We could map backend icons to Lucide components here
            />
          ))}
          {activeMetrics.length === 0 && (
            <div className="col-span-2 text-center p-8 border border-dashed border-white/10 rounded-2xl text-text-secondary">
              No tienes métricas configuradas. Ve a configuración para activar
              métricas.
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 text-sm">
            {getReadableErrorMessage(error)}
          </div>
        )}

        <button
          disabled={loading || activeMetrics.length === 0}
          type="submit"
          className="btn btn-primary w-full py-4 text-lg shadow-xl shadow-primary/20 gap-3 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <span>Finalizar Registro</span>
              <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

interface MetricInputProps {
  label: string;
  unit: string;
  icon: React.ReactNode;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  color: string;
}

const MetricInput: React.FC<MetricInputProps> = ({
  label,
  unit,
  icon,
  value,
  onChange,
  color,
}) => (
  <div className="card p-6 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>{icon}</div>
      <span className="font-bold">{label}</span>
    </div>
    <div className="relative">
      <input
        required
        type="number"
        step="0.01"
        className="input pr-16 text-2xl font-black"
        value={value}
        onChange={onChange}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">
        {unit}
      </span>
    </div>
  </div>
);
