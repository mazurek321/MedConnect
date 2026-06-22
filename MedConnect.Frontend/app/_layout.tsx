import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { client } from '../src/api/apollo';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ title: 'Powrót' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ApolloProvider>
  );
}