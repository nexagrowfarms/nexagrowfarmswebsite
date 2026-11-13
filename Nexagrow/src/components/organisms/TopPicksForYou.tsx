'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import SignInPopup from './SigninPopup';
import { toast } from 'sonner';
import type { PricingUnit } from '@/lib/pricingUnits';

interface Pricing {
  quantity: number;
  unit: PricingUnit;
  price: number;
  _id?: string;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  type: string;
  image?: string;
  pricing: Pricing[];
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'latest', label: 'Newly Launched' },
  { id: 'popular', label: 'Best Sellers' },
  { id: 'healthy', label: 'Healthy' },
];

export default function TopPicksForYou() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addToCart } = useCart();
  const { data: items = [], isLoading, error } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState<{ [key: string]: Pricing }>({});
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return items.slice(0, 12);
    return items.filter((p) => (p.type || '').toLowerCase() === selectedCategory).slice(0, 12);
  }, [items, selectedCategory]);

  const setQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] ?? 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  useEffect(() => {
    if (filteredItems.length === 0) return;
    const defaultPricing: { [key: string]: Pricing } = {};
    filteredItems.forEach((product) => {
      if (product._id && product.pricing && product.pricing.length > 0) {
        defaultPricing[product._id] = product.pricing[0];
      }
    });
    setSelectedPricing((prev) => ({ ...prev, ...defaultPricing }));
  }, [filteredItems]);

  const handlePricingSelect = (productId: string, pricing: Pricing) => {
    setSelectedPricing((prev) => ({ ...prev, [productId]: pricing }));
    setDropdownOpen((prev) => ({ ...prev, [productId]: false }));
  };

  const toggleDropdown = (productId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDropdownOpen((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleAddToCart = async (item: Product) => {
    if (!item._id) return;
    const selected = selectedPricing[item._id];
    if (!session) {
      setShowSignInPopup(true);
      return;
    }
    try {
      const qty = quantities[item._id] ?? 1;
      await addToCart(item._id, qty, selected);
      toast.success(`${item.name} added to cart!`, { duration: 3000 });
    } catch {
      toast.error('Failed to add item to cart.');
    }
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = 320;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (isLoading || (status !== 'authenticated' && status !== 'unauthenticated')) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--leaf-500)' }} />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-8">Error loading products.</p>;
  }

  return (
    <div className="w-full py-10 sm:py-12" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--cream))' }}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--content-max)' }}>
        {/* Title with star */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: 'var(--leaf-800)' }}>
            Top Picks For You
          </h2>
          <Star className="h-6 w-6 sm:h-7 sm:w-7 fill-[var(--leaf-500)]" style={{ color: 'var(--leaf-500)' }} />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{
                backgroundColor: selectedCategory === cat.id ? 'var(--leaf-600)' : 'var(--leaf-100)',
                color: selectedCategory === cat.id ? 'white' : 'var(--leaf-800)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product carousel */}
        <div className="relative flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="hidden sm:flex shrink-0 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-lg border-2 transition-all hover:bg-white"
            style={{ borderColor: 'var(--leaf-200)', color: 'var(--leaf-700)' }}
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth scrollbar-hide flex-1 min-w-0"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filteredItems.map((item) => (
              <div key={item._id} className="shrink-0">
                <ProductCard
                  item={item}
                  selectedPricing={selectedPricing[item._id || '']}
                  quantity={quantities[item._id || ''] ?? 1}
                  onQuantityChange={(delta) => setQuantity(item._id || '', delta)}
                  isDropdownOpen={!!dropdownOpen[item._id || '']}
                  onToggleDropdown={(e) => toggleDropdown(item._id || '', e)}
                  onPricingSelect={(p) => handlePricingSelect(item._id || '', p)}
                  onAddToCart={() => handleAddToCart(item)}
                  onCardClick={item._id ? () => router.push(`/products/${item._id}`) : undefined}
                  variant="compact"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden sm:flex shrink-0 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-lg border-2 transition-all hover:bg-white"
            style={{ borderColor: 'var(--leaf-200)', color: 'var(--leaf-700)' }}
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/collections/moringa"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
            style={{ color: 'var(--leaf-600)' }}
          >
            View all products
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {Object.values(dropdownOpen).some((open) => open) && (
          <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen({})} aria-hidden />
        )}

        <SignInPopup
          isOpen={showSignInPopup}
          onClose={() => setShowSignInPopup(false)}
        />
      </div>
    </div>
  );
}
