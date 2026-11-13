'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function ProductPromoCarousel() {
  const { data: products = [], isLoading } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const featured = products.slice(0, 6);
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 300;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  if (isLoading || featured.length === 0) return null;

  return (
    <section className="w-full py-8 sm:py-10" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--cream))' }}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--content-max)' }}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ color: 'var(--leaf-800)' }}>
          Shop Our Products
        </h2>
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            className={`hidden sm:flex shrink-0 z-10 w-10 h-10 items-center justify-center rounded-full border-2 transition-all ${canScrollLeft ? 'bg-white shadow-md hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-default'}`}
            style={{ borderColor: 'var(--leaf-200)', color: canScrollLeft ? 'var(--leaf-700)' : undefined }}
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 scroll-smooth scrollbar-hide flex-1 min-w-0"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {featured.map((p) => (
              <Link
                key={p._id}
                href={`/products/${p._id}`}
                className="shrink-0 w-[260px] sm:w-[280px] bg-white rounded-2xl border-2 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                style={{ borderColor: 'var(--leaf-200)' }}
              >
                <div className="relative aspect-square bg-white">
                  <Image
                    src={p.image || '/placeholder-image.jpg'}
                    alt={p.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="280px"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 line-clamp-2 mb-1">{p.name}</h3>
                  <p className="text-sm font-semibold" style={{ color: 'var(--leaf-600)' }}>
                    ₹{p.pricing?.[0]?.price ?? p.price ?? '—'} <span className="text-xs font-normal text-gray-500">Incl. taxes</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scroll('right')}
            className={`hidden sm:flex shrink-0 z-10 w-10 h-10 items-center justify-center rounded-full border-2 transition-all ${canScrollRight ? 'bg-white shadow-md hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-default'}`}
            style={{ borderColor: 'var(--leaf-200)', color: canScrollRight ? 'var(--leaf-700)' : undefined }}
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
