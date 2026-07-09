import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Story from './pages/Story';
import Collections from './pages/Collections';
import InfoPage from './pages/InfoPage';
import ProductDetail from './pages/ProductDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:category" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="collections" element={<Collections />} />
        <Route path="our-story" element={<Story />} />
        {/* Support Routes */}
        <Route path="support/:page" element={<InfoPage />} />
        {/* Company Routes */}
        <Route path="company/:page" element={<InfoPage />} />
      </Route>
    </Routes>
  );
}
