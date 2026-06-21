import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginDtoInput!) {
    login(input: $input)
  }
`;

export const REGISTER_STAFF_MUTATION = gql`
  mutation RegisterStaff($input: RegisterStaffDtoInput!) {
    registerStaff(input: $input) {
      id
      username
      role
    }
  }
`;

export const UPDATE_VITALS = gql`
  mutation UpdateVitals($patientId: UUID!, $input: UpdateVitalsDtoInput!) {
    updateVitals(patientId: $patientId, input: $input) {
      id
      color
    }
  }
`;