import React from "react";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  Shield,
  Building,
  Edit2,
  LogOut,
} from "lucide-react";

import { User as UserType, Company } from "../../types";

interface ProfileProps {
  user: UserType | null;
  company: Company | null;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  user,
  company,
  onLogout,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-primary/10 p-4 rounded-3xl text-primary">
          <UserIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold">Mi Perfil</h1>
          <p className="text-text-secondary text-lg">
            Gestiona tu información personal y de cuenta.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="card p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Información Personal</h3>
              <button className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/5 p-3 rounded-xl text-text-muted">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Nombre Completo
                  </p>
                  <p className="text-lg font-semibold">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/5 p-3 rounded-xl text-text-muted">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Correo Electrónico
                  </p>
                  <p className="text-lg font-semibold">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/5 p-3 rounded-xl text-text-muted">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Rol en la Organización
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4 sm:p-6 border-dashed border-primary/20 bg-primary/5">
            <h3 className="text-xl font-bold mb-4">Seguridad</h3>
            <p className="text-text-secondary mb-6">
              Manten tu cuenta protegida cambiando tu contraseña regularmente o
              activando la autenticación de dos factores.
            </p>
            <button className="btn btn-primary px-6">Cambiar Contraseña</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-4 sm:p-6 text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-bg-dark">
              <Building className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-1">
              {company?.name || "Tu Empresa"}
            </h3>
            <p className="text-text-muted text-sm mb-6 uppercase tracking-widest font-black">
              Organización
            </p>
            <div className="pt-6 border-t border-white/5">
              <p className="text-text-secondary text-sm mb-4">
                Miembro activo desde{" "}
                {company?.createdAt
                  ? new Date(company.createdAt).toLocaleDateString("es-ES", {
                      month: "long",
                      year: "numeric",
                    })
                  : "fecha desconocida"}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </motion.div>
  );
};
