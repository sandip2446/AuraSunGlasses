import React from 'react';
import { Sun, Heart, Globe, Star } from 'lucide-react';

export default function Story() {
  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero */}
      <section className="relative py-24 bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=80" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white mb-6">Our Story</h1>
          <p className="text-xl text-stone-300 font-light leading-relaxed">
            Founded on the belief that premium eyewear shouldn't cost a fortune. 
            We're redefining luxury, one frame at a time.
          </p>
        </div>
      </section>

      {/* Narrative */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6">The Aura Philosophy</h2>
              <p className="text-stone-600 mb-6 leading-relaxed">
                Aura was born in a small studio with a simple goal: to create the perfect pair of sunglasses. 
                We were tired of overpaying for "designer" labels that used the same materials as budget brands.
              </p>
              <p className="text-stone-600 mb-10 leading-relaxed">
                We spent two years sourcing the finest Italian acetate, engineering superior polarized lenses, 
                and refining our signature shapes. By stripping away the middlemen and marketing gimmicks, 
                we bring you world-class quality at an honest price.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                  <Heart className="h-8 w-8 text-amber-600 mx-auto mb-4" />
                  <h4 className="font-bold text-stone-900 mb-2">Passion</h4>
                  <p className="text-xs text-stone-500">Every pair is hand-checked for perfection.</p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                  <Globe className="h-8 w-8 text-amber-600 mx-auto mb-4" />
                  <h4 className="font-bold text-stone-900 mb-2">Ethics</h4>
                  <p className="text-xs text-stone-500">Sustainable materials and fair wages.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=1000&q=80" 
                alt="Craftsmanship" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-amber-600 text-white p-8 rounded-3xl hidden lg:block">
                <Star className="mb-4" size={32} />
                <p className="text-2xl font-serif font-bold">100% Polarized</p>
                <p className="text-sm opacity-80">Guaranteed clarity and protection.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
