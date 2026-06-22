import { gql } from '@apollo/client';

export const BROWSE_PATIENTS = gql`
  query BrowsePatients {
    browsePatientsForSimulation {
      id
      name
      lastname
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

export const UPDATE_VITALS = gql`
  mutation UpdateVitals($patientId: UUID!, $input: UpdateVitalsDtoInput!) {
    updateVitalsSimuation(patientId: $patientId, input: $input) {
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