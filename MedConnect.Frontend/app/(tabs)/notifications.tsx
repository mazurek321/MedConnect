import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { globalStyles } from '../../src/styles/theme.styles';

interface NotificationItem {
  id: string;
  message: string;
  time: string;
}

export default function NotificationsScreen() {
  const dummyNotifications: NotificationItem[] = [
    { id: '1', message: 'Pacjent Jan Kowalski wymaga pilnej aktualizacji parametrów.', time: '10 min temu' },
    { id: '2', message: 'Zmieniono status triage dla pacjenta Anna Nowak na kolor Czerwony.', time: '25 min temu' },
  ];

  return (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.titleMedium, { color: '#111827' }]}>Ostatnie powiadomienia</Text>
      <FlatList
        data={dummyNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[globalStyles.card, { flexDirection: 'column', alignItems: 'flex-start', gap: 4 }]}>
            <Text style={[globalStyles.cardTitle, { fontSize: 15 }]}>{item.message}</Text>
            <Text style={globalStyles.cardSubtitle}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}