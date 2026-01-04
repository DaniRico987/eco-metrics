import { gql } from "@apollo/client";

export const GET_METRICS = gql`
  query GetMetrics {
    metrics {
      id
      name
      unit
      icon
      color
      emissionFactor
      isActive
    }
  }
`;

export const CREATE_METRIC = gql`
  mutation CreateMetric($input: CreateMetricInput!) {
    createMetric(input: $input) {
      id
      name
      isActive
    }
  }
`;
