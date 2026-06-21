import { useMutation } from '@apollo/client/react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { 
  ActivityIndicator, 
  Alert, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Keyboard, 
  TouchableWithoutFeedback, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { LOGIN_MUTATION } from '../src/graphql/mutations';
import { globalStyles } from '../src/styles/theme.styles';
import { client } from '../src/api/apollo';

interface LoginResponse {
  login: string;
}

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION);

  const handleLogin = async function () {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola.');
      return;
    }

    try {
      const { data } = await login({
        variables: {
          input: { 
            username: username.trim(), 
            password: password 
          }
        }
      });

      if (data?.login) {
        await SecureStore.setItemAsync('userToken', data.login);
        await client.resetStore();
        router.replace('/(tabs)/dashboard');
      }
    } catch (err: any) {
      Alert.alert('Błąd logowania', err.message || 'Niepoprawne dane.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1, backgroundColor: '#ffffff' }}
      >
        <View style={[globalStyles.centerContainer, { flex: 1 }]}>
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Text style={globalStyles.titleLarge}>MedConnect</Text>
            <Text style={globalStyles.subtitle}>Panel Autoryzacji Personelu</Text>
          </View>

          <View style={{ marginBottom: 24 }}>
            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Nazwa użytkownika (Login)</Text>
              <TextInput 
                style={globalStyles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="np. jankowalski"
              />
            </View>

            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.label}>Hasło</Text>
              <TextInput 
                style={globalStyles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="••••••••"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[globalStyles.buttonPrimary, loading && globalStyles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={globalStyles.buttonPrimaryText}>Zaloguj się</Text>
            )}
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}