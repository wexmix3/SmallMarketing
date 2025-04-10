export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Marketing Platform for Small Businesses
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Your all-in-one solution for social media management, email marketing, and analytics.
      </p>
      <div style={{ 
        display: 'flex', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}>
          Get Started
        </button>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'white',
          color: '#0070f3',
          border: '1px solid #0070f3',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}>
          Learn More
        </button>
      </div>
      <p>Coming soon: Full dashboard with social media scheduling and analytics</p>
    </div>
  );
}
