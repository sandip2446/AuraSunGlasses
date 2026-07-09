import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Mens',
    image: '',
    description: '',
    features: '',
    images: '[]'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        description: product.description || '',
        features: product.features || '',
        images: product.images || '[]'
      });
    } else {
      setCurrentProduct(null);
      setFormData({ name: '', price: '', category: 'Mens', image: '', description: '', features: '', images: '[]' });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    });

    try {
      const base64Images = await Promise.all(promises);
      if (base64Images.length > 0) {
        setFormData(prev => ({
          ...prev,
          image: prev.image || base64Images[0],
          images: JSON.stringify(base64Images)
        }));
      }
    } catch (error) {
      console.error("Error reading files:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct) {
        await axios.put(`/api/products/${currentProduct.id}`, formData);
      } else {
        await axios.post('/api/products', formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Inventory</h1>
          <p>Manage your product catalog and pricing.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="card">
        <div className="table-header">
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="form-input" 
              style={{ paddingLeft: '2.75rem' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Showing {filteredProducts.length} products
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>Loading Inventory...</td></tr>
            ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>No products found.</td></tr>
            ) : filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', overflow: 'hidden', background: '#f1f5f9' }}>
                      <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                  </div>
                </td>
                <td><span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>{p.category}</span></td>
                <td>${p.price}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="btn btn-outline" onClick={() => handleOpenModal(p)}><Edit2 size={16} /></button>
                    <button className="btn btn-outline" style={{ color: '#ef4444' }} onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    required 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-input" 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Mens</option>
                    <option>Womens</option>
                    <option>Polarized</option>
                    <option>Accessories</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Main Image URL</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input 
                        type="text" 
                        className="form-input" 
                        required 
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        placeholder="https://images.unsplash.com/... or Base64 string"
                    />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Upload Additional Photos</label>
                <input 
                  type="file" 
                  multiple
                  accept="image/*"
                  className="form-input" 
                  onChange={handleFileChange}
                />
                <small style={{ color: '#64748b' }}>Select multiple files to upload directly from your computer.</small>
              </div>
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea 
                  className="form-input" 
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter a compelling product description..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Features (JSON Format) (Optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  placeholder='Eg: ["UV400 Protection", "Polarized"]'
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                {currentProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
