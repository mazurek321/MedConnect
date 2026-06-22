import { useQuery, useMutation } from '@apollo/client/react';
import React, { useEffect, useState, useMemo } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  View, 
  Modal, 
  TextInput, 
  Button,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BROWSE_PATIENTS } from '../../src/graphql/queries';
import { REGISTER_PATIENT } from '../../src/graphql/mutations';
import { ON_PATIENT_UPDATED } from '../../src/graphql/subscriptions';
import { globalStyles } from '../../src/styles/theme.styles';
import { styles } from '../../src/styles/dashboard.styles';

interface Vitals {
  heartRate?: number | null;
  systolicBloodPressure?: number | null;
  diastolicBloodPressure?: number | null;
  oxygenSaturation?: number | null;
  temperature?: number | null;
  color?: string | null;
  __typename?: string;
}

interface Patient {
  id: string;
  name: string;
  lastname: string;
  pesel: string;
  registrationTime: string;
  vitals: Vitals;
  __typename?: string;
}

interface BrowsePatientsResponse {
  browsePatients: Patient[];
}

interface OnPatientUpdatedResponse {
  onPatientUpdated: Patient;
}

export default function DashboardScreen() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [pesel, setPesel] = useState('');

  const { data: queryData, loading: queryLoading, subscribeToMore } = useQuery<BrowsePatientsResponse>(BROWSE_PATIENTS, {
    fetchPolicy: 'cache-and-network',
  });

  const [registerPatient, { loading: mutationLoading }] = useMutation(REGISTER_PATIENT, {
    refetchQueries: [{ query: BROWSE_PATIENTS }],
    onCompleted: () => {
      setIsAddModalVisible(false);
      setName('');
      setLastname('');
      setPesel('');
    },
    onError: (error) => {
      console.error(error);
      alert("Nie udało się dodać pacjenta.");
    }
  });

  const patients = queryData?.browsePatients || [];

  const selectedPatient = useMemo(() => {
    if (!selectedPatientId) return null;
    return patients.find(p => p.id === selectedPatientId) || null;
  }, [selectedPatientId, patients]);

  useEffect(() => {
    const unsubscribe = subscribeToMore<OnPatientUpdatedResponse>({
      document: ON_PATIENT_UPDATED,
      updateQuery: (prev, { subscriptionData }): BrowsePatientsResponse => {
        if (!subscriptionData.data) return prev as BrowsePatientsResponse;
        
        const updatedPatient = subscriptionData.data.onPatientUpdated;
        const currentPatients = (prev.browsePatients || []) as Patient[];
        const exists = currentPatients.some(p => p?.id === updatedPatient.id);

        if (!exists) {
          return {
            browsePatients: [updatedPatient, ...currentPatients],
          };
        }

        return {
          browsePatients: currentPatients.map((p) => {
            if (p?.id !== updatedPatient.id) return p;

            const mergedVitals = { ...(p.vitals || {}) };
            const incomingVitals = updatedPatient.vitals || {};

            (Object.keys(incomingVitals) as Array<keyof Vitals>).forEach((key) => {
              if (incomingVitals[key] !== undefined && incomingVitals[key] !== null) {
                mergedVitals[key] = incomingVitals[key] as any;
              }
            });

            if (incomingVitals.__typename) {
              mergedVitals.__typename = incomingVitals.__typename;
            }

            return {
              ...p,
              ...updatedPatient,
              vitals: mergedVitals,
              __typename: p.__typename || updatedPatient.__typename
            };
          }),
        };
      },
      onError: (err) => {
        console.error("====== BŁĄD WEBSOCKET / SUBSKRYPCJI ======");
        console.error("Wiadomość:", err.message);
      }
    });

    return () => unsubscribe();
  }, [subscribeToMore]);

  const handleAddPatient = () => {
    if (!name || !lastname || !pesel) {
      alert("Proszę wypełnić wszystkie pola.");
      return;
    }

    registerPatient({
      variables: {
        input: { name, lastname, pesel }
      }
    });
  };

  const getDashboardCardStyle = (color?: string | null) => {
    if (!color) return { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#cbd5e1' };
    
    switch (color.toLowerCase()) {
      case 'red': 
        return { backgroundColor: '#ef4444', borderWidth: 1.5, borderColor: '#b91c1c' };
      case 'yellow': 
        return { backgroundColor: '#ff8b38', borderWidth: 1.5, borderColor: '#c2410c' };
      default: 
        return { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#cbd5e1' };
    }
  };

  const getDashboardTextColor = (color?: string | null, isSubtitle = false) => {
    if (!color) return isSubtitle ? '#64748b' : '#0f172a';
    const normalizedColor = color.toLowerCase();
    if (normalizedColor === 'red' || normalizedColor === 'yellow') return '#ffffff';
    return isSubtitle ? '#64748b' : '#0f172a';
  };

  const formatFullDate = (isoString: string) => {
    if (!isoString) return '--.--.-- --:--';
    return new Date(isoString).toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayVital = (value: number | null | undefined, unit: string) => {
    if (value === null || value === undefined) return '---';
    return `${value}${unit}`;
  };

  if (queryLoading && patients.length === 0) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={globalStyles.container}>
      <View style={styles.headerRow}>
        <Text style={[globalStyles.titleMedium, { color: '#111827' }]}>Monitor SOR (Live)</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
          <Ionicons name="person-add" size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[globalStyles.card, getDashboardCardStyle(item.vitals?.color), { marginBottom: 10, padding: 15, borderRadius: 8 }]}
            onPress={() => setSelectedPatientId(item.id)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Text 
                numberOfLines={1} 
                ellipsizeMode="tail" 
                style={{ color: getDashboardTextColor(item.vitals?.color), fontWeight: 'bold', fontSize: 16, flex: 1, marginRight: 10 }}
              >
                {item.lastname} {item.name}
              </Text>
              <Text style={{ fontSize: 12, color: getDashboardTextColor(item.vitals?.color, true), fontWeight: '600', flexShrink: 0 }}>
                {formatFullDate(item.registrationTime)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={selectedPatientId !== null} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setSelectedPatientId(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={[styles.modalTitle, { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 5 }]}>
                  Karta Pacjenta
                </Text>
                
                {selectedPatient && (
                  <View style={{ gap: 10, marginBottom: 20, width: '100%' }}>
                    <Text style={{ fontSize: 16, flexWrap: 'wrap' }}><Text style={{ fontWeight: 'bold' }}>Imię i nazwisko:</Text> {selectedPatient.lastname} {selectedPatient.name}</Text>
                    <Text style={{ fontSize: 16, flexWrap: 'wrap' }}><Text style={{ fontWeight: 'bold' }}>PESEL:</Text> {selectedPatient.pesel}</Text>
                    <Text style={{ fontSize: 16, flexWrap: 'wrap' }}><Text style={{ fontWeight: 'bold' }}>Data przyjęcia:</Text> {formatFullDate(selectedPatient.registrationTime)}</Text>
                    
                    <View style={{ height: 1, backgroundColor: '#e5e7eb', marginVertical: 5 }} />
                    
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>Parametry życiowe (Vitals):</Text>
                    <Text style={{ fontSize: 15 }}>• Saturacja (SpO2): {displayVital(selectedPatient.vitals?.oxygenSaturation, '%')}</Text>
                    <Text style={{ fontSize: 15 }}>• Tętno (HR): {displayVital(selectedPatient.vitals?.heartRate, ' bpm')}</Text>
                    <Text style={{ fontSize: 15 }}>• Ciśnienie: {selectedPatient.vitals?.systolicBloodPressure ?? '---'}/{selectedPatient.vitals?.diastolicBloodPressure ?? '---'} mmHg</Text>
                    <Text style={{ fontSize: 15 }}>• Temperatura: {displayVital(selectedPatient.vitals?.temperature, '°C')}</Text>
                    
                    <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Status Segregacji (Triage): </Text>
                      <Text style={{ fontSize: 15, fontWeight: '600' }}>{selectedPatient.vitals?.color ?? 'Brak (Unknown)'}</Text>
                    </View>
                  </View>
                )}

                <Button title="Zamknij" color="#2563eb" onPress={() => setSelectedPatientId(null)} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setIsAddModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Zarejestruj nowego pacjenta</Text>
                
                <TextInput style={styles.input} placeholder="Imię" value={name} onChangeText={setName} />
                <TextInput style={styles.input} placeholder="Nazwisko" value={lastname} onChangeText={setLastname} />
                <TextInput style={styles.input} placeholder="PESEL" keyboardType="numeric" maxLength={11} value={pesel} onChangeText={setPesel} />

                <View style={styles.modalButtons}>
                  <Button title="Anuluj" color="#6b7280" onPress={() => setIsAddModalVisible(false)} />
                  {mutationLoading ? (
                    <ActivityIndicator size="small" color="#2563eb" style={{ marginLeft: 15 }} />
                  ) : (
                    <Button title="Dodaj" color="#2563eb" onPress={handleAddPatient} />
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}