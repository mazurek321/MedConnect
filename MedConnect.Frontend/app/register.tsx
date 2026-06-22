import { useMutation } from '@apollo/client/react';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { 
  ActivityIndicator, 
  Alert, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Keyboard, 
  TouchableWithoutFeedback, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { REGISTER_STAFF } from '../src/graphql/mutations';
import { globalStyles } from '../src/styles/theme.styles';

interface RegisterResponse {
  registerStaff: {
    id: string;
    username: string;
    role: string;
  };
}

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [role, setRole] = useState('Nurse');

  const [registerStaff, { loading }] = useMutation<RegisterResponse>(REGISTER_STAFF);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !name.trim() || !lastname.trim() || !licenseNumber.trim()) {
      Alert.alert('Błąd', 'Wszystkie pola są wymagane.');
      return;
    }

    try {
      await registerStaff({
        variables: {
          input: {
            username: username.trim(),
            password: password,
            name: name.trim(),
            lastname: lastname.trim(),
            medicalLicenseNumber: licenseNumber.trim(),
            role: role.toUpperCase()
          }
        }
      });

      Alert.alert('Sukces', 'Konto utworzone. Możesz się zalogować.', [
        { text: 'OK', onPress: () => router.navigate('/') }
      ]);
    } catch (err: any) {
      Alert.alert('Błąd rejestracji', err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1, backgroundColor: '#ffffff' }}
      >
        <ScrollView style={globalStyles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={[globalStyles.titleMedium, { marginTop: 16 }]}>Rejestracja Personelu</Text>
          <Text style={[globalStyles.subtitle, { textAlign: 'left', marginBottom: 24 }]}>Utwórz konto systemowe</Text>

          <View style={{ gap: 16 }}>
            <View style={globalStyles.inputRow}>
              <View style={globalStyles.flex1}>
                <Text style={globalStyles.label}>Imię</Text>
                <TextInput style={globalStyles.input} value={name} onChangeText={setName} />
              </View>
              <View style={globalStyles.flex1}>
                <Text style={globalStyles.label}>Nazwisko</Text>
                <TextInput style={globalStyles.input} value={lastname} onChangeText={setLastname} />
              </View>
            </View>

            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Numer PWZ</Text>
              <TextInput style={globalStyles.input} keyboardType="numeric" value={licenseNumber} onChangeText={setLicenseNumber} />
            </View>

            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Login</Text>
              <TextInput style={globalStyles.input} autoCapitalize="none" autoCorrect={false} value={username} onChangeText={setUsername} />
            </View>

            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Hasło</Text>
              <TextInput style={globalStyles.input} secureTextEntry autoCapitalize="none" autoCorrect={false} value={password} onChangeText={setPassword} />
            </View>

            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Rola</Text>
              <View style={globalStyles.rowSelector}>
                {['Nurse', 'Doctor'].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[globalStyles.selectorTab, role === r && globalStyles.selectorTabActive]}
                    onPress={() => setRole(r)}
                  >
                    <Text style={[globalStyles.selectorTabText, role === r && globalStyles.selectorTabTextActive]}>
                      {r === 'Nurse' ? 'Pielęgniarka' : 'Lekarz'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[globalStyles.buttonPrimary, loading && globalStyles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={globalStyles.buttonPrimaryText}>Zarejestruj</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.navigate('/')} style={globalStyles.buttonSecondary}>
            <Text style={globalStyles.buttonSecondaryText}>Zaloguj się</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}