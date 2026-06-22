import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { UPDATE_VITALS } from '../src/graphql/graphql';
import { type Patient, type Vitals } from '../src/types/patient';

export default function PatientCard({ patient }: { patient: Patient }) {
  const [vitalsForm, setVitalsForm] = useState<Vitals>({
    heartRate: patient.vitals?.heartRate ?? null,
    systolicBloodPressure: patient.vitals?.systolicBloodPressure ?? null,
    diastolicBloodPressure: patient.vitals?.diastolicBloodPressure ?? null,
    oxygenSaturation: patient.vitals?.oxygenSaturation ?? null,
    temperature: patient.vitals?.temperature ?? null,
  });

  const [updateVitals, { loading }] = useMutation(UPDATE_VITALS, {
    onError: (error) => {
      console.error(error);
      alert("Nie udało się zaktualizować parametrów życiowych.");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = value === '' ? null : parseFloat(value);
    
    setVitalsForm((prev) => ({ 
      ...prev, 
      [name]: isNaN(parsedValue as number) ? null : parsedValue 
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateVitals({ variables: { patientId: patient.id, input: vitalsForm } });
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '16px 0', borderRadius: '8px' }}>
      <h3>{patient.name} {patient.lastname} (PESEL: {patient.pesel})</h3>
      <form onSubmit={handleSave} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label>
          Tętno (HR):<br />
          <input type="number" name="heartRate" value={vitalsForm.heartRate ?? ''} onChange={handleChange} placeholder="null" />
        </label>
        
        <label>
          Ciśnienie skurczowe:<br />
          <input type="number" name="systolicBloodPressure" value={vitalsForm.systolicBloodPressure ?? ''} onChange={handleChange} placeholder="null" />
        </label>
        
        <label>
          Ciśnienie rozkurczowe:<br />
          <input type="number" name="diastolicBloodPressure" value={vitalsForm.diastolicBloodPressure ?? ''} onChange={handleChange} placeholder="null" />
        </label>
        
        <label>
          Saturacja (O2):<br />
          <input type="number" name="oxygenSaturation" value={vitalsForm.oxygenSaturation ?? ''} onChange={handleChange} placeholder="null" />
        </label>
        
        <label>
          Temperatura:<br />
          <input type="number" step="0.1" name="temperature" value={vitalsForm.temperature ?? ''} onChange={handleChange} placeholder="null" />
        </label>

        <button type="submit" disabled={loading} style={{ padding: '5px 15px', cursor: 'pointer' }}>
          {loading ? 'Zapisywanie...' : 'Zapisz'}
        </button>
      </form>
    </div>
  );
}