"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import type { IProduct } from "../../../models/Product";
import { useCart } from '../../../app/context/CartContext';
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
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

const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: '🌿' },
  { id: 'powder', label: 'Organic Moringa Powder', icon: '🍃' },
  { id: 'tea', label: 'Moringa Tea', icon: '☕' },
  { id: 'capsules', label: 'Capsules & Supplements', icon: '💊' },
];

export default function MoringaCollection() {
  const [items, setItems] = useState<IProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState<{[key: string]: Pricing}>({});
  const [dropdownOpen, setDropdownOpen] = useState<{[key: string]: boolean}>({});
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMoringaProducts = async () => {
      try {
        const productsRes = await axios.get("/api/product");
        const moringaProducts = productsRes.data || [];

        setItems(moringaProducts);

        const defaultPricing: {[key: string]: Pricing} = {};
        const defaultQuantities: {[key: string]: number} = {};
        moringaProducts.forEach((product: IProduct) => {
          if (product._id) {
            defaultQuantities[product._id] = 1;
            if (product.pricing && product.pricing.length > 0) {
              defaultPricing[product._id] = product.pricing[0];
            }
          }
        });
        setSelectedPricing(defaultPricing);
        setQuantities(defaultQuantities);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching moringa products:", error);
        setLoading(false);
      }
    };

    fetchMoringaProducts();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter((product) => {
      const text = `${product.name} ${product.description || ''}`.toLowerCase();
      if (activeCategory === 'powder') {
        return text.includes('powder') || text.includes('sachet');
      }
      if (activeCategory === 'tea') {
        return text.includes('tea');
      }
      if (activeCategory === 'capsules') {
        return text.includes('capsule') || text.includes('supplement');
      }
      return true;
    });
  }, [items, activeCategory]);

  const handlePricingSelect = (productId: string) => (pricing: Pricing) => {
    setSelectedPricing(prev => ({ ...prev, [productId]: pricing }));
    setDropdownOpen(prev => ({ ...prev, [productId]: false }));
  };

  const toggleDropdown = (productId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  const setQuantity = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] ?? 1;
      const next = Math.max(1, Math.min(99, current + delta));
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = async (item: IProduct) => {
    if (!item._id) return;
    const selected = selectedPricing[item._id];
    const qty = quantities[item._id] ?? 1;
    try {
      await addToCart(item._id, qty, selected);
      toast.success(
        `${item.name} (${qty} × ${formatPricingDisplayLabel(selected, item.name)}) added to cart!`,
        { description: `₹${(selected.price * qty).toFixed(2)}`, duration: 3000 }
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  const handleCardClick = (item: IProduct, index: number) => () => {
    const itemId = item._id || '';
    if (!dropdownOpen[itemId]) {
      window.location.href = `/products/${item._id}?_pos=${index + 1}&_psq=moringa&_ss=e&_v=1.0`;
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen({});
    };

    if (Object.values(dropdownOpen).some(open => open)) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  if (loading) {
    return (
      <div className="min-h-screen mt-16" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--leaf-100), var(--cream))' }}>
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--leaf-500)' }}></div>
            <p className="font-medium" style={{ color: 'var(--leaf-700)' }}>Loading {BRAND.shortName} products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 py-12 pt-24 relative" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--leaf-100), var(--cream))' }}>
      <Navbar />
      <div className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-white/70 shadow-sm border border-[var(--leaf-200)] text-[var(--leaf-700)]">
              Direct From Kanewra, Prayagraj
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4" style={{ color: 'var(--leaf-800)' }}>
              Our Organic Moringa Collection
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--leaf-700)' }}>
              100% pure organic moringa powder in 100g sachets, restorative herbal teas, and daily vitality capsules.
            </p>
            <div className="w-24 h-1 mx-auto rounded-full mt-4" style={{ backgroundColor: 'var(--leaf-500)' }} />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 shadow-sm ${
                    isActive
                      ? "text-white shadow-md scale-105"
                      : "bg-white/80 text-gray-700 hover:bg-white hover:shadow border border-[var(--leaf-200)]"
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--leaf-600)' : undefined,
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Product Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm font-medium" style={{ color: 'var(--leaf-700)' }}>
              Showing <span className="font-bold text-[var(--leaf-800)]">{filteredItems.length}</span> {filteredItems.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {/* Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-3xl border border-[var(--leaf-200)] max-w-lg mx-auto p-8 shadow-sm">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--leaf-800)' }}>
                No products found in this category
              </h3>
              <p className="text-sm mb-6 text-gray-600">
                Switch categories or browse our full range of organic moringa wellness products.
              </p>
              <button
                onClick={() => setActiveCategory('all')}
                className="px-6 py-2.5 rounded-xl font-semibold text-white shadow-md transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--leaf-600)' }}
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredItems.map((item, index) => {
                const itemId = item._id || '';
                return (
                  <div key={item._id} className="w-full min-w-0">
                    <ProductCard
                      item={item}
                      selectedPricing={selectedPricing[itemId]}
                      quantity={quantities[itemId] ?? 1}
                      onQuantityChange={(delta) => setQuantity(itemId, delta)}
                      isDropdownOpen={!!dropdownOpen[itemId]}
                      onToggleDropdown={toggleDropdown(itemId)}
                      onPricingSelect={handlePricingSelect(itemId)}
                      onAddToCart={() => handleAddToCart(item)}
                      onCardClick={handleCardClick(item, index)}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {Object.values(dropdownOpen).some(Boolean) && (
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen({})} aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
