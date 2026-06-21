import { useQuery, useSubscription } from '@apollo/client/react';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { BROWSE_PATIENTS } from '../../src/graphql/queries';
import { ON_PATIENT_UPDATED } from '../../src/graphql/subscriptions';
import { globalStyles } from '../../src/styles/theme.styles';

interface Patient {
  id: string;
  name: string;
  lastname: string;
  pesel: string;
  color: 'Unknown' | 'Green' | 'Yellow' | 'Red';
  vitals: {
    heartRate?: number;
    oxygenSaturation?: number;
  };
}

interface BrowsePatientsResponse {
  browsePatients: Patient[];
}

interface OnPatientUpdatedResponse {
  onPatientUpdated: Patient;
}

export default function DashboardScreen() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const { data: queryData, loading: queryLoading } = useQuery<BrowsePatientsResponse>(BROWSE_PATIENTS);
  const { data: subData } = useSubscription<OnPatientUpdatedResponse>(ON_PATIENT_UPDATED);

  useEffect(() => {
    if (queryData?.browsePatients) {
      setPatients(queryData.browsePatients);
    }
  }, [queryData]);

  useEffect(() => {
    if (subData?.onPatientUpdated) {
      setPatients((prev) => {
        const index = prev.findIndex((p) => p.id === subData.onPatientUpdated.id);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = subData.onPatientUpdated;
          return updated;
        }
        return [subData.onPatientUpdated, ...prev];
      });
    }
  }, [subData]);

  const getColorStyle = (color: string) => {
    switch (color) {
      case 'Red': return globalStyles.bgRed;
      case 'Yellow': return globalStyles.bgYellow;
      case 'Green': return globalStyles.bgGreen;
      default: return globalStyles.bgGray;
    }
  };

  if (queryLoading && patients.length === 0) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.titleMedium, { color: '#111827' }]}>Monitor SOR (Live)</Text>
      
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={globalStyles.card}
            onPress={() => router.navigate({ pathname: '/vitals', params: { patientId: item.id } })}
          >
            <View style={globalStyles.flex1}>
              <Text style={globalStyles.cardTitle}>{item.lastname} {item.name}</Text>
              <Text style={globalStyles.cardSubtitle}>PESEL: {item.pesel}</Text>
              <Text style={globalStyles.cardBody}>
                SPO2: {item.vitals?.oxygenSaturation ?? '--'}% | HR: {item.vitals?.heartRate ?? '--'} bpm
              </Text>
            </View>
            <View style={[globalStyles.badge, getColorStyle(item.color)]}>
              <Text style={globalStyles.badgeText}>{item.color}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}