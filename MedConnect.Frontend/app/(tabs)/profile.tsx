import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client/react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { GET_MY_DATA } from '../../src/graphql/queries';
import { globalStyles } from '../../src/styles/theme.styles';
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
  const { data, loading, error } = useQuery<UserDataResponse>(GET_MY_DATA, {
    fetchPolicy: 'network-only',
  });

  const handleLogout = async function () {
    await SecureStore.deleteItemAsync('userToken');
    await client.clearStore();
    router.replace('/');
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const user = data?.myData;


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
      <View>
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
                <Text style={globalStyles.badgeText}>
                  {user.role}
                </Text>
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

        {error && (
          <Text style={{ color: '#ef4444', marginTop: 12, textAlign: 'center', fontSize: 12 }}>
            Błąd pobierania danych: {error.message}
          </Text>
        )}
      </View>

      <TouchableOpacity 
        style={[globalStyles.buttonPrimary, { backgroundColor: '#ef4444' }]} 
        onPress={handleLogout}
      >
        <Text style={globalStyles.buttonPrimaryText}>Wyloguj się</Text>
      </TouchableOpacity>
    </View>
  );
}