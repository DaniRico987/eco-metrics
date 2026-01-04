export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  COMPANY_MANAGER: "COMPANY_MANAGER",
  USER: "USER",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const UserStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  REJECTED: "REJECTED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export interface Metric {
  id: string;
  name: string;
  unit: string;
  icon?: string;
  color?: string;
  description?: string;
  emissionFactor: number;
  isActive: boolean;
}

export interface CompanyMetric {
  id: string;
  companyId: string;
  metricId: string;
  metric: Metric;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  companyId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  sector: string;
  employeesCount: number;
  isConfigured: boolean;
  companyMetrics?: CompanyMetric[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ImpactValue {
  id: string;
  amount: number;
  co2Equivalent: number;
  metricId: string;
  metric?: Metric;
}

export interface ImpactRecord {
  id: string;
  month: number;
  year: number;
  totalImpact: number;
  values: ImpactValue[];
  companyId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Goal {
  id: string;
  metricId: string;
  metric?: Metric;
  target: number;
  year: number;
  companyId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthPayload {
  accessToken: string;
  user: User;
}

export interface DashboardData {
  impactRecords: ImpactRecord[];
  myCompany: Company;
  myCompanyGoals: Goal[];
  me: User;
}

export interface UsersByCompanyData {
  usersByCompany: User[];
}
