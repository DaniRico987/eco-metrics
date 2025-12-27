import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { Target, Save, Loader2, CheckCircle2 } from "lucide-react";
import {
  UPSERT_GOAL_MUTATION,
  GET_MY_COMPANY_GOALS,
} from "../../graphql/goalQueries";

export const GoalSettings: React.FC = () => {
  const { data, loading: loadingGoals } = useQuery(GET_MY_COMPANY_GOALS);
  const [upsertGoal, { loading: saving }] = useMutation(UPSERT_GOAL_MUTATION);
  const [success, setSuccess] = useState(false);

  const currentYear = new Date().getFullYear();
  const categories = [
    { key: "ENERGY", label: "Energía (kWh)", color: "text-amber-400" },
    { key: "WATER", label: "Agua (m³)", color: "text-blue-400" },
    { key: "WASTE", label: "Residuos (kg)", color: "text-emerald-400" },
    { key: "TRANSPORT", label: "Transporte (km)", color: "text-purple-400" },
  ];

  const handleSave = async (category: string, value: string) => {
    if (!value) return;
    try {
      await upsertGoal({
        variables: {
          data: {
            category,
            target: parseFloat(value),
            year: currentYear,
          },
        },
        refetchQueries: [{ query: GET_MY_COMPANY_GOALS }],
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  if (loadingGoals) return <Loader2 className="animate-spin" />;

  const goals = data?.myCompanyGoals || [];

  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Metas Anuales ({currentYear})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const currentGoal = goals.find((g: any) => g.category === cat.key);
          return (
            <div
              key={cat.key}
              className="card p-4 sm:p-6 bg-white/[0.02] border-white/5"
            >
              <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">
                Objetivo de {cat.label}
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  defaultValue={currentGoal?.target || ""}
                  placeholder="Ej: 500"
                  className="input flex-1"
                  id={`goal-${cat.key}`}
                />
                <button
                  onClick={() => {
                    const val = (
                      document.getElementById(
                        `goal-${cat.key}`
                      ) as HTMLInputElement
                    ).value;
                    handleSave(cat.key, val);
                  }}
                  disabled={saving}
                  className="btn btn-primary px-4"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 z-50"
        >
          <CheckCircle2 className="w-5 h-5" />
          Metas actualizadas correctamente
        </motion.div>
      )}
    </section>
  );
};
