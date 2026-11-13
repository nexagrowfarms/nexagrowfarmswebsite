'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useWishlist } from '@/app/context/WishlistContext';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'sonner';
import type { PricingUnit } from '@/lib/pricingUnits';
import { isValidPricingUnit } from '@/lib/pricingUnits';

type PricingOption = { quantity: number; unit: PricingUnit; price: number; sizeLabel?: string };

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const { data: products = [] } = useProducts();
  const { addToCart } = useCart();
  const [selectedPricing, setSelectedPricing] = useState<Record<string, PricingOption>>({});
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const wishlistProducts = useMemo(() => {
    if (!wishlistIds.length || !products.length) return [];
    return products.filter((p) => p._id && wishlistIds.includes(p._id));
  }, [wishlistIds, products]);

  useEffect(() => {
    const defaultPricing: Record<string, PricingOption> = {};
    const defaultQty: Record<string, number> = {};
    wishlistProducts.forEach((p) => {
      if (!p._id) return;
      defaultQty[p._id] = 1;
      const first = p.pricing?.[0];
      if (first && isValidPricingUnit(String(first.unit))) {
        defaultPricing[p._id] = first as PricingOption;
      }
    });
    setSelectedPricing((prev) => ({ ...prev, ...defaultPricing }));
    setQuantities((prev) => ({ ...prev, ...defaultQty }));
  }, [wishlistProducts]);

  const handlePricingSelect = (productId: string) => (pricing: PricingOption) => {
    setSelectedPricing((prev) => ({ ...prev, [productId]: pricing }));
    setDropdownOpen((prev) => ({ ...prev, [productId]: false }));
  };

  const toggleDropdown = (productId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const setQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const cur = prev[productId] ?? 1;
      return { ...prev, [productId]: Math.max(1, Math.min(99, cur + delta)) };
    });
  };

  const handleAddToCart = async (item: { _id?: string; name: string; pricing?: PricingOption[] }) => {
    if (!item._id) return;
    const sel = selectedPricing[item._id];
    const qty = quantities[item._id] ?? 1;
    try {
      await addToCart(item._id, qty, sel);
      toast.success(`${item.name} added to cart!`, { description: `₹${sel ? (sel.price * qty).toFixed(0) : ''}`, duration: 3000 });
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--leaf-100), var(--cream))' }}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-36 sm:pt-40 md:pt-44 pb-12">
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--leaf-100)' }}>
              <FiHeart className="w-12 h-12" style={{ color: 'var(--leaf-500)' }} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--leaf-800)' }}>
              Your Wishlist
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
              Save your favorite products and add them to your wishlist to buy later.
            </p>
            <p className="text-gray-500 mb-8">Your wishlist is empty.</p>
            <Link
              href="/collections/moringa"
              className="inline-block px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--leaf-600)' }}
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--leaf-100), var(--cream))' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-36 sm:pt-40 md:pt-44 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--leaf-800)' }}>
            Your Wishlist
          </h1>
          <p className="text-lg text-gray-600">
            {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {wishlistProducts.map((item) => {
            const itemId = item._id || '';
            return (
              <div key={itemId} className="w-full min-w-0">
                <ProductCard
                  item={item}
                  selectedPricing={selectedPricing[itemId]}
                  quantity={quantities[itemId] ?? 1}
                  onQuantityChange={(delta) => setQuantity(itemId, delta)}
                  isDropdownOpen={!!dropdownOpen[itemId]}
                  onToggleDropdown={toggleDropdown(itemId)}
                  onPricingSelect={handlePricingSelect(itemId)}
                  onAddToCart={() => handleAddToCart(item)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
