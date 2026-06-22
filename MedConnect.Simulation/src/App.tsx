import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloProvider, useQuery } from '@apollo/client/react';
import { BROWSE_PATIENTS } from './graphql/graphql';
import { type Patient } from './types/patient';
import PatientCard from './PatientCard';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function PatientList() {
  const { loading, error, data } = useQuery<{ browsePatientsForSimulation: Patient[] }>(BROWSE_PATIENTS);

  console.log('Stan zapytania:', { loading, error, data });

  if (loading) return <p>Ładowanie...</p>;
  
  if (error) {
    console.error('Błąd GraphQL:', error);
    return <p>Błąd: {error.message}</p>;
  }

  const patients = data?.browsePatientsForSimulation || [];
  console.log('Lista pacjentów wyciągnięta z data:', patients);

  return (
    <div>
      {patients.map((p) => (
        <PatientCard key={p.id} patient={p} />
      ))}
    </div>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div style={{ padding: '20px' }}>
        <h2>Panel Symulacji</h2>
        <PatientList />
      </div>
    </ApolloProvider>
  );
}