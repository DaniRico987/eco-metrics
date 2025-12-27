import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      accessToken
      user {
        id
        name
        email
        role
        companyId
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      accessToken
      user {
        id
        name
        email
        role
        companyId
      }
    }
  }
`;

export const REGISTER_COMPANY_MUTATION = gql`
  mutation RegisterCompany($data: RegisterCompanyInput!) {
    registerCompany(data: $data) {
      accessToken
      user {
        id
        name
        email
        role
        companyId
        status
      }
    }
  }
`;

export const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
    }
  }
`;
