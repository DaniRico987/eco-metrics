import { gql } from "@apollo/client";

export const GET_PENDING_USERS = gql`
  query GetPendingUsers {
    pendingUsers {
      id
      name
      email
      role
      status
      createdAt
    }
  }
`;

export const GET_USERS_BY_COMPANY = gql`
  query GetUsersByCompany {
    usersByCompany {
      id
      name
      email
      role
      status
      createdAt
    }
  }
`;

export const APPROVE_USER_MUTATION = gql`
  mutation ApproveUser($userId: String!) {
    approveUser(userId: $userId) {
      id
      status
    }
  }
`;

export const REJECT_USER_MUTATION = gql`
  mutation RejectUser($userId: String!) {
    rejectUser(userId: $userId) {
      id
      status
    }
  }
`;
