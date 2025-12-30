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

export const GoalCategory = {
  ENERGY: "ENERGY",
  WATER: "WATER",
  WASTE: "WASTE",
  TRANSPORT: "TRANSPORT",
} as const;
export type GoalCategory = (typeof GoalCategory)[keyof typeof GoalCategory];

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
  createdAt?: string;
  updatedAt?: string;
}

export interface ImpactRecord {
  id: string;
  month: number;
  year: number;
  energyKwh: number;
  waterM3: number;
  wasteKg: number;
  transportKm: number;
  totalImpact: number;
  companyId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Goal {
  id: string;
  category: GoalCategory;
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
