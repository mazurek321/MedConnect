import { gql } from '@apollo/client';

export const GET_MY_DATA = gql`
  query GetMyData {
    myData {
      id
      username
      role
      ... on Staff {
        name
        lastname
        medicalLicenseNumber
      }
    }
  }
`;

export const BROWSE_PATIENTS = gql`
  query BrowsePatients {
    browsePatients {
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