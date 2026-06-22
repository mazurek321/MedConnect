import { ApolloClient, HttpLink, InMemoryCache, split, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import * as SecureStore from 'expo-secure-store';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'; 

const BACKEND_IP = '192.168.100.115:5288';

const httpLink = new HttpLink({
  uri: `http://${BACKEND_IP}/graphql`,
});

const authLink = setContext(async function (_, { headers }) {
  const token = await SecureStore.getItemAsync('userToken');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${BACKEND_IP}/graphql`, 
    connectionParams: async () => {
      const token = await SecureStore.getItemAsync('userToken');
      return {
        Authorization: token ? `Bearer ${token}` : "",
      };
    },
  })
);

const splitLink = split(
  function ({ query }) {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  from([authLink, httpLink]) 
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});