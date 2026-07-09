import React from 'react';
import { useParams } from 'react-router-dom';
import { HelpCircle, Truck, Package, Shield, Info, Leaf, Store, Mail } from 'lucide-react';

export default function InfoPage() {
  const { page } = useParams();

  const getContent = (page) => {
    switch(page) {
      case 'help':
        return {
          title: 'Help Center',
          subtitle: 'Everything you need to know about your Aura Sunglasses.',
          icon: <HelpCircle className="h-12 w-12 text-amber-600 mb-6" />,
          content: 'Our support team is here for you. Find answers to common questions about lens care, frame adjustments, and more.'
        };
      case 'shipping':
        return {
          title: 'Shipping & Returns',
          subtitle: 'Fast, free, and hassle-free.',
          icon: <Truck className="h-12 w-12 text-amber-600 mb-6" />,
          content: 'We offer free standard shipping on all orders. Not a perfect fit? Enjoy easy 30-day returns on any purchase.'
        };
      case 'track':
        return {
          title: 'Track Order',
          subtitle: 'Follow your Aura journey.',
          icon: <Package className="h-12 w-12 text-amber-600 mb-6" />,
          content: 'Enter your order number and email address to see the current status of your shipment.'
        };
      case 'warranty':
        return {
          title: 'Warranty',
          subtitle: 'Built to last. Guaranteed.',
          icon: <Shield className="h-12 w-12 text-amber-600 mb-6" />,
          content: 'Every pair of Aura sunglasses comes with a 1-year limited warranty against manufacturing defects.'
        };
      case 'about':
        return {
          title: 'About Us',
          subtitle: 'Independent. Direct. Premium.',
          icon: <Info className="h-12 w-12 text-amber-600 mb-6" />,
          content: 'Aura was founded to challenge the status quo of the eyewear industry. We design in-house and sell directly to you.'
        };
      case 'sustainability':
        return {
          title: 'Sustainability',
          subtitle: 'Protecting the vision of tomorrow.',
          icon: <Leaf className="h-12 w-12 text-amber-600 mb-6" />,
          content: 'We use bio-based acetate and recycled packaging to minimize our environmental footprint.'
        };
      case 'retail':
        return {
          title: 'Retail Stores',
          subtitle: 'Experience Aura in person.',
          icon: <Store className="h-12 w-12 text-amber-600 mb-6" />,
          content: 'Visit our flagship studios in New York, Los Angeles, and London for personal fittings.'
        };
      case 'contact':
        return {
          title: 'Contact Us',
          subtitle: 'We’d love to hear from you.',
          icon: <Mail className="h-12 w-12 text-amber-600 mb-6" />,
          content: 'Drop us a line at hello@auraeyewear.com or call us at (800) AURA-SUN.'
        };
      default:
        return {
          title: 'Information',
          subtitle: 'Learn more about Aura.',
          icon: <Info className="h-12 w-12 text-amber-600 mb-6" />,
          content: 'Explore our support and company information.'
        };
    }
  };

  const data = getContent(page);

  return (
    <div className="bg-stone-50 min-h-[70vh] flex items-center py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {data.icon}
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">{data.title}</h1>
        <p className="text-xl text-stone-600 mb-10 leading-relaxed font-light">{data.subtitle}</p>
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-100 text-left">
          <p className="text-lg text-stone-600 leading-relaxed">
            {data.content}
          </p>
          <div className="mt-12 h-px bg-stone-100 w-full" />
          <p className="mt-8 text-sm text-stone-400">
            For more detailed inquiries, please contact our support team directly. We aim to respond within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
