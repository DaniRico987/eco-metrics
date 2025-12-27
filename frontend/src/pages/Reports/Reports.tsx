import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const Reports: React.FC = () => {
  const reports = [
    {
      id: 1,
      name: "Reporte Sostenibilidad Diciembre",
      date: "27/12/2025",
      type: "PDF",
      status: "Listo",
    },
    {
      id: 2,
      name: "Análisis Hídrico Q4",
      date: "15/12/2025",
      type: "Excel",
      status: "Listo",
    },
    {
      id: 3,
      name: "Consumo Energético Anual",
      date: "01/12/2025",
      type: "PDF",
      status: "Listo",
    },
    {
      id: 4,
      name: "Huella de Carbono Mensual",
      date: "28/11/2025",
      type: "JSON",
      status: "Listo",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
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
            <PlusCircleIcon className="w-5 h-5" /> Nuevo Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Reportes Recientes
            </h3>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        report.type === "PDF"
                          ? "bg-red-500/10 text-red-500"
                          : report.type === "Excel"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      {report.type === "PDF" ? (
                        <FileText className="w-6 h-6" />
                      ) : report.type === "Excel" ? (
                        <FileSpreadsheet className="w-6 h-6" />
                      ) : (
                        <FileJson className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold">{report.name}</p>
                      <p className="text-xs text-text-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {report.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                      <CheckCircle2 className="w-3 h-3" /> {report.status}
                    </span>
                    <button className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-all">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-8 bg-primary/5 border-primary/20">
            <h3 className="text-xl font-bold mb-4">Exportación Programada</h3>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Configura el envío automático de reportes mensuales a los correos
              de los directivos.
            </p>
            <button className="btn btn-primary w-full">Configurar Envío</button>
          </div>

          <div className="card p-8">
            <h3 className="text-xl font-bold mb-4">Formatos Disponibles</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <span className="text-sm font-semibold">PDF (Premium)</span>
                <span className="text-xs text-primary font-bold">ACTIVO</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 opacity-50">
                <span className="text-sm font-semibold">Excel/CSV</span>
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

function PlusCircleIcon({ className }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}
