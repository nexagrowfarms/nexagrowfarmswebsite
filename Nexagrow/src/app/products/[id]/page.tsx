"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Heart, Search, Truck, CreditCard, User, Package, Star } from 'lucide-react';
import SignInPopup from '@/components/SigninPopup';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { formatPricingDisplayLabel } from '@/lib/pricingDisplay';
import type { PricingUnit } from '@/lib/pricingUnits';
import { BRAND } from '@/lib/brand';

interface Pricing {
  quantity: number;
  unit: PricingUnit;
  price: number;
  _id?: string;
  sizeLabel?: string;
}

interface ProductItem {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  type?: string;
  pricing?: Pricing[];
  price?: number;
}

interface ReviewItem {
  _id: string;
  userName: string;
  rating?: number;
  comment: string;
  createdAt?: string;
}

const SERVICE_HIGHLIGHTS = [
  { icon: Truck, label: 'Free shipping', sub: 'above 1499' },
  { icon: CreditCard, label: 'Secure', sub: 'Payments' },
  { icon: User, label: 'Farmers', sub: 'Empowerment' },
  { icon: Package, label: 'COD', sub: 'available' },
];

const ACCORDION_SECTIONS = [
  { id: 'description', title: 'DESCRIPTION', contentKey: 'description' },
  { id: 'ingredients', title: 'INGREDIENTS', contentKey: 'ingredients' },
  { id: 'benefits', title: 'BENEFITS', contentKey: 'benefits' },
  { id: 'storage', title: 'STORAGE INFO', contentKey: 'storage' },
];

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<Pricing | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('description');
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { status } = useSession();
  const productId = params.id as string;

  const productImages = [product?.image || '/placeholder-image.jpg'];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/product/${productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const productData = await response.json();
        setProduct(productData);

        if (productData.pricing?.length > 0) {
          setSelectedPricing(productData.pricing[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  // Load reviews for this product
  useEffect(() => {
    const loadReviews = async () => {
      if (!productId) return;
      try {
        setReviewsLoading(true);
        const res = await fetch(`/api/reviews?productId=${productId}`);
        if (!res.ok) return;
        const data = await res.json();
        setReviews(data || []);
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setReviewsLoading(false);
      }
    };
    loadReviews();
  }, [productId]);

  const handleAddToCart = async () => {
    if (status === 'unauthenticated') {
      setShowSignInPopup(true);
      return;
    }
    if (!product) return;

    try {
      setAddingToCart(true);
      let pricingToUse = selectedPricing;
      if (!pricingToUse && product.pricing?.length) {
        pricingToUse = product.pricing[0];
      }

      await addToCart(product._id, quantity, pricingToUse ? { ...pricingToUse, unit: pricingToUse.unit } : undefined);
      toast.success(`${product.name} added to cart!`, {
        description: `₹${((pricingToUse?.price ?? 0) * quantity).toFixed(0)}`,
        duration: 3000,
      });
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const getCurrentPrice = () =>
    selectedPricing?.price ?? product?.pricing?.[0]?.price ?? product?.price ?? 0;

  const handleWishlistToggle = () => {
    if (!product?._id) return;
    const added = !isInWishlist(product._id);
    toggleWishlist(product._id);
    toast.success(added ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`);
  };

  const handleWriteReviewClick = () => {
    if (status === 'unauthenticated') {
      setShowSignInPopup(true);
      return;
    }
    setShowReviewForm(true);
  };

  const handleSubmitReview = async () => {
    if (!newReview.trim()) {
      setReviewError('Please write a review before submitting.');
      return;
    }
    setReviewError(null);
    try {
      setSubmittingReview(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, comment: newReview.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.message || 'Failed to submit review.');
        return;
      }
      setReviews((prev) => [data, ...prev]);
      setNewReview('');
      setShowReviewForm(false);
    } catch (err) {
      console.error('Submit review error', err);
      setReviewError('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const badgeLabel =
    product?.type === 'popular' ? 'BESTSELLER' :
    product?.type === 'latest' ? 'TRENDING' :
    product?.type === 'healthy' ? 'HEALTHY' : 'NEW';

  const accordionContent: Record<string, string> = {
    description: product?.description || `Pure, organic product from ${BRAND.name}.`,
    ingredients: 'Natural ingredients, no additives. Sourced from trusted organic farms.',
    benefits: 'Supports digestion, natural nutrients, and daily wellness.',
    storage: 'Store in a cool, dry place away from direct sunlight.',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--leaf-50)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: 'var(--leaf-500)' }} />
          <p className="mt-4 font-medium" style={{ color: 'var(--leaf-700)' }}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--leaf-50)' }}>
        <Navbar />
        <div className="text-center pt-32">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--leaf-800)' }}>Product Not Found</h1>
          <p className="mb-2" style={{ color: 'var(--leaf-700)' }}>{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/" className="inline-flex items-center font-medium" style={{ color: 'var(--leaf-600)' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--cream))' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-28 sm:pt-32 pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="hover:underline" style={{ color: 'var(--leaf-600)' }}>Home</Link>
          <span className="mx-2" style={{ color: 'var(--leaf-500)' }}>&gt;</span>
          <span style={{ color: 'var(--leaf-800)' }}>{product.name}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
          {/* Left: Product images */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-md" style={{ borderColor: 'var(--leaf-200)', borderWidth: 1 }}>
              <Image
                src={productImages[currentImageIndex]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
                priority
              />
              <div className="absolute top-3 left-3">
                <span
                  className="px-3 py-1 rounded text-xs font-bold text-black"
                  style={{ backgroundColor: 'var(--leaf-400)' }}
                >
                  {badgeLabel}
                </span>
              </div>
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                  style={{ color: isInWishlist(product._id) ? '#ef4444' : 'var(--leaf-600)' }}
                >
                  <Heart fill={isInWishlist(product._id) ? 'currentColor' : 'none'} className="h-5 w-5" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                  style={{ color: 'var(--leaf-600)' }}
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-2 mt-3">
                {productImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className="w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors shrink-0"
                    style={{ borderColor: i === currentImageIndex ? 'var(--leaf-500)' : 'var(--leaf-200)' }}
                  >
                    <Image src={productImages[i]} alt="" width={64} height={64} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4">
              <p className="font-semibold" style={{ color: 'var(--leaf-800)' }}>{product.name}</p>
              <p className="text-lg font-bold" style={{ color: 'var(--leaf-600)' }}>₹{getCurrentPrice()}</p>
              {selectedPricing && (
                <p className="text-sm" style={{ color: 'var(--leaf-600)' }}>
                  {formatPricingDisplayLabel(selectedPricing, product.name)}
                </p>
              )}
            </div>
          </div>

          {/* Right: Product details */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--leaf-800)' }}>
              {product.name}
            </h1>
            <p className="text-sm mb-3" style={{ color: 'var(--leaf-600)' }}>
              Organic | Glyphosate-Free
            </p>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm" style={{ color: 'var(--leaf-600)' }}>4.9 | 0 Reviews</span>
            </div>
            <div className="mb-4">
              <p className="text-2xl font-bold" style={{ color: 'var(--leaf-800)' }}>₹{getCurrentPrice()}</p>
              <p className="text-sm text-gray-500">MRP (Incl. of all taxes)</p>
            </div>

            {/* Variant selection */}
            {product.pricing && product.pricing.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--leaf-800)' }}>Select Size & Price</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {product.pricing.map((p, i) => {
                    const isSelected = selectedPricing?.quantity === p.quantity && selectedPricing?.unit === p.unit;
                    const isBestseller = i === 0 && (product.type === 'popular' || product.type === 'latest');
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedPricing({ ...p, unit: p.unit })}
                        className="relative p-4 rounded-xl border-2 text-left transition-colors"
                        style={{
                          backgroundColor: isSelected ? 'var(--leaf-50)' : 'white',
                          borderColor: isSelected ? 'var(--leaf-400)' : 'var(--leaf-200)',
                        }}
                      >
                        {isBestseller && (
                          <span className="absolute -top-2 left-2 px-2 py-0.5 text-xs font-bold rounded" style={{ backgroundColor: 'var(--leaf-600)', color: 'white' }}>
                            BESTSELLER
                          </span>
                        )}
                        <p className="font-semibold text-sm" style={{ color: 'var(--leaf-800)' }}>
                          {formatPricingDisplayLabel(p, product.name)}
                        </p>
                        <p className="font-bold" style={{ color: 'var(--leaf-600)' }}>₹{p.price}</p>
                        {p.unit === 'kg' && (
                          <p className="text-xs" style={{ color: 'var(--leaf-500)' }}>
                            ₹{(p.price / p.quantity).toFixed(0)}/kg
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex gap-4 items-center mb-6">
              <div className="flex items-center border-2 rounded-lg overflow-hidden" style={{ borderColor: 'var(--leaf-200)' }}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center"
                  style={{ color: 'var(--leaf-700)' }}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-bold" style={{ color: 'var(--leaf-800)' }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-12 h-12 flex items-center justify-center"
                  style={{ color: 'var(--leaf-700)' }}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart || status === 'loading'}
                className="flex-1 py-4 px-6 rounded-xl font-bold text-white uppercase text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: status === 'unauthenticated' ? 'var(--leaf-500)' : 'var(--leaf-600)' }}
              >
                {addingToCart ? 'Adding...' : status === 'unauthenticated' ? 'Sign in to Add to Cart' : 'Add to Cart'}
              </button>
            </div>

            {status === 'unauthenticated' && (
              <p className="text-sm" style={{ color: 'var(--leaf-600)' }}>Please sign in to add items to your cart</p>
            )}
          </div>
        </div>

        {/* Service highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y" style={{ borderColor: 'var(--leaf-200)', backgroundColor: 'var(--cream)' }}>
          {SERVICE_HIGHLIGHTS.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--leaf-100)' }}>
                <Icon className="h-6 w-6" style={{ color: 'var(--leaf-600)' }} />
              </div>
              <p className="font-semibold text-sm" style={{ color: 'var(--leaf-800)' }}>{label}</p>
              <p className="text-xs" style={{ color: 'var(--leaf-600)' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Accordion */}
        <div className="mt-12 space-y-0" style={{ backgroundColor: 'var(--cream)' }}>
          {ACCORDION_SECTIONS.map(({ id, title, contentKey }) => (
            <div
              key={id}
              className="border-b cursor-pointer"
              style={{ borderColor: 'var(--leaf-200)' }}
              onClick={() => setExpandedAccordion((prev) => (prev === id ? null : id))}
            >
              <div className="flex items-center justify-between py-4 px-4">
                <span className="font-bold text-sm uppercase" style={{ color: 'var(--leaf-800)' }}>{title}</span>
                <span className="text-lg" style={{ color: 'var(--leaf-600)' }}>{expandedAccordion === id ? '−' : '+'}</span>
              </div>
              {expandedAccordion === id && (
                <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: 'var(--leaf-700)' }}>
                  {accordionContent[contentKey]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Customer reviews */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--leaf-800)' }}>Customer Reviews</h2>

          {reviewsLoading ? (
            <p className="text-center text-sm" style={{ color: 'var(--leaf-600)' }}>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-sm mb-4" style={{ color: 'var(--leaf-600)' }}>
              No reviews yet. Be the first to share your experience.
            </p>
          ) : (
            <div className="space-y-4 max-w-2xl mx-auto mb-6">
              {reviews.map((r) => (
                <div key={r._id} className="rounded-xl border p-4 text-left bg-white shadow-sm" style={{ borderColor: 'var(--leaf-200)' }}>
                  <p className="font-semibold mb-1" style={{ color: 'var(--leaf-800)' }}>{r.userName}</p>
                  {r.createdAt && (
                    <p className="text-xs mb-2" style={{ color: 'var(--leaf-500)' }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-sm" style={{ color: 'var(--leaf-700)' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {showReviewForm ? (
            <div className="max-w-xl mx-auto mt-4 text-left">
              <textarea
                className="w-full rounded-xl border-2 p-3 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--leaf-200)' }}
                rows={4}
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Share your experience with this product..."
                disabled={submittingReview}
              />
              {reviewError && (
                <p className="text-sm text-red-600 mt-1">{reviewError}</p>
              )}
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="px-5 py-2 rounded-lg font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: 'var(--leaf-600)' }}
                >
                  {submittingReview ? 'Submitting...' : 'Submit review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setNewReview('');
                    setReviewError(null);
                  }}
                  className="px-4 py-2 rounded-lg font-semibold text-sm"
                  style={{ color: 'var(--leaf-600)', backgroundColor: 'white', border: '1px solid var(--leaf-200)' }}
                  disabled={submittingReview}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleWriteReviewClick}
                className="px-6 py-2 rounded-lg font-semibold text-white"
                style={{ backgroundColor: 'var(--leaf-600)' }}
              >
                Write a review
              </button>
            </div>
          )}
        </div>
      </div>

      <SignInPopup isOpen={showSignInPopup} onClose={() => setShowSignInPopup(false)} />
    </div>
  );
}
