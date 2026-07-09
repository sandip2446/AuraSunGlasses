import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, CreditCard, Clock } from 'lucide-react';
import axios from 'axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <div className="header">
        <h1>Orders</h1>
        <p>Track your sales and shipment statuses.</p>
      </div>

      <div className="card">
        <div className="table-header">
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Transactions</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <select className="form-input" style={{ width: '150px', padding: '0.4rem' }}>
                    <option>All Status</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                </select>
            </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>Loading Orders...</td></tr>
            ) : orders.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>No orders found.</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600, color: '#3b82f6' }}>#AUR-{o.id + 1000}</td>
                <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={14} className="text-stone-400" />
                        {o.customer_name}
                    </div>
                </td>
                <td style={{ fontWeight: 600 }}>${o.total_amount}</td>
                <td>
                    <span className={`status-badge ${o.status === 'Delivered' ? 'status-delivered' : 'status-processing'}`}>
                        {o.status}
                    </span>
                </td>
                <td style={{ textAlign: 'right', color: '#64748b' }}>
                    {new Date(o.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
