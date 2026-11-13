'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BRAND } from '@/lib/brand';

const benefitCards = [
  {
    title: "Nature's Superfood",
    description: "Moringa packs protein, iron & vitamins in every spoon. Fuel your day the natural way.",
  },
  {
    title: "Chemical-Free",
    description: "Grown without pesticides. If it isn't chemical-free, it isn't food.",
  },
  {
    title: "Community First",
    description: "We support farmers with fair pay & ethical farming. Better lives, better produce.",
  },
  {
    title: "Easy Daily Use",
    description: "Add to smoothies, teas, or meals for a quick nutrient boost. Simple & powerful.",
  },
  {
    title: "Trusted & Certified",
    description: "FSSAI certified. Quality you can rely on, from harvest to your home.",
  },
  {
    title: "Sustainable Growth",
    description: "From soil to your home—better for you & the planet. Nourishing you, empowering them.",
  },
];

export default function Benefits() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [totalPages, setTotalPages] = useState(benefitCards.length);
  const [activePage, setActivePage] = useState(0);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Boundary checks with 8px tolerance for subpixel rounding
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < maxScroll - 8);

    if (maxScroll <= 10) {
      setTotalPages(1);
      setActivePage(0);
      return;
    }

    // Dynamically calculate how many cards fit in view
    const firstCard = el.querySelector<HTMLElement>('[data-benefit-card]');
    const cardWidth = firstCard?.offsetWidth ?? 300;
    const visibleCards = Math.max(1, Math.floor((el.clientWidth + 16) / (cardWidth + 16)));
    const pages = Math.max(1, Math.ceil(benefitCards.length / visibleCards));
    setTotalPages(pages);

    // Calculate active page smoothly
    if (el.scrollLeft <= 16) {
      setActivePage(0);
    } else if (el.scrollLeft >= maxScroll - 16) {
      setActivePage(pages - 1);
    } else {
      const pageFraction = el.scrollLeft / maxScroll;
      const currentPage = Math.min(pages - 1, Math.max(0, Math.round(pageFraction * (pages - 1))));
      setActivePage(currentPage);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    window.addEventListener('resize', checkScroll);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scrollToPage = (pageIndex: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    if (pageIndex === 0) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    if (pageIndex === totalPages - 1) {
      el.scrollTo({ left: maxScroll, behavior: 'smooth' });
      return;
    }

    const targetScroll = (pageIndex / (totalPages - 1)) * maxScroll;
    el.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  const scroll = (dir: 'left' | 'right') => {
    const nextIdx = dir === 'left' 
      ? Math.max(0, activePage - 1) 
      : Math.min(totalPages - 1, activePage + 1);
    scrollToPage(nextIdx);
  };

  return (
    <section
      className="w-full py-10 sm:py-14 md:py-16"
      style={{
        background: 'linear-gradient(180deg, var(--leaf-50) 0%, var(--leaf-100) 50%, var(--leaf-50) 100%)',
      }}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--content-max)' }}>
        {/* Confined panel: background image + tint stay inside rounded border */}
        <div
          className="relative overflow-hidden rounded-2xl border-2 shadow-sm"
          style={{ borderColor: 'var(--leaf-200)' }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none bg-center bg-no-repeat bg-cover opacity-[0.18]"
            style={{ backgroundImage: 'url(/home.jpeg)' }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(245,247,242,0.92) 0%, rgba(232,238,223,0.9) 50%, rgba(245,247,242,0.92) 100%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L20 40 M0 20 L40 20' stroke='%23435a2f' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10 md:py-12">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--leaf-800)' }}>
                Benefits of Moringa
              </h2>
              <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'var(--leaf-600)' }}>
                Why {BRAND.shortName} moringa belongs in your daily routine
              </p>
            </div>

            <div className="relative flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="hidden sm:flex shrink-0 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-lg border-2 transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: 'var(--leaf-200)', color: 'var(--leaf-700)' }}
                aria-label="Previous benefit"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden pb-4 scroll-smooth scrollbar-hide snap-x snap-mandatory"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {benefitCards.map((card, index) => (
                  <div
                    key={index}
                    data-benefit-card
                    className="shrink-0 w-[280px] min-[400px]:w-[300px] sm:w-[320px] md:w-[340px] snap-center"
                  >
                    <div
                      className="h-full rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 p-5 sm:p-6 flex flex-col justify-center border"
                      style={{ borderColor: 'var(--leaf-200)', minHeight: '200px' }}
                    >
                      <h3 className="font-bold text-base sm:text-lg mb-2 leading-tight" style={{ color: 'var(--leaf-800)' }}>
                        {card.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-snug">
                        {card.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="hidden sm:flex shrink-0 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-lg border-2 transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: 'var(--leaf-200)', color: 'var(--leaf-700)' }}
                aria-label="Next benefit"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6 sm:mt-8">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollToPage(index)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: activePage === index ? 24 : 8,
                      height: 8,
                      backgroundColor: activePage === index ? 'var(--leaf-500)' : 'var(--leaf-200)',
                    }}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
