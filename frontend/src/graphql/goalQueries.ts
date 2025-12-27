import { gql } from "@apollo/client";

export const GET_MY_COMPANY_GOALS = gql`
  query GetMyCompanyGoals {
    myCompanyGoals {
      id
      category
      target
      year
    }
  }
`;

export const UPSERT_GOAL_MUTATION = gql`
  mutation UpsertGoal($data: CreateGoalInput!) {
    upsertGoal(data: $data) {
      id
      category
      target
      year
    }
  }
`;
