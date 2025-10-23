import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      width: '60%',                 
      maxWidth: '900px',            
      padding: '80px',              
      border: '1px solid #333',
      borderRadius: '16px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
      backgroundColor: '#242424',
      color: '#fff',
      transition: 'all 0.3s ease'
    },
    form: { display: 'flex', flexDirection: 'column' },
    input: {
      padding: '16px',
      marginBottom: '20px',
      borderRadius: '8px',
      border: '1px solid #555',
      fontSize: '1.1rem',
      backgroundColor: '#333',
      color: '#fff'
    },
    button: {
      padding: '16px',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#007bff',
      color: 'white',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      transition: 'background 0.3s ease'
    },
    link: {
      display: 'block',
      textAlign: 'center',
      marginTop: '25px',
      color: '#007bff',
      textDecoration: 'none',
      fontSize: '1rem'
    },
    error: { color: '#dc3545', textAlign: 'center', marginTop: '10px' }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#121212',
        padding: '20px'
      }}
    >
      <div style={styles.container}>
        <h2 style={{ textAlign: 'center', marginBottom: '35px', fontSize: '2rem' }}>
          Login
        </h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
        <Link to="/signup" style={styles.link}>
          Don't have an account? Sign Up
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;

