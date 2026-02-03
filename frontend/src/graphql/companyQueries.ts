import { gql } from "@apollo/client";

export const COMPLETE_ONBOARDING = gql`
  mutation CompleteOnboarding($metricIds: [String!]!) {
    completeOnboarding(metricIds: $metricIds) {
      id
      isConfigured
    }
  }
`;

export const GET_MY_COMPANY = gql`
  query GetMyCompany {
    myCompany {
      id
      name
      sector
      isConfigured
      createdAt
      companyMetrics {
        id
        metricId
        metric {
          id
          name
          unit
          icon
          color
        }
        isActive
      }
    }
  }
`;

export const TOGGLE_METRIC = gql`
  mutation ToggleMetric($metricId: String!) {
    toggleMetric(metricId: $metricId) {
      id
      isActive
    }
  }
`;

export const GET_METRICS = gql`
  query GetMetrics {
    metrics {
      id
      name
      unit
      description
      icon
      color
    }
  }
`;

export const REQUEST_METRIC = gql`
  mutation RequestMetric($description: String!) {
    requestMetric(description: $description) {
      id
      description
      status
    }
  }
`;

export const CREATE_METRIC = gql`
  mutation CreateMetric($input: CreateMetricInput!) {
    createMetric(createMetricInput: $input) {
      id
      name
      unit
    }
  }
`;
