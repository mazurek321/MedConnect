import { useMutation } from '@apollo/client/react';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UPDATE_VITALS } from '../src/graphql/mutations';
import { globalStyles } from '../src/styles/theme.styles';

export default function VitalsScreen() {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();

  const [hr, setHr] = useState('');
  const [sbp, setSbp] = useState('');
  const [dbp, setDbp] = useState('');
  const [spo2, setSpo2] = useState('');
  const [temp, setTemp] = useState('');

  const [updateVitals, { loading }] = useMutation(UPDATE_VITALS);

  const handleSave = async () => {
    try {
      await updateVitals({
        variables: {
          patientId,
          input: {
            heartRate: hr ? parseInt(hr) : null,
            systolicBloodPressure: sbp ? parseInt(sbp) : null,
            diastolicBloodPressure: dbp ? parseInt(dbp) : null,
            oxygenSaturation: spo2 ? parseInt(spo2) : null,
            temperature: temp ? parseFloat(temp) : null,
          },
        },
      });
      Alert.alert('Sukces', 'Parametry życiowe zostały zaktualizowane.');
      router.back();
    } catch (err: any) {
      Alert.alert('Błąd', err.message);
    }
  };

  return (
    <ScrollView style={globalStyles.scrollContainer}>
      <Text style={globalStyles.titleMedium}>Karta Badań Pacjenta</Text>

      <View style={{ gap: 16 }}>
        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Akcja Serca (HR - bpm)</Text>
          <TextInput style={globalStyles.input} keyboardType="numeric" value={hr} onChangeText={setHr} placeholder="np. 75" />
        </View>

        <View style={globalStyles.inputRow}>
          <View style={globalStyles.flex1}>
            <Text style={globalStyles.label}>Skurczowe (SBP)</Text>
            <TextInput style={globalStyles.input} keyboardType="numeric" value={sbp} onChangeText={setSbp} placeholder="np. 120" />
          </View>
          <View style={globalStyles.flex1}>
            <Text style={globalStyles.label}>Rozkurczowe (DBP)</Text>
            <TextInput style={globalStyles.input} keyboardType="numeric" value={dbp} onChangeText={setDbp} placeholder="np. 80" />
          </View>
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Saturacja (SpO2 - %)</Text>
          <TextInput style={globalStyles.input} keyboardType="numeric" value={spo2} onChangeText={setSpo2} placeholder="np. 98" />
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Temperatura (°C)</Text>
          <TextInput style={globalStyles.input} keyboardType="numeric" value={temp} onChangeText={setTemp} placeholder="np. 36.6" />
        </View>
      </View>

      <TouchableOpacity 
        style={[globalStyles.buttonPrimary, loading && globalStyles.disabledButton, { marginBottom: 40 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={globalStyles.buttonPrimaryText}>Zapisz i Przelicz Triage</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}