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
      totalImpact
      values {
        id
        metricId
        amount
        co2Equivalent
        metric {
          name
          unit
        }
      }
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
      totalImpact
      values {
        id
        metricId
        amount
        co2Equivalent
        metric {
          id
          name
          unit
          color
          icon
        }
      }
      createdAt
    }
    myCompany {
      id
      name
      sector
      employeesCount
      isConfigured
      createdAt
      companyMetrics {
        id
        metricId
        metric {
          id
          name
          unit
          color
          icon
        }
        isActive
      }
    }
    myCompanyGoals {
      id
      metricId
      metric {
        id
        name
        unit
      }
      target
      year
    }
    me {
      id
      name
      email
      role
      status
    }
  }
`;
