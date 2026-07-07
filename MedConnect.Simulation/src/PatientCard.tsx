import { useState, useRef, useEffect } from 'react';
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

  const [activeSimulation, setActiveSimulation] = useState<'normal' | 'critical' | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
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
    handleStopSimulation();
    updateVitals({ variables: { patientId: patient.id, input: vitalsForm } });
  };

  const getRandom = (min: number, max: number, decimals = 0) => {
    const num = Math.random() * (max - min) + min;
    return parseFloat(num.toFixed(decimals));
  };

  const generateVitals = (type: 'normal' | 'critical'): Vitals => {
    if (type === 'normal') {
      return {
        heartRate: getRandom(65, 80),
        systolicBloodPressure: getRandom(120, 128),
        diastolicBloodPressure: getRandom(80, 84),
        oxygenSaturation: getRandom(96, 99),
        temperature: getRandom(36.5, 36.9, 1),
      };
    } else {
      return {
        heartRate: getRandom(130, 160),
        systolicBloodPressure: getRandom(165, 190),
        diastolicBloodPressure: getRandom(100, 115),
        oxygenSaturation: getRandom(82, 88),
        temperature: getRandom(39.5, 41.0, 1),
      };
    }
  };

  const handleStartSimulation = (type: 'normal' | 'critical') => {
    handleStopSimulation();
    setActiveSimulation(type);

    const runSimulation = () => {
      const nextVitals = generateVitals(type);
      setVitalsForm(nextVitals);
      updateVitals({ variables: { patientId: patient.id, input: nextVitals } });
    };

    runSimulation();
    intervalRef.current = setInterval(runSimulation, 3000);
  };

  const handleStopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveSimulation(null);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '16px 0', borderRadius: '8px' }}>
      <h3>{patient.name} {patient.lastname}</h3>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          type="button" 
          onClick={() => handleStartSimulation('normal')} 
          style={{ 
            padding: '6px 12px', 
            background: activeSimulation === 'normal' ? '#c4dfb4' : '#e2f0d9', 
            color: '#385723', 
            border: activeSimulation === 'normal' ? '2px solid #385723' : '1px solid #a9d18e', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: activeSimulation === 'normal' ? 'bold' : 'normal'
          }}
        >
          Symuluj stan normalny
        </button>
        <button 
          type="button" 
          onClick={() => handleStartSimulation('critical')} 
          style={{ 
            padding: '6px 12px', 
            background: activeSimulation === 'critical' ? '#f8cdb2' : '#fce4d6', 
            color: '#c65911', 
            border: activeSimulation === 'critical' ? '2px solid #c65911' : '1px solid #f8cbad', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: activeSimulation === 'critical' ? 'bold' : 'normal'
          }}
        >
          Symuluj stan krytyczny
        </button>
        {activeSimulation && (
          <button 
            type="button" 
            onClick={handleStopSimulation} 
            style={{ padding: '6px 12px', background: '#f4f4f4', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Stop
          </button>
        )}
      </div>

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
          {loading ? 'Zapisywanie...' : 'Zapisz manualnie'}
        </button>
      </form>
    </div>
  );
}