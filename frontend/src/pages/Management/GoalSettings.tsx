import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { Target, Save, Loader2, CheckCircle2, Leaf } from "lucide-react";
import {
  UPSERT_GOAL_MUTATION,
  GET_MY_COMPANY_GOALS,
} from "../../graphql/goalQueries";
import { GET_MY_COMPANY } from "../../graphql/companyQueries";
import { Goal } from "../../types";

export const GoalSettings: React.FC = () => {
  const { data, loading: loadingGoals } = useQuery(GET_MY_COMPANY_GOALS);
  const { data: companyData, loading: loadingCompany } =
    useQuery(GET_MY_COMPANY);
  const [upsertGoal, { loading: saving }] = useMutation(UPSERT_GOAL_MUTATION);
  const [success, setSuccess] = useState(false);

  const currentYear = new Date().getFullYear();
  const activeMetrics =
    companyData?.myCompany?.companyMetrics?.filter((cm: any) => cm.isActive) ||
    [];

  const handleSave = async (metricId: string, value: string) => {
    if (!value) return;
    try {
      await upsertGoal({
        variables: {
          data: {
            metricId,
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

  if (loadingGoals || loadingCompany)
    return <Loader2 className="animate-spin" />;

  const goals = data?.myCompanyGoals || [];

  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Metas Anuales ({currentYear})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeMetrics.map((cm: any) => {
          const currentGoal = (goals as Goal[]).find(
            (g: Goal) => g.metricId === cm.metricId && g.year === currentYear
          );
          return (
            <div
              key={cm.id}
              className="card p-4 sm:p-6 bg-white/[0.02] border-white/5"
            >
              <div className="flex items-center gap-2 mb-2">
                {/* Generic icon since we don't map dynamic icons yet */}
                <div
                  className={`p-1.5 rounded-lg bg-white/5 ${
                    cm.metric.color || "text-primary"
                  }`}
                >
                  <Leaf className="w-4 h-4" />
                </div>
                <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider">
                  Objetivo de {cm.metric.name} ({cm.metric.unit})
                </label>
              </div>

              <div className="flex gap-3">
                <input
                  type="number"
                  defaultValue={currentGoal?.target || ""}
                  placeholder="Ej: 500"
                  className="input flex-1"
                  id={`goal-${cm.metricId}`}
                />
                <button
                  onClick={() => {
                    const val = (
                      document.getElementById(
                        `goal-${cm.metricId}`
                      ) as HTMLInputElement
                    ).value;
                    handleSave(cm.metricId, val);
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
        {activeMetrics.length === 0 && (
          <div className="col-span-2 text-center p-8 text-text-secondary border border-dashed border-white/10 rounded-xl">
            No tienes métricas activas para configurar metas.
          </div>
        )}
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
