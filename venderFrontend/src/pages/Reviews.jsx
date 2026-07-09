import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Reviews</h1>
        <p>Monitor what customers are saying about your products.</p>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Reviewer</th>
              <th>Rating</th>
              <th>Comment</th>
              <th style={{ textAlign: 'right' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>Loading Reviews...</td></tr>
            ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <MessageSquare size={48} className="mx-auto text-stone-200 mb-4" style={{ display: 'block', margin: '0 auto 1rem' }} />
                    No reviews yet.
                  </td>
                </tr>
            ) : reviews.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', overflow: 'hidden', background: '#f1f5f9' }}>
                      <img src={r.product_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontWeight: 600 }}>{r.product_name}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{r.reviewer_name}</td>
                <td>
                  <div style={{ display: 'flex', color: '#fbbf24' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} stroke={i < r.rating ? "none" : "currentColor"} />
                    ))}
                  </div>
                </td>
                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#475569' }}>
                   {r.comment || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>No comment</span>}
                </td>
                <td style={{ textAlign: 'right', color: '#64748b' }}>
                    {new Date(r.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
