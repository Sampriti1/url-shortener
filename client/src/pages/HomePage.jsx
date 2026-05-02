import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

function HomePage() {
    const { user, logout } = useAuth();
    const [url, setUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [userUrls, setUserUrls] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingLinks, setFetchingLinks] = useState(true);

    const fetchUserUrls = async () => {
        setFetchingLinks(true);
        try {
            const response = await axios.get('/');
            setUserUrls(response.data.urls || []);
        } catch (err) {
            console.error("Error fetching URLs:", err);
            setError("Could not load your links. A server error may have occurred.");
        } finally {
            setFetchingLinks(false);
        }
    };

    useEffect(() => {
        fetchUserUrls();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShortenedUrl('');
        try {
            const response = await axios.post('/url', { url });
            setShortenedUrl(`${import.meta.env.VITE_BACKEND_URL}/url/${response.data.id}`)
            setUrl('');
            fetchUserUrls();
        } catch (err) {
            setError('Failed to shorten. Please enter a valid URL.');
        } finally {
            setLoading(false);
        }
    };
    
    const styles = {
        container: { 
            fontFamily: 'Arial, sans-serif', 
            width: '100%',
            maxWidth: '900px', 
            minHeight: '400px',
            padding: '40px',
            border: '1px solid #333', 
            borderRadius: '10px', 
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)', 
            backgroundColor: '#242424'
        },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #444', paddingBottom: '15px' },
        
    logoutBtn: { padding: '8px 15px', border: 'none', borderRadius: '5px', backgroundColor: '#dc3545', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
    analyticsBtn: { padding: '8px 15px', border: 'none', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none' }
    };

    return (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#121212', 
    }}
  >
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Welcome, {user?.name || 'User'}!</h2>
        <div>
          <Link to="/analytics" style={styles.analyticsBtn}>View Analytics</Link>
          <button
            onClick={logout}
            style={{ ...styles.logoutBtn, marginLeft: '10px' }}
          >
            Logout
          </button>
        </div>
      </header>

      <h3 style={{ marginTop: '30px' }}>Create a new short URL</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}
      >
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your long URL"
          required
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #555',
            backgroundColor: '#333',
            color: '#fff',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 20px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {loading ? '...' : 'Shorten'}
        </button>
      </form>

      {error && <p style={{ color: '#d9534f' }}>{error}</p>}

      {shortenedUrl && (
        <div
          style={{
            padding: '15px',
            backgroundColor: '#28a745',
            borderRadius: '6px',
          }}
        >
          <h4>Success! URL is:</h4>
          <a
            href={shortenedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff', wordBreak: 'break-all' }}
          >
            {shortenedUrl}
          </a>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <h3>Your Links</h3>
        {fetchingLinks ? (
          <p>Loading your links...</p>
        ) : userUrls.length > 0 ? (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '10px',
            }}
          >
            <thead>
              <tr
                style={{ borderBottom: '1px solid #444', textAlign: 'left' }}
              >
                <th style={{ padding: '10px' }}>Short Link</th>
                <th style={{ padding: '10px' }}>Original</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {userUrls.map((link) => (
                <tr key={link.shortId} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '10px' }}>
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URL}/url/${link.shortId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#6caff5' }}
                    >
                      {link.shortId}
                    </a>
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      maxWidth: '300px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {link.redirectURL}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    {link.visitHistory.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#aaa' }}>You haven't created any links yet.</p>
        )}
      </div>
    </div>
  </div>
);

}

export default HomePage;