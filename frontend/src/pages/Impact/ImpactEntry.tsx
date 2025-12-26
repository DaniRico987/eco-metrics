import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import {
  Zap,
  Droplets,
  Trash2,
  Truck,
  Calendar,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  CREATE_IMPACT_RECORD,
  GET_IMPACT_RECORDS,
} from "../../graphql/impactQueries";

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
];

export const ImpactEntry: React.FC<{ onSuccess: () => void }> = ({
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    energyKwh: 0,
    waterM3: 0,
    wasteKg: 0,
    transportKm: 0,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRecord({
      variables: {
        data: {
          month: Number(formData.month),
          year: Number(formData.year),
          energyKwh: Number(formData.energyKwh),
          waterM3: Number(formData.waterM3),
          wasteKg: Number(formData.wasteKg),
          transportKm: Number(formData.transportKm),
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">
          Nuevo Registro de Impacto
        </h1>
        <p className="text-text-secondary">
          Ingresa los consumos mensuales de tu organización para calcular tu
          huella ambiental.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card grid grid-cols-2 gap-6 p-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricInput
            label="Energía Eléctrica"
            name="energyKwh"
            unit="kWh"
            icon={<Zap />}
            value={formData.energyKwh}
            onChange={handleChange}
            color="text-yellow-400"
          />
          <MetricInput
            label="Consumo de Agua"
            name="waterM3"
            unit="m³"
            icon={<Droplets />}
            value={formData.waterM3}
            onChange={handleChange}
            color="text-blue-400"
          />
          <MetricInput
            label="Residuos Generados"
            name="wasteKg"
            unit="kg"
            icon={<Trash2 />}
            value={formData.wasteKg}
            onChange={handleChange}
            color="text-red-400"
          />
          <MetricInput
            label="Transporte / Logística"
            name="transportKm"
            unit="km"
            icon={<Truck />}
            value={formData.transportKm}
            onChange={handleChange}
            color="text-emerald-400"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 text-sm">
            {error.message}
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="btn btn-primary w-full py-4 text-lg shadow-xl shadow-primary/20 gap-3"
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
  name: string;
  unit: string;
  icon: React.ReactNode;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  color: string;
}

const MetricInput: React.FC<MetricInputProps> = ({
  label,
  name,
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
        name={name}
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
