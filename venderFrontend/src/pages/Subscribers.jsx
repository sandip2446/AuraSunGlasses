import React, { useState, useEffect } from 'react';
import { Mail, Calendar } from 'lucide-react';
import axios from 'axios';

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await axios.get('/api/subscribers');
        setSubscribers(response.data);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  return (
    <div>
      <div className="header">
        <h1>Subscribers</h1>
        <p>Manage your newsletter community and mailing list.</p>
      </div>

      <div className="card">
        <div className="table-header">
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Active Subscriptions</h2>
            <button className="btn btn-outline">Export CSV</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email Address</th>
              <th>Subscribed Date</th>
              <th style={{ textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>Loading Subscribers...</td></tr>
            ) : subscribers.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>No subscribers yet.</td></tr>
            ) : subscribers.map((s) => (
              <tr key={s.id}>
                <td>#{s.id}</td>
                <td style={{ fontWeight: 500 }}>{s.email}</td>
                <td>{new Date(s.subscribed_at).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                    <span className="status-badge status-delivered">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
