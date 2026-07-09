import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sun, Truck, ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Home() {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data.slice(0, 4)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pb-32 flex content-center items-center justify-center min-h-[90vh]">
        <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=80')" }}>
          <span className="w-full h-full absolute opacity-40 bg-black"></span>
        </div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white tracking-tight mb-6 drop-shadow-md">
            Meet Aura.<br className="hidden sm:block"/> Your new signature look.
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-stone-200 max-w-2xl font-light mb-10 drop-shadow">
            Exclusively designed in-house. We craft premium, polarized sunglasses and bring them directly to you—no middlemen, just exceptional quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/shop"
              className="bg-amber-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-amber-700 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Shop The Collection
            </Link>
            <Link 
              to="/our-story"
              className="bg-white text-stone-900 px-8 py-4 rounded-full font-medium text-lg hover:bg-stone-100 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Read Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 sm:py-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <FeatureCard 
              icon={<Shield className="h-7 w-7 text-amber-600" />}
              title="UV400 Protection"
              description="Complete protection from harmful UVA and UVB rays. Keep your eyes safe without compromising style."
            />
            <FeatureCard 
              icon={<Sun className="h-7 w-7 text-amber-600" />}
              title="Polarized Lenses"
              description="Cut through glare and see with true clarity. Perfect for driving, water sports, or everyday wear."
            />
            <FeatureCard 
              icon={<Truck className="h-7 w-7 text-amber-600" />}
              title="Free Shipping & Returns"
              description="Try them on at home risk-free. Enjoy complimentary fast shipping and easy 30-day returns."
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 sm:py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-4">Our Signature Frames</h2>
              <p className="text-stone-600 max-w-xl">Designed from scratch by our team and exclusively available here. Find the perfect shape for your face.</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center text-amber-600 font-medium hover:text-amber-700 transition-colors">
              View all <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-stone-50 hover:shadow-md transition-shadow">
      <div className="h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-3">{title}</h3>
      <p className="text-stone-600 leading-relaxed">{description}</p>
    </div>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">{product.category}</div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-stone-900 mb-1 hover:text-amber-600 transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center mb-4">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
          </div>
          <span className="text-xs text-stone-500 ml-2">(42)</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-stone-900">${product.price}</span>
          <button 
            onClick={() => addToCart(product.id)}
            className="bg-stone-900 text-white p-3 rounded-full hover:bg-amber-600 transition-colors transform active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
