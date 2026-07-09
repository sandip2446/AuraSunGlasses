import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSubscribers: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, orders, subscribers] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/orders'),
          axios.get('/api/subscribers')
        ]);
        
        const revenue = orders.data.reduce((sum, order) => sum + order.total_amount, 0);

        setStats({
          totalProducts: products.data.length,
          totalOrders: orders.data.length,
          totalSubscribers: subscribers.data.length,
          revenue: revenue.toFixed(2)
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="header">
        <h1>Overview</h1>
        <p>Monitor your performance and business metrics.</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          label="Total Products" 
          value={stats.totalProducts} 
          icon={<Package className="text-blue-500" />} 
          trend="+2 this week"
        />
        <StatCard 
          label="Total Orders" 
          value={stats.totalOrders} 
          icon={<ShoppingCart className="text-green-500" />} 
          trend="+12% from last month"
        />
        <StatCard 
          label="Subscribers" 
          value={stats.totalSubscribers} 
          icon={<Users className="text-purple-500" />} 
          trend="Steady growth"
        />
        <StatCard 
          label="Total Revenue" 
          value={`$${stats.revenue}`} 
          icon={<DollarSign className="text-amber-500" />} 
          trend="+5.4% increase"
        />
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <TrendingUp className="text-amber-600" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Business Performance</h2>
        </div>
        <div style={{ height: '300px', background: '#f8fafc', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justify: 'center', color: '#64748b', fontSize: '0.875rem' }}>
            <p>Sales Chart Visualization (In Development)</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span className="stat-label">{label}</span>
        {icon}
      </div>
      <div className="stat-value" style={{ marginBottom: '0.5rem' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>{trend}</div>
    </div>
  );
}
