import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, reviewer_name: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch(`/api/products/${id}`).then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      }),
      fetch(`/api/products/${id}/reviews`).then(res => res.json())
    ])
    .then(([productData, reviewsData]) => {
      setProduct(productData);
      setReviews(reviewsData);
      setActiveImage(productData.image); // default main image
      setIsLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setIsLoading(false);
    });
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.reviewer_name) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm)
      });
      if (res.ok) {
        const reviewsRes = await fetch(`/api/products/${id}/reviews`);
        const updatedReviews = await reviewsRes.json();
        setReviews(updatedReviews);
        setReviewForm({ rating: 5, reviewer_name: '', comment: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-stone-50 min-h-screen pt-24 pb-20 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-stone-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-stone-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-stone-50 min-h-screen pt-24 pb-20 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-amber-600 hover:text-amber-700 flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-20 pt-8 sm:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to={`/shop/${product.category.toLowerCase()}`} className="inline-flex items-center text-sm text-stone-500 hover:text-stone-900 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to {product.category}
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 p-8 lg:p-12 bg-stone-100/50 flex flex-col items-center justify-center min-h-[400px]">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-auto object-cover rounded-xl shadow-lg transition-all duration-300 mb-6"
              />
              
              {/* Thumbnail Gallery */}
              {product.images && JSON.parse(product.images).length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  <div 
                    onClick={() => setActiveImage(product.image)}
                    className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${activeImage === product.image ? 'border-amber-500' : 'border-transparent hover:border-stone-300'}`}
                  >
                    <img src={product.image} className="w-full h-full object-cover" alt="thumbnail main" />
                  </div>
                  {JSON.parse(product.images).map((imgUrl, idx) => (
                    imgUrl !== product.image && (
                      <div 
                        key={idx}
                        onClick={() => setActiveImage(imgUrl)}
                        className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${activeImage === imgUrl ? 'border-amber-500' : 'border-transparent hover:border-stone-300'}`}
                      >
                        <img src={imgUrl} className="w-full h-full object-cover" alt={`thumbnail ${idx}`} />
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
              <div className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-3">{product.category}</div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center mb-6">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      fill={i < Math.round((reviews.reduce((acc, curr) => acc + curr.rating, 0) || 5) / (reviews.length || 1)) ? "currentColor" : "none"} 
                      stroke={i < Math.round((reviews.reduce((acc, curr) => acc + curr.rating, 0) || 5) / (reviews.length || 1)) ? "none" : "currentColor"}
                    />
                  ))}
                </div>
                <span className="text-sm text-stone-500 ml-3 underline cursor-pointer hover:text-stone-900">
                  {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </span>
              </div>

              <div className="text-3xl font-bold text-stone-900 mb-6">${product.price}</div>

              {/* Standard Description */}
              <p className="text-stone-600 mb-8 leading-relaxed">
                {product.description || `Elevate your everyday style with the ${product.name}. Designed for the modern individual, these sunglasses blend timeless aesthetics with premium protection. Crafted with lightweight materials for all-day comfort.`}
              </p>

              {/* Action Area */}
              <div className="mb-10">
                <button 
                  onClick={() => addToCart(product.id)}
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-stone-900 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors transform active:scale-[0.98]"
                >
                  <ShoppingBag size={20} className="mr-3" />
                  Add to Cart — ${product.price}
                </button>
              </div>

              {/* Material Specs */}
              <div className="border-t border-stone-200 pt-8 mt-auto">
                <h3 className="font-bold text-stone-900 mb-4 uppercase tracking-wider text-sm">Product Specifications</h3>
                <ul className="space-y-3">
                  {(() => {
                    try {
                      if (!product.features) throw new Error();
                      const featuresList = JSON.parse(product.features);
                      return featuresList.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <div className="w-5 h-5 rounded-full border border-stone-300 bg-stone-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5"><div className="w-2 h-2 rounded-full bg-stone-400"></div></div>
                          <span className="text-stone-600">{feature}</span>
                        </li>
                      ));
                    } catch {
                      return (
                        <>
                          <li className="flex items-start">
                            <ShieldCheck size={20} className="text-stone-400 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-stone-600"><strong>Protection:</strong> 100% UVA/UVB protection (UV400)</span>
                          </li>
                          <li className="flex items-start">
                            <div className="w-5 h-5 rounded-full border border-stone-300 bg-stone-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5"><div className="w-2 h-2 rounded-full bg-stone-400"></div></div>
                            <span className="text-stone-600"><strong>Materials:</strong> Premium Hand-Polished Acetate frame, scratch-resistant polycarbonate lenses</span>
                          </li>
                          <li className="flex items-start">
                            <Truck size={20} className="text-stone-400 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-stone-600"><strong>Shipping:</strong> Free standard shipping and returns within 30 days</span>
                          </li>
                        </>
                      );
                    }
                  })()}
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-sm border border-stone-100 p-8 lg:p-12">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-8 border-b border-stone-100 pb-4">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Reviews List */}
            <div>
              {reviews.length === 0 ? (
                <p className="text-stone-500 italic">No reviews yet. Be the first to share your thoughts!</p>
              ) : (
                <div className="space-y-8">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-stone-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-stone-900">{review.reviewer_name}</span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} stroke={i < review.rating ? "none" : "currentColor"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-600 text-sm mt-3">{review.comment}</p>
                      <span className="text-xs text-stone-400 mt-3 block">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Review */}
            <div className="bg-stone-50 p-6 rounded-2xl h-fit">
              <h3 className="font-bold text-stone-900 mb-6">Write a Review</h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star size={24} fill={star <= reviewForm.rating ? "#fbbf24" : "none"} stroke={star <= reviewForm.rating ? "none" : "#cbd5e1"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    value={reviewForm.reviewer_name}
                    onChange={e => setReviewForm({ ...reviewForm, reviewer_name: e.target.value })}
                    className="w-full rounded-lg border-stone-200 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-3 outline-none" 
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Review</label>
                  <textarea 
                    rows="4" 
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full rounded-lg border-stone-200 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-3 outline-none" 
                    placeholder="What did you like or dislike?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={submittingReview}
                  className="w-full bg-stone-900 text-white rounded-lg py-3 font-medium hover:bg-amber-600 transition-colors disabled:bg-stone-400"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
