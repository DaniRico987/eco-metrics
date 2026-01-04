import { gql } from "@apollo/client";

export const GET_AI_INSIGHT = gql`
  query GetAiInsight($history: [ChatMessageInput!]!, $context: String!) {
    getAiInsight(history: $history, context: $context)
  }
`;

export const SUGGEST_METRIC_DETAILS = gql`
  query SuggestMetricDetails($metricName: String!) {
    suggestMetricDetails(metricName: $metricName) {
      units
      emissionFactor
      description
    }
  }
`;
