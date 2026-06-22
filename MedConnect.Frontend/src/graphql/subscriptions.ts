import { gql } from '@apollo/client';

export const ON_PATIENT_UPDATED = gql`
  subscription OnPatientUpdated {
    onPatientUpdated {
      id
      name
      lastname
      pesel
      registrationTime
      vitals {
        heartRate
        systolicBloodPressure
        diastolicBloodPressure
        oxygenSaturation
        temperature
        color
      }
    }
  }
`;