import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { useQuery, useMutation } from '@apollo/client/react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GET_MY_DATA } from '../../src/graphql/queries';
import { REGISTER_STAFF } from '../../src/graphql/mutations';
import { globalStyles } from '../../src/styles/theme.styles';
import { styles } from '../../src/styles/dashboard.styles';
import { client } from '../../src/api/apollo';

interface UserDataResponse {
  myData?: {
    id?: string;
    username?: string;
    name?: string;
    lastname?: string;
    role?: string;
    medicalLicenseNumber?: string;
  };
}

export default function ProfileScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('NURSE');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState('');

  const { data, loading, error } = useQuery<UserDataResponse>(GET_MY_DATA, {
    fetchPolicy: 'network-only',
  });

  const [registerStaff, { loading: registerLoading }] = useMutation(REGISTER_STAFF, {
    onCompleted: () => {
      setIsModalVisible(false);
      setUsername('');
      setPassword('');
      setRole('NURSE');
      setName('');
      setLastname('');
      setMedicalLicenseNumber('');
      alert("Konto personelu zostało utworzone pomyślnie.");
    },
    onError: (err) => {
      console.error(err);
      alert(`Błąd tworzenia konta: ${err.message}`);
    }
  });

  const handleLogout = async function () {
    await SecureStore.deleteItemAsync('userToken');
    await client.clearStore();
    router.replace('/');
  };

  const handleRegisterStaff = () => {
    if (!username || !password || !name || !lastname) {
      alert("Proszę wypełnić wymagane pola (Login, Hasło, Imię, Nazwisko).");
      return;
    }

    registerStaff({
      variables: {
        input: {
          username,
          password,
          role,
          name,
          lastname,
          medicalLicenseNumber: medicalLicenseNumber || null
        }
      }
    });
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const user = data?.myData;
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  const getRoleBadgeStyle = function (role?: string) {
    if (!role) return globalStyles.bgGray;
    switch (role.toUpperCase()) {
      case 'ADMIN': return { backgroundColor: '#4b5563' };
      case 'DOCTOR': return globalStyles.bgRed;
      case 'NURSE': return globalStyles.bgGreen;
      default: return globalStyles.bgGray;
    }
  };

  return (
    <View style={[globalStyles.container, { justifyContent: 'space-between', paddingBottom: 24 }]}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, width: '100%' }}>
        <Text style={[globalStyles.titleMedium, { color: '#111827', marginBottom: 24 }]}>Mój Profil</Text>
        
        <View style={[globalStyles.card, { flexDirection: 'column', alignItems: 'flex-start', padding: 20, gap: 16 }]}>
          <View style={{ width: '100%' }}>
            <Text style={globalStyles.label}>Imię i nazwisko</Text>
            <Text style={[globalStyles.cardTitle, { fontSize: 20 }]}>
              {user?.name ?? ''} {user?.lastname ?? ''}
            </Text>
          </View>

          <View style={{ width: '100%' }}>
            <Text style={globalStyles.label}>Nazwa użytkownika (Login)</Text>
            <Text style={[globalStyles.cardBody, { fontSize: 16 }]}>
              {user?.username ?? '--'}
            </Text>
          </View>

          <View style={{ width: '100%' }}>
            <Text style={globalStyles.label}>Rola w systemie</Text>
            {user?.role ? (
              <View style={[
                globalStyles.badge, 
                getRoleBadgeStyle(user.role), 
                { alignSelf: 'flex-start', marginTop: 4 }
              ]}>
                <Text style={globalStyles.badgeText}>{user.role}</Text>
              </View>
            ) : (
              <Text style={[globalStyles.cardBody, { fontSize: 16 }]}>--</Text>
            )}
          </View>

          <View style={{ width: '100%' }}>
            <Text style={globalStyles.label}>Numer PWZ</Text>
            <Text style={[globalStyles.cardSubtitle, { fontSize: 14, color: '#111827' }]}>
              {user?.medicalLicenseNumber ?? '--'}
            </Text>
          </View>
        </View>

        {isAdmin && (
          <TouchableOpacity 
            style={[globalStyles.card, { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#2563eb' }]}
            onPress={() => setIsModalVisible(true)}
          >
            <Ionicons name="shield-checkmark" size={24} color="#2563eb" />
            <View>
              <Text style={[globalStyles.cardTitle, { color: '#2563eb' }]}>Panel Administratora</Text>
              <Text style={globalStyles.cardSubtitle}>Utwórz nowe konto personelu medycznego</Text>
            </View>
          </TouchableOpacity>
        )}

        {error && (
          <Text style={{ color: '#ef4444', marginTop: 12, textAlign: 'center', fontSize: 12 }}>
            Błąd pobierania danych: {error.message}
          </Text>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={[globalStyles.buttonPrimary, { backgroundColor: '#ef4444', marginTop: 16 }]} 
        onPress={handleLogout}
      >
        <Text style={globalStyles.buttonPrimaryText}>Wyloguj się</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: '85%' }]}>
            <Text style={styles.modalTitle}>Nowy pracownik</Text>
            
            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
              <TextInput 
                style={styles.input} 
                placeholder="Nazwa użytkownika (Login) *" 
                value={username} 
                onChangeText={setUsername} 
                autoCapitalize="none"
              />
              <TextInput 
                style={styles.input} 
                placeholder="Hasło *" 
                secureTextEntry 
                value={password} 
                onChangeText={setPassword} 
                autoCapitalize="none"
              />
              <TextInput 
                style={styles.input} 
                placeholder="Imię *" 
                value={name} 
                onChangeText={setName} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Nazwisko *" 
                value={lastname} 
                onChangeText={setLastname} 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Numer PWZ (Opcjonalnie)" 
                value={medicalLicenseNumber} 
                onChangeText={setMedicalLicenseNumber} 
              />

              <Text style={[globalStyles.label, { marginTop: 8, marginBottom: 4 }]}>Rola</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                {['NURSE', 'DOCTOR', 'ADMIN'].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      globalStyles.badge, 
                      role === r ? { backgroundColor: '#2563eb' } : { backgroundColor: '#e5e7eb' },
                      { flex: 1, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }
                    ]}
                    onPress={() => setRole(r)}
                  >
                    <Text style={[globalStyles.badgeText, role === r ? { color: '#ffffff' } : { color: '#374151' }]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={[styles.modalButtons, { width: '100%', marginTop: 8 }]}>
              <TouchableOpacity 
                style={[globalStyles.buttonPrimary, { backgroundColor: '#6b7280', flex: 1, marginRight: 8 }]} 
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={globalStyles.buttonPrimaryText}>Anuluj</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[globalStyles.buttonPrimary, { backgroundColor: '#2563eb', flex: 1 }]} 
                onPress={handleRegisterStaff}
                disabled={registerLoading}
              >
                {registerLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={globalStyles.buttonPrimaryText}>Utwórz</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}