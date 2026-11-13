'use client';

import Image from 'next/image';
import { ChevronDown, Plus, Minus, Heart } from 'lucide-react';
import { useWishlist } from '@/app/context/WishlistContext';
import { toast } from 'sonner';
import { formatPricingDisplayLabel } from '@/lib/pricingDisplay';
import type { PricingUnit } from '@/lib/pricingUnits';

export interface Pricing {
  quantity: number;
  unit: PricingUnit;
  price: number;
  _id?: string;
  sizeLabel?: string;
}

export interface ProductCardItem {
  _id?: string;
  name: string;
  description: string;
  type?: string;
  image?: string;
  pricing?: Pricing[];
}

function getBadgeConfig(type: string) {
  const map: Record<string, { label: string; bg: string }> = {
    healthy: { label: 'Healthy', bg: 'var(--leaf-600)' },
    latest: { label: 'Trending', bg: 'var(--leaf-500)' },
    popular: { label: 'Best Seller', bg: 'var(--leaf-600)' },
  };
  return map[type] || { label: type?.toUpperCase() || 'New', bg: 'var(--stem)' };
}

interface ProductCardProps {
  item: ProductCardItem;
  selectedPricing?: Pricing | null;
  quantity: number;
  onQuantityChange: (delta: number) => void;
  isDropdownOpen: boolean;
  onToggleDropdown: (e: React.MouseEvent) => void;
  onPricingSelect: (pricing: Pricing) => void;
  onAddToCart: () => void;
  onCardClick?: () => void;
  disabled?: boolean;
  /** Compact variant for carousel (slightly smaller) */
  variant?: 'default' | 'compact';
}

export default function ProductCard({
  item,
  selectedPricing,
  quantity,
  onQuantityChange,
  isDropdownOpen,
  onToggleDropdown,
  onPricingSelect,
  onAddToCart,
  onCardClick,
  disabled = false,
  variant = 'default',
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const itemId = item._id || '';
  const hasPricingOptions = item.pricing && item.pricing.length > 0;
  const canAddToCart = !hasPricingOptions || !!selectedPricing;
  const badge = getBadgeConfig(item.type || '');

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!itemId) return;
    const added = !isInWishlist(itemId);
    toggleWishlist(itemId);
    toast.success(added ? `${item.name} added to wishlist` : `${item.name} removed from wishlist`);
  };

  const cardContent = (
    <>
      <div
        className={`relative w-full overflow-hidden rounded-t-xl bg-white`}
        style={{
          height: variant === 'compact' ? 'clamp(10rem, 28vw, 14rem)' : 'clamp(12rem, 32vw, 16rem)',
        }}
      >
        <Image
          src={item.image || '/placeholder-image.jpg'}
          alt={item.name}
          fill
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 280px, (max-width: 768px) 300px, 320px"
        />
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span
            className="text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm"
            style={{ backgroundColor: badge.bg }}
          >
            {badge.label}
          </span>
          <button
            type="button"
            onClick={handleHeartClick}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
            style={{ color: isInWishlist(itemId) ? '#ef4444' : 'var(--leaf-600)' }}
            aria-label={isInWishlist(itemId) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className="h-4 w-4"
              fill={isInWishlist(itemId) ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-base line-clamp-1 flex-1" style={{ color: 'var(--leaf-800)' }}>
            {item.name}
          </h3>
          <span className="font-bold text-base shrink-0" style={{ color: 'var(--leaf-600)' }}>
            ₹{selectedPricing ? selectedPricing.price : item.pricing?.[0]?.price ?? '—'}
          </span>
        </div>
        <p className="text-xs mb-1 line-clamp-1" style={{ color: 'var(--leaf-600)' }}>
          {item.description}
        </p>
        <p className="text-[10px] mb-3 text-gray-500">Incl. of all taxes</p>

        {hasPricingOptions && (
          <div className="relative mb-3">
            <button
              type="button"
              onClick={onToggleDropdown}
              className="w-full flex items-center justify-between p-3 border rounded-lg text-left text-sm bg-white"
              style={{ borderColor: 'var(--leaf-200)' }}
            >
              <span style={{ color: 'var(--leaf-800)' }}>
                {selectedPricing
                  ? formatPricingDisplayLabel(selectedPricing, item.name)
                  : 'Select size'}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                style={{ color: 'var(--leaf-500)' }}
              />
            </button>
            {isDropdownOpen && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-xl max-h-48 overflow-y-auto z-50 py-1"
                style={{ borderColor: 'var(--leaf-200)' }}
              >
                {item.pricing!.map((pricing, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onPricingSelect(pricing);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-[var(--leaf-50)] transition-colors"
                    style={{
                      backgroundColor:
                        selectedPricing?.quantity === pricing.quantity &&
                        selectedPricing?.unit === pricing.unit
                          ? 'var(--leaf-100)'
                          : undefined,
                      color: 'var(--leaf-800)',
                    }}
                  >
                    <span>
                      {formatPricingDisplayLabel(pricing, item.name)}
                    </span>
                    <span className="font-semibold" style={{ color: 'var(--leaf-600)' }}>
                      ₹{pricing.price}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-medium" style={{ color: 'var(--leaf-700)' }}>
            Qty
          </span>
          <div
            className="flex items-center gap-1 border rounded-lg p-0.5"
            style={{ borderColor: 'var(--leaf-200)' }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuantityChange(-1);
              }}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-[var(--leaf-100)]"
              style={{ color: 'var(--leaf-700)' }}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span
              className="text-sm font-bold min-w-[20px] text-center"
              style={{ color: 'var(--leaf-800)' }}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuantityChange(1);
              }}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-[var(--leaf-100)]"
              style={{ color: 'var(--leaf-700)' }}
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          className={`w-full py-3 rounded-lg font-semibold text-sm uppercase transition-all ${
            canAddToCart && !disabled
              ? 'text-white hover:opacity-90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={
            canAddToCart && !disabled ? { backgroundColor: 'var(--leaf-700)' } : undefined
          }
          onClick={(e) => {
            e.stopPropagation();
            if (canAddToCart && !disabled) onAddToCart();
          }}
          disabled={!canAddToCart || disabled}
        >
          Add to cart
        </button>
      </div>
    </>
  );

  const cardClass =
    variant === 'compact'
      ? 'flex-shrink-0 w-[260px] min-[400px]:w-[280px] sm:w-[300px] md:w-[320px] bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border'
      : 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border';

  if (onCardClick) {
    return (
      <div
        className={`${cardClass} cursor-pointer`}
        style={{ zIndex: isDropdownOpen ? 1000 : 1, borderColor: 'var(--leaf-200)' }}
        onClick={(e) => {
          if (
            (e.target as HTMLElement).closest('button') ||
            (e.target as HTMLElement).closest('a')
          ) {
            return;
          }
          onCardClick();
        }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <div
      className={cardClass}
      style={{ zIndex: isDropdownOpen ? 1000 : 1, borderColor: 'var(--leaf-200)' }}
    >
      {cardContent}
    </div>
  );
}
