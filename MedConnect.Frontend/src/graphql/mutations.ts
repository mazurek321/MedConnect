import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($input: LoginDtoInput!) {
    login(input: $input)
  }
`;

export const REGISTER_STAFF = gql`
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
      vitals {
        heartRate
        systolicBloodPressure
        diastolicBloodPressure
        oxygenSaturation
        temperature
      }
    }
  }
`;

export const REGISTER_PATIENT = gql`
  mutation RegisterPatient($input: RegisterPatientDtoInput!) {
    registerPatient(input: $input) {
      name
      lastname
      pesel
    }
  }
`;
