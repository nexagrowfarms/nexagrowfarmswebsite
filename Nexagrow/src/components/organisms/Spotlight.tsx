'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { BRAND } from '@/lib/brand';

interface SpotlightItem {
  id: number;
  productName: string;
  testimonial: string;
  reviewer: string;
  image: string;
  blockColor: string;
}

const SPOTLIGHT_ITEMS: SpotlightItem[] = [
  {
    id: 1,
    productName: 'Premium Moringa Powder',
    testimonial: "I've been having this moringa for two weeks, and it's the best organic one I've tried - natural taste, nutrient-rich. If you hit the gym, this is a must-have.",
    reviewer: 'Ajinkya R',
    image: '/powder_packaging.webp',
    blockColor: '#9E421E',
  },
  {
    id: 2,
    productName: 'Moringa Oil',
    testimonial: "Absolutely love this! Not just oil - a real food upgrade. Honest ingredients, no shortcuts. Finally, something we can feel good using for our families.",
    reviewer: 'Anand M',
    image: '/oil_packaging.webp',
    blockColor: '#26473C',
  },
  {
    id: 3,
    productName: 'Organic Moringa Leaf',
    testimonial: `After trying several brands, ${BRAND.name} stands out. The quality is consistent and you can tell it's grown with care. Highly recommend for daily nutrition.`,
    reviewer: 'Priya S',
    image: '/Leaves.jpg',
    blockColor: '#7AA1B1',
  },
  {
    id: 4,
    productName: 'Moringa Capsules',
    testimonial: "Simple, effective, and genuinely organic. One capsule daily and I'm set. No fillers, no nonsense - just pure moringa. Worth every rupee.",
    reviewer: 'Rahul M',
    image: '/capsule.webp',
    blockColor: '#2C2C2A',
  },
];

export default function Spotlight() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Auto-scroll every 6 seconds (5–7 sec range)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 10;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 320, behavior: 'smooth' });
      }
      setTimeout(checkScroll, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 320;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  return (
    <section className="relative w-full py-14 sm:py-16 md:py-20 overflow-hidden bg-white">
      {/* Wave at bottom - green fills section, wavy edge touches bottom */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="spotlight-wave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F1E5D2" />
            <stop offset="40%" stopColor="#F8F3E9" />
            <stop offset="70%" stopColor="#E4E5D6" />
            <stop offset="100%" stopColor="#A4B290" />
          </linearGradient>
        </defs>
        {/* Green fills from top, wave curves at the very bottom */}
        <path
          fill="url(#spotlight-wave)"
          d="M0,0 L1440,0 L1440,300 Q1080,240 720,280 Q360,260 0,300 Z"
        />
      </svg>
      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--content-max)' }}>
        <div className="flex items-baseline gap-2 mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--leaf-700)' }}>
            Spotlight
          </h2>
          <div className="relative inline-flex shrink-0">
            <Star className="h-7 w-7 fill-[var(--leaf-500)]" style={{ color: 'var(--leaf-500)' }} />
            <Star className="absolute h-4 w-4 fill-[var(--leaf-400)] opacity-90" style={{ color: 'var(--leaf-400)', top: '-0.6rem', left: '50%' }} />
            <Star className="absolute h-3.5 w-3.5 fill-[var(--leaf-400)] opacity-85" style={{ color: 'var(--leaf-400)', top: '-0.9rem', left: '85%' }} />
          </div>
        </div>

        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="hidden sm:flex absolute left-0 z-20 w-10 h-10 -ml-2 items-center justify-center rounded-full bg-white/90 shadow-lg border-2 transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: 'var(--leaf-200)', color: 'var(--leaf-700)' }}
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {SPOTLIGHT_ITEMS.map((item) => (
              <Link
                key={item.id}
                href="/collections/moringa"
                className="shrink-0 w-[260px] min-[400px]:w-[280px] sm:w-[300px] md:w-[320px] rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--leaf-50)]">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 300px, 320px"
                  />
                </div>
                <div
                  className="p-5 rounded-b-2xl text-white"
                  style={{ backgroundColor: item.blockColor }}
                >
                  <h3 className="font-bold text-lg mb-2">{item.productName}</h3>
                  <p className="text-sm opacity-95 leading-relaxed mb-3 line-clamp-3">
                    {item.testimonial}
                  </p>
                  <p className="text-sm font-medium text-right opacity-90">{item.reviewer}</p>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="hidden sm:flex absolute right-0 z-20 w-10 h-10 -mr-2 items-center justify-center rounded-full bg-white/90 shadow-lg border-2 transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: 'var(--leaf-200)', color: 'var(--leaf-700)' }}
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
