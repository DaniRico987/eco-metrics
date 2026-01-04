import React from "react";
import { useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { GET_IMPACT_RECORDS } from "../../graphql/impactQueries";
import { GET_MY_COMPANY } from "../../graphql/companyQueries";
import { ImpactRecord, CompanyMetric } from "../../types";

export const Reports: React.FC = () => {
  const { data: recordsData, loading: loadingRecords } =
    useQuery(GET_IMPACT_RECORDS);
  const { data: companyData, loading: loadingCompany } =
    useQuery(GET_MY_COMPANY);

  const records: ImpactRecord[] = recordsData?.myImpactRecords || [];
  const activeMetrics: CompanyMetric[] =
    companyData?.myCompany?.companyMetrics?.filter((cm: any) => cm.isActive) ||
    [];

  const generateCSV = (record: ImpactRecord) => {
    // Headers
    const headers = [
      "Periodo",
      "Impacto Total",
      ...activeMetrics.map((cm) => `${cm.metric.name} (${cm.metric.unit})`),
    ];

    // Data Row
    const row = [
      `${record.month}/${record.year}`,
      record.totalImpact.toFixed(2),
      ...activeMetrics.map((cm) => {
        const val =
          record.values.find((v) => v.metricId === cm.metricId)?.amount || 0;
        return val.toFixed(2);
      }),
    ];

    const csvContent = [headers.join(","), row.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `reporte_impacto_${record.month}_${record.year}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loadingRecords || loadingCompany) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Centro de Documentación
            </span>
          </div>
          <h1 className="text-4xl font-extrabold mb-1">
            Reportes y Exportación
          </h1>
          <p className="text-text-secondary">
            Genera documentos oficiales sobre el impacto ambiental de tu
            empresa.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn glass flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filtrar
          </button>
          <button className="btn btn-primary shadow-lg shadow-primary/20 px-6 py-3 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> Nuevo Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-4 sm:p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Reportes Disponibles
            </h3>
            <div className="space-y-4">
              {records.length === 0 ? (
                <div className="text-center p-8 text-text-secondary">
                  No hay registros de impacto disponibles para generar reportes.
                </div>
              ) : (
                records.map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl shrink-0 bg-green-500/10 text-green-500">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">
                          Reporte Impacto {report.month}/{report.year}
                        </p>
                        <p className="text-xs text-text-muted flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Generado
                          automáticamente
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-3 h-3" /> Listo
                      </span>
                      <button
                        onClick={() => generateCSV(report)}
                        className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-all ml-auto sm:ml-0"
                        title="Descargar CSV"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-4 sm:p-6 bg-primary/5 border-primary/20">
            <h3 className="text-xl font-bold mb-4">Exportación Programada</h3>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Configura el envío automático de reportes mensuales a los correos
              de los directivos.
            </p>
            <button className="btn btn-primary w-full">Configurar Envío</button>
          </div>

          <div className="card p-4 sm:p-6">
            <h3 className="text-xl font-bold mb-4">Formatos Disponibles</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <span className="text-sm font-semibold">CSV / Excel</span>
                <span className="text-xs text-primary font-bold">ACTIVO</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 opacity-50">
                <span className="text-sm font-semibold">PDF (Corporativo)</span>
                <span className="text-xs text-text-muted font-bold">
                  PRÓXIMAMENTE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
