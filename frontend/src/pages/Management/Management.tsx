import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Users as UsersIcon,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Mail,
  Calendar,
} from "lucide-react";
import { getReadableErrorMessage } from "../../utils/errorHandler";
import {
  GET_USERS_BY_COMPANY,
  APPROVE_USER_MUTATION,
  REJECT_USER_MUTATION,
} from "../../graphql/userQueries";
import { GoalSettings } from "./GoalSettings";
import { MetricSettings } from "./MetricSettings";
import { User, UsersByCompanyData, UserStatus } from "../../types";

export const Management: React.FC = () => {
  const { data, loading, error, refetch } =
    useQuery<UsersByCompanyData>(GET_USERS_BY_COMPANY);

  const [approveUser, { loading: approving }] = useMutation(
    APPROVE_USER_MUTATION,
    {
      onCompleted: () => refetch(),
    }
  );

  const [rejectUser, { loading: rejecting }] = useMutation(
    REJECT_USER_MUTATION,
    {
      onCompleted: () => refetch(),
    }
  );

  const handleApprove = async (userId: string) => {
    await approveUser({ variables: { userId } });
  };

  const handleReject = async (userId: string) => {
    await rejectUser({ variables: { userId } });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-500/20 bg-red-500/5 p-8 text-center">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-400 mb-2">
          Error al cargar usuarios
        </h3>
        <p className="text-text-secondary">{getReadableErrorMessage(error)}</p>
        <button onClick={() => refetch()} className="btn glass mt-6">
          Reintentar
        </button>
      </div>
    );
  }

  const users = data?.usersByCompany || [];
  const pending = users.filter((u: User) => u.status === UserStatus.PENDING);
  const active = users.filter((u: User) => u.status === UserStatus.ACTIVE);
  const rejected = users.filter((u: User) => u.status === UserStatus.REJECTED);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold mb-2">Gestión de Equipo</h1>
        <p className="text-text-secondary">
          Administra los accesos y roles de los miembros de tu organización.
        </p>
      </div>

      {pending.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 text-amber-400">
            <Clock className="w-5 h-5" />
            <h2 className="text-xl font-bold">Solicitudes Pendientes</h2>
            <span className="bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold">
              {pending.length}
            </span>
          </div>
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {pending.map((user: User) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  processing={approving || rejecting}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-2 mb-4 text-primary">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="text-xl font-bold">Miembros Activos</h2>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
            {active.length}
          </span>
        </div>
        <div className="grid gap-4">
          {active.map((user: User) => (
            <UserRow key={user.id} user={user} readonly />
          ))}
          {active.length === 0 && (
            <div className="card bg-white/[0.02] border-dashed py-12 text-center text-text-muted">
              No hay otros miembros activos aún.
            </div>
          )}
        </div>
      </section>

      {rejected.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-xl font-bold">Solicitudes Rechazadas</h2>
          </div>
          <div className="grid gap-4 opacity-70">
            {rejected.map((user: User) => (
              <UserRow key={user.id} user={user} onApprove={handleApprove} />
            ))}
          </div>
        </section>
      )}

      <hr className="border-white/5" />
      <MetricSettings />
      <hr className="border-white/5" />
      <GoalSettings />
    </div>
  );
};

interface UserRowProps {
  user: User;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  readonly?: boolean;
  processing?: boolean;
}

const UserRow: React.FC<UserRowProps> = ({
  user,
  onApprove,
  onReject,
  readonly,
  processing,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3 px-4"
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-full ${
            user.status === "ACTIVE"
              ? "bg-primary/10 text-primary"
              : user.status === "PENDING"
              ? "bg-amber-400/10 text-amber-400"
              : "bg-red-400/10 text-red-400"
          }`}
        >
          <UsersIcon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-lg">{user.name}</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" /> {user.email}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />{" "}
              {new Date(Number(user.createdAt)).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {!readonly && (
        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          {onApprove && user.status !== "ACTIVE" && (
            <button
              disabled={processing}
              onClick={() => onApprove(user.id)}
              className="btn btn-primary flex-1 sm:flex-initial py-2 px-4 gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Aprobar</span>
            </button>
          )}
          {onReject && user.status === "PENDING" && (
            <button
              disabled={processing}
              onClick={() => onReject(user.id)}
              className="btn glass hover:bg-red-500/20 hover:text-red-400 flex-1 sm:flex-initial py-2 px-4 gap-2 border-none"
            >
              <X className="w-4 h-4" />
              <span>Rechazar</span>
            </button>
          )}
        </div>
      )}

      {readonly && (
        <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {user.role}
        </div>
      )}
    </motion.div>
  );
};
