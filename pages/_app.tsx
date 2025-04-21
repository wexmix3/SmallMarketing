import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize database when the app starts
    const initDb = async () => {
      try {
        // Skip database initialization in development if needed
        // This is a temporary workaround for local development
        if (process.env.NODE_ENV === 'development' && process.env.SKIP_DB_INIT === 'true') {
          console.log('Skipping database initialization in development mode');
          setDbInitialized(true);
          return;
        }

        const response = await fetch('/api/init-db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ force: false }),
        });

        const data = await response.json();

        if (data.success) {
          console.log('Database initialized successfully');
          setDbInitialized(true);
        } else {
          console.error('Failed to initialize database:', data.message);
          setDbError(data.message || 'Unknown database error');
        }
      } catch (error) {
        console.error('Error initializing database:', error);
        setDbError('Failed to connect to the database. Using mock data instead.');
        // Still set initialized to true so the app can continue with mock data
        setDbInitialized(true);
      }
    };

    initDb();
  }, []);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
