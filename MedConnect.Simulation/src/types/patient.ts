export interface Vitals {
  heartRate?: number | null;
  systolicBloodPressure?: number | null;
  diastolicBloodPressure?: number | null;
  oxygenSaturation?: number | null;
  temperature?: number | null;
  color?: string | null;
}

export interface Patient {
  id: string;
  name: string;
  lastname: string;
  pesel: string;
  registrationTime: string;
  vitals: Vitals | null;
}