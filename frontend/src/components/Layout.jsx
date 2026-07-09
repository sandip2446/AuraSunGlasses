import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, Sun, X, Trash2, ChevronDown, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { cartCount, cartItems, isCartOpen, setIsCartOpen, removeFromCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-colors ${location.pathname === to ? 'text-amber-600' : 'text-stone-600 hover:text-stone-900'}`}
    >
      {children}
    </Link>
  );

  const FooterLink = ({ to, children }) => (
    <li>
      <Link to={to} className="text-stone-500 hover:text-amber-600 text-sm transition-colors">{children}</Link>
    </li>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-stone-600 hover:text-stone-900 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center sm:justify-start w-full sm:w-auto">
              <Link to="/" className="flex items-center gap-2">
                <Sun className="h-8 w-8 text-amber-600" />
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">AURA</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:space-x-8 sm:items-center">
              <NavLink to="/shop">Shop</NavLink>
              <NavLink to="/collections">Collections</NavLink>
              <NavLink to="/our-story">Our Story</NavLink>
            </div>

            {/* Cart */}
            <div className="flex items-center absolute right-4 sm:relative sm:right-0">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-stone-600 hover:text-stone-900 relative p-2 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-amber-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-stone-700 hover:text-amber-600 hover:bg-stone-50 rounded-md">Shop</Link>
            <Link to="/collections" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-stone-700 hover:text-amber-600 hover:bg-stone-50 rounded-md">Collections</Link>
            <Link to="/our-story" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-stone-700 hover:text-amber-600 hover:bg-stone-50 rounded-md">Our Story</Link>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-serif font-bold text-stone-900">Shopping Cart</h2>
                  <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-stone-500 p-2">
                    <X size={24} />
                  </button>
                </div>

                <div className="mt-8">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag size={48} className="mx-auto text-stone-200 mb-4" />
                      <p className="text-stone-500">Your cart is empty.</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 text-amber-600 font-medium hover:text-amber-700"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <ul className="divide-y divide-stone-200">
                      {cartItems.map((item) => (
                        <li key={item.id} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border border-stone-200 rounded-md overflow-hidden bg-stone-50">
                            <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover" />
                          </div>
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-bold text-stone-900">
                                <h3>{item.name}</h3>
                                <p className="ml-4">${item.price}</p>
                              </div>
                              <p className="mt-1 text-sm text-stone-500">{item.category}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <p className="text-stone-500">Qty {item.quantity}</p>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="font-medium text-amber-600 hover:text-amber-500 flex items-center gap-1"
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-stone-200 py-6 px-4 sm:px-6 bg-stone-50">
                  <div className="flex justify-between text-lg font-bold text-stone-900 mb-6">
                    <p>Subtotal</p>
                    <p>${subtotal}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-stone-500 mb-6">Shipping and taxes calculated at checkout.</p>
                  <button className="w-full bg-stone-900 text-white rounded-full py-4 font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg">
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-6">
                <Sun className="h-6 w-6 text-amber-600" />
                <span className="font-serif text-xl font-bold tracking-tight text-white uppercase">AURA</span>
              </Link>
              <p className="text-sm leading-relaxed mb-6">
                Redefining luxury eyewear. Premium polarized sunglasses designed in-house and delivered directly to you.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-amber-600 transition-colors"><Globe size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Shop</h4>
              <ul className="space-y-4">
                <FooterLink to="/shop/mens">Mens Sunglasses</FooterLink>
                <FooterLink to="/shop/womens">Womens Sunglasses</FooterLink>
                <FooterLink to="/shop/polarized">Polarized Lenses</FooterLink>
                <FooterLink to="/shop/accessories">Accessories</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Support</h4>
              <ul className="space-y-4">
                <FooterLink to="/support/help">Help Center</FooterLink>
                <FooterLink to="/support/shipping">Shipping & Returns</FooterLink>
                <FooterLink to="/support/track">Track Order</FooterLink>
                <FooterLink to="/support/warranty">Warranty</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Company</h4>
              <ul className="space-y-4">
                <FooterLink to="/company/about">About Us</FooterLink>
                <FooterLink to="/company/sustainability">Sustainability</FooterLink>
                <FooterLink to="/company/retail">Retail Stores</FooterLink>
                <FooterLink to="/company/contact">Contact</FooterLink>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs">&copy; {new Date().getFullYear()} Aura Eyewear. All rights reserved.</p>
            <div className="flex space-x-6 text-xs text-stone-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
