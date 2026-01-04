import React, { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Save,
  X,
  Info,
} from "lucide-react";
import { SUGGEST_METRIC_DETAILS } from "../../graphql/aiQueries";
import {
  CREATE_METRIC,
  GET_METRICS,
  GET_MY_COMPANY,
} from "../../graphql/companyQueries";

interface CreateMetricWizardProps {
  onClose: () => void;
  onCreated?: (id: string) => void;
}

export const CreateMetricWizard: React.FC<CreateMetricWizardProps> = ({
  onClose,
  onCreated,
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [factor, setFactor] = useState(0);

  const [getSuggestions, { data: aiData, loading: aiLoading }] = useLazyQuery(
    SUGGEST_METRIC_DETAILS
  );
  const [createMetric, { loading: creating }] = useMutation(CREATE_METRIC, {
    refetchQueries: [{ query: GET_METRICS }, { query: GET_MY_COMPANY }],
    onCompleted: (data) => {
      if (onCreated && data?.createMetric?.id) {
        onCreated(data.createMetric.id);
      }
      onClose();
    },
  });

  const handleNext = async () => {
    if (step === 1 && name) {
      const { data } = await getSuggestions({
        variables: { metricName: name },
      });
      if (data?.suggestMetricDetails) {
        setUnit(data.suggestMetricDetails.units[0] || "");
        setDescription(data.suggestMetricDetails.description);
        setFactor(data.suggestMetricDetails.emissionFactor);
      }
      setStep(2);
    }
  };

  const handleSave = async () => {
    await createMetric({
      variables: {
        input: {
          name,
          unit,
          description,
          icon: "Leaf",
          color: "#4ADE80",
          emissionFactor: Number(factor),
        },
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card bg-bg-dark border-primary/20 p-8 space-y-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-2">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-text-muted" />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Asistente de Nueva Métrica</h3>
          <p className="text-sm text-text-secondary">
            La IA te ayudará a configurar los detalles técnicos.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-muted uppercase">
                ¿Qué quieres medir?
              </label>
              <input
                autoFocus
                type="text"
                placeholder="Ej: Harina de Trigo, Empleados, Viajes en Uber..."
                className="input text-lg py-6"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button
              disabled={!name.trim() || aiLoading}
              onClick={handleNext}
              className="btn btn-primary w-full py-4 gap-2"
            >
              {aiLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              <span>Siguiente</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-muted uppercase">
                  Unidad
                </label>
                <div className="space-y-2">
                  <select
                    className="input"
                    value={
                      unit === "" ||
                      aiData?.suggestMetricDetails?.units.includes(unit)
                        ? unit
                        : "other"
                    }
                    onChange={(e) => {
                      if (e.target.value === "other") {
                        setUnit("");
                      } else {
                        setUnit(e.target.value);
                      }
                    }}
                  >
                    {aiData?.suggestMetricDetails?.units.map((u: string) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                    <option value="other">Otra (Escribir manual)...</option>
                  </select>

                  {(unit === "" ||
                    !aiData?.suggestMetricDetails?.units.includes(unit)) && (
                    <motion.input
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="text"
                      className="input py-2 text-sm"
                      placeholder="Escribe la unidad (ej: bultos, cajas...)"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-muted uppercase flex items-center gap-2">
                  Factor de Emisión
                  <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> IA Validado
                  </span>
                </label>
                <div className="relative group">
                  <input
                    readOnly
                    type="number"
                    className="input bg-white/5 cursor-not-allowed opacity-80"
                    value={factor}
                  />
                  <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-64 p-3 bg-bg-dark border border-white/10 rounded-xl text-xs text-text-secondary shadow-2xl z-50">
                    El factor de emisión es calculado por nuestra IA basado en
                    estándares internacionales (GHG Protocol) para garantizar la
                    precisión de tu reporte.
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-muted uppercase flex items-center justify-between">
                <span>Descripción Suggested</span>
                <Info className="w-4 h-4 text-primary" />
              </label>
              <textarea
                className="input min-h-[80px] bg-bg-dark/50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn glass gap-2">
                <ChevronLeft className="w-4 h-4" />
                Atrás
              </button>
              <button
                disabled={creating}
                onClick={handleSave}
                className="btn btn-primary flex-1 gap-2"
              >
                {creating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>Guardar Métrica</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
