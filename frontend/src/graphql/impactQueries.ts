import { gql } from "@apollo/client";

export const CREATE_IMPACT_RECORD = gql`
  mutation CreateImpactRecord($data: CreateImpactRecordInput!) {
    createImpactRecord(data: $data) {
      id
      month
      year
      totalImpact
    }
  }
`;

export const GET_IMPACT_RECORDS = gql`
  query GetImpactRecords {
    impactRecords {
      id
      month
      year
      energyKwh
      waterM3
      wasteKg
      transportKm
      totalImpact
      createdAt
    }
  }
`;

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    impactRecords {
      id
      month
      year
      energyKwh
      waterM3
      wasteKg
      transportKm
      totalImpact
      createdAt
    }
    myCompany {
      id
      name
      sector
      employeesCount
    }
    myCompanyGoals {
      id
      category
      target
      year
    }
  }
`;
