import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Collections() {
  const collections = [
    {
      title: "The Urban Explorer",
      description: "Sleek, modern frames designed for the city dweller.",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80",
      path: "/shop/mens"
    },
    {
      title: "Coastal Escape",
      description: "Polarized perfection for long days by the water.",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80",
      path: "/shop/polarized"
    },
    {
        title: "Vintage Revival",
        description: "Classic silhouettes with a contemporary twist.",
        image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80",
        path: "/shop/womens"
      }
  ];

  return (
    <div className="bg-stone-50 min-h-screen">
      <section className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-stone-900 font-serif">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">Curated Collections</h1>
          <p className="text-xl text-stone-600 font-light max-w-2xl mx-auto">
            Discover frames hand-selected for your lifestyle and adventures.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {collections.map((col, i) => (
            <div key={col.title} className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-1/2">
                <img src={col.image} alt={col.title} className="rounded-3xl shadow-xl w-full h-[500px] object-cover" />
              </div>
              <div className="w-full md:w-1/2 p-4">
                <h3 className="text-3xl font-serif font-bold text-stone-900 mb-6">{col.title}</h3>
                <p className="text-lg text-stone-600 mb-10 leading-relaxed font-light">{col.description}</p>
                <Link 
                  to={col.path}
                  className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-medium hover:bg-amber-600 transition-colors"
                >
                  Explore Collection <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
