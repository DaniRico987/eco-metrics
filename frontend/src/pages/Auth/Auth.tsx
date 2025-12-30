import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User as UserIcon,
  Building2,
  Loader2,
  Briefcase,
  Users as UsersIcon,
} from "lucide-react";
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  REGISTER_COMPANY_MUTATION,
  GET_COMPANIES,
} from "../../graphql/authQueries";
import { getReadableErrorMessage } from "../../utils/errorHandler";
import { AuthPayload, Company, User } from "../../types";

interface AuthProps {
  onLoginSuccess: (token: string, user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<"login" | "register" | "company">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    companyId: "",
    companyName: "",
    sector: "",
    employeesCount: 0,
  });

  const { data: companiesData } = useQuery(GET_COMPANIES);

  const handleAuthComplete = (data: {
    login?: AuthPayload;
    register?: AuthPayload;
    registerCompany?: AuthPayload;
  }) => {
    const result = data.login || data.register || data.registerCompany;
    if (result) {
      onLoginSuccess(result.accessToken, result.user);
    }
  };

  const [login, { loading: loginLoading, error: loginErr }] = useMutation(
    LOGIN_MUTATION,
    { onCompleted: handleAuthComplete }
  );
  const [register, { loading: regLoading, error: regErr }] = useMutation(
    REGISTER_MUTATION,
    { onCompleted: handleAuthComplete }
  );
  const [regCompany, { loading: compLoading, error: compErr }] = useMutation(
    REGISTER_COMPANY_MUTATION,
    { onCompleted: handleAuthComplete }
  );

  const error = loginErr || regErr || compErr;
  const loading = loginLoading || regLoading || compLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      await login({
        variables: {
          data: { email: formData.email, password: formData.password },
        },
      });
    } else if (mode === "register") {
      await register({
        variables: {
          data: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            companyId: formData.companyId,
          },
        },
      });
    } else {
      await regCompany({
        variables: {
          data: {
            company: {
              name: formData.companyName,
              sector: formData.sector,
              employeesCount: Number(formData.employeesCount),
            },
            admin: {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            },
          },
        },
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-bg-dark to-bg-surface overflow-y-auto">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-3xl w-full max-w-md shadow-2xl relative my-8"
      >
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 text-center">
            {mode === "login"
              ? "Bienvenido"
              : mode === "register"
              ? "Únete a un equipo"
              : "Crea tu organización"}
          </h2>
          <p className="text-text-secondary text-center mb-8">
            {mode === "login"
              ? "Ingresa para gestionar tu impacto"
              : mode === "register"
              ? "Regístrate para colaborar con tu empresa"
              : "Comienza a medir el impacto de tu empresa hoy"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {(mode === "register" || mode === "company") && (
                <motion.div
                  key="user-fields"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                    <input
                      required
                      name="name"
                      placeholder="Tu nombre completo"
                      className="input pl-10"
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>
              )}

              {mode === "company" && (
                <motion.div
                  key="company-fields"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4 pt-2 border-t border-white/5"
                >
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                    <input
                      required
                      name="companyName"
                      placeholder="Nombre de la empresa"
                      className="input pl-10"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                      <input
                        required
                        name="sector"
                        placeholder="Sector"
                        className="input pl-10"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="relative">
                      <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                      <input
                        required
                        type="number"
                        name="employeesCount"
                        placeholder="Empleados"
                        className="input pl-10"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {mode === "register" && (
                <motion.div
                  key="select-company"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="relative"
                >
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                  <select
                    required
                    name="companyId"
                    className="input pl-10 appearance-none bg-bg-surface-glass"
                    value={formData.companyId}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona tu empresa</option>
                    {companiesData?.companies.map((c: Company) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                required
                type="email"
                name="email"
                placeholder="Correo electrónico"
                className="input pl-10"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                required
                type="password"
                name="password"
                placeholder="Contraseña"
                className="input pl-10"
                onChange={handleChange}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20"
              >
                {getReadableErrorMessage(error)}
              </motion.p>
            )}

            <button
              disabled={loading}
              className="btn btn-primary w-full py-3 text-lg mt-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === "login" ? (
                "Iniciar Sesión"
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>

          <div className="mt-8 space-y-3 pt-6 border-t border-white/5">
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="w-full text-center text-sm text-text-secondary hover:text-primary transition-colors"
            >
              {mode === "login"
                ? "¿No tienes cuenta? Regístrate como empleado"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>

            <button
              onClick={() => setMode(mode === "company" ? "login" : "company")}
              className="w-full text-center text-sm font-bold text-primary hover:underline transition-all"
            >
              {mode === "company"
                ? "Volver"
                : "¿Eres una empresa nueva? Registra tu organización"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
