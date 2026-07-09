import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Shop() {
  const { category } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const url = category ? `/api/products?category=${category.charAt(0).toUpperCase() + category.slice(1)}` : '/api/products';
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [category]);

  const categories = [
    { name: 'All', path: '/shop' },
    { name: 'Mens', path: '/shop/mens' },
    { name: 'Womens', path: '/shop/womens' },
    { name: 'Polarized', path: '/shop/polarized' },
    { name: 'Accessories', path: '/shop/accessories' },
  ];

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-4 capitalize">
            {category ? `${category} Sunglasses` : 'The Collection'}
          </h1>
          <p className="text-stone-600 max-w-xl mx-auto">
            Explore our meticulously crafted collection of premium eyewear, designed for those who value both style and protection.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-2 mb-6 font-bold text-stone-900 uppercase tracking-wider text-sm">
                <Filter size={18} /> Filters
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link 
                    key={cat.name}
                    to={cat.path}
                    className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                      (!category && cat.name === 'All') || (category === cat.name.toLowerCase())
                        ? 'bg-amber-100 text-amber-800 font-bold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-stone-100" />
                ))}
              </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
                    <ShoppingBag size={48} className="mx-auto text-stone-200 mb-4" />
                    <p className="text-stone-500">No products found in this category.</p>
                </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} addToCart={addToCart} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
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
