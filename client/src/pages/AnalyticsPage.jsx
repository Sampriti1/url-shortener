import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

axios.defaults.baseURL = 'http://localhost:8001';
axios.defaults.withCredentials = true;

const StatCard = ({ title, value }) => (
    <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ margin: 0, color: '#aaa' }}>{title}</h3>
        <p style={{ fontSize: '2.5rem', margin: '10px 0 0', color: '#fff', fontWeight: 'bold' }}>{value}</p>
    </div>
);

function AnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('/analytics');
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
                setError("Could not load analytics data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <p>Loading analytics dashboard...</p>;
    if (error) return <p style={{ color: '#dc3545' }}>{error}</p>;

    const styles = {
        container: { fontFamily: 'Arial, sans-serif', width: '100%', maxWidth: '1200px', padding: '40px', backgroundColor: '#242424', borderRadius: '10px', border: '1px solid #333' },
        header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
        statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
        th: { borderBottom: '1px solid #444', padding: '12px', textAlign: 'left' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>&larr; Back to Home</Link>
                <h1>Your Analytics Dashboard</h1>
            </div>

            <div style={styles.statGrid}>
                <StatCard title="Total Links Created" value={stats.totalLinks} />
                <StatCard title="Total Clicks (All Time)" value={stats.totalClicks} />
            </div>

            <div>
                <h3>Clicks Per Day</h3>
                <div style={{ height: '300px', marginTop: '20px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.clicksPerDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#aaa" />
                            <YAxis stroke="#aaa" />
                            <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
                            <Legend />
                            <Line type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h3>Top 5 Links</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Short ID</th>
                            <th style={styles.th}>Original URL</th>
                            <th style={styles.th}>Clicks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.topLinks.map(link => (
                            <tr key={link.shortId}>
                                <td style={{ padding: '12px' }}><a href={`http://localhost:8001/url/${link.shortId}`} target="_blank" rel="noopener noreferrer" style={{ color: '#6caff5' }}>{link.shortId}</a></td>
                                <td style={{ padding: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>{link.redirectURL}</td>
                                <td style={{ padding: '12px' }}>{link.clicks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AnalyticsPage;