import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8001/user', { name, email, password });
      navigate('/login'); 
    } catch (err) {
      setError('Failed to create account. Email may be in use.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      width: '100%',
      maxWidth: '500px', 
      padding: '50px',
      border: '1px solid #333',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      backgroundColor: '#242424',
      color: '#fff'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      borderRadius: '6px',
      border: '1px solid #555',
      backgroundColor: '#333',
      color: '#fff',
      fontSize: '1rem'
    },
    button: {
      width: '100%',
      padding: '12px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: '#28a745',
      color: 'white',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem'
    },
    link: {
      display: 'block',
      textAlign: 'center',
      marginTop: '20px',
      color: '#007bff',
      textDecoration: 'none'
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
        backgroundColor: '#121212'
      }}
    >
      <div style={styles.container}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Create Account</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
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
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
        <Link to="/login" style={styles.link}>
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}

export default SignupPage;
