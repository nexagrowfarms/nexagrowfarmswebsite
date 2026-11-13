'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { BRAND } from '@/lib/brand';

/**
 * ProductExcellence organism - Showcases moringa product with features.
 * Uses Excellence.png background, moringa product image, feature badges,
 * and Shop Moringa / Enquiry CTAs.
 * @returns Product Excellence section component
 */
const features = [
  '100% Natural',
  'No Additives',
  'Lab Tested',
  'Zero Preservatives',
  'Sustainably Sourced',
  'Farm Fresh',
];

export default function ProductExcellence() {
  return (
    <section
      className="relative w-full overflow-hidden py-5 sm:py-6 md:py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/Excellence.png")',
        backgroundColor: 'var(--cream)',
      }}
    >
      {/* Decorative leaf accents - fill empty corners */}
      <div className="absolute top-6 right-8 w-16 h-20 sm:w-20 sm:h-24 opacity-20 pointer-events-none hidden sm:block" aria-hidden>
        <svg viewBox="0 0 40 50" fill="none" className="w-full h-full" style={{ color: 'var(--leaf-600)' }}>
          <path d="M20 5 Q35 25 20 45 Q15 20 30 5" fill="currentColor" opacity="0.7" />
          <path d="M20 20 Q32 35 20 55 Q8 35 20 20" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
      <div className="absolute top-8 left-6 w-12 h-16 sm:w-16 sm:h-20 opacity-15 pointer-events-none hidden sm:block" aria-hidden>
        <svg viewBox="0 0 40 50" fill="none" className="w-full h-full transform -scale-x-100" style={{ color: 'var(--leaf-600)' }}>
          <path d="M20 5 Q35 25 20 45 Q15 20 30 5" fill="currentColor" opacity="0.7" />
        </svg>
      </div>
      <div className="absolute bottom-8 left-8 w-14 h-20 opacity-15 pointer-events-none hidden md:block" aria-hidden>
        <svg viewBox="0 0 40 50" fill="none" className="w-full h-full" style={{ color: 'var(--leaf-500)' }}>
          <path d="M20 10 Q30 25 20 40 Q15 25 25 10" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
      <div className="absolute bottom-6 right-6 w-12 h-16 opacity-15 pointer-events-none hidden md:block" aria-hidden>
        <svg viewBox="0 0 40 50" fill="none" className="w-full h-full transform -scale-x-100" style={{ color: 'var(--leaf-500)' }}>
          <path d="M20 10 Q30 25 20 40 Q15 25 25 10" fill="currentColor" opacity="0.6" />
        </svg>
      </div>

      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--content-max)' }}>
        {/* Main content: image + title, features, CTAs - dynamically scalable grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Product image - scales dynamically with container */}
          <div className="relative w-full lg:col-span-7 flex justify-center items-center order-1">
            <div className="relative w-full max-w-[620px] lg:max-w-none flex items-center justify-center">
              <Image
                src="/Product_lineup.png"
                alt={`${BRAND.name} Product Lineup`}
                width={1536}
                height={1024}
                className="w-full h-auto max-h-[380px] sm:max-h-[440px] lg:max-h-[500px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                sizes="(max-width: 1024px) 92vw, (max-width: 1440px) 58vw, 750px"
                priority={false}
              />
            </div>
          </div>

          {/* Right column: title + features + description + CTAs */}
          <div className="flex flex-col gap-3 sm:gap-4 w-full lg:col-span-5 order-2">
            {/* Title + Subtitle - inline with content to save space */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-0.5" style={{ color: 'var(--leaf-800)' }}>
                Product Excellence
              </h2>
              <p className="text-sm sm:text-base md:text-lg" style={{ color: 'var(--leaf-700)' }}>
                {BRAND.name} Premium Moringa Powder — Nature&apos;s powerhouse in every spoon
              </p>
            </div>
            {/* Feature badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {features.map((label, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-white/95 backdrop-blur-sm px-3 py-2.5 sm:px-4 sm:py-2.5 shadow-sm hover:shadow-md transition-all text-center"
                  style={{ borderColor: 'var(--stem-light)', borderWidth: '1px' }}
                >
                  <span className="font-semibold text-xs sm:text-sm" style={{ color: 'var(--leaf-800)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--leaf-700)' }}>
              Harvested at peak freshness and processed with care to retain every gram of protein, calcium, and iron. Pure moringa, zero compromises.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link
                href="/collections/moringa"
                className="inline-flex items-center justify-center text-white font-semibold py-2.5 px-5 sm:py-3 sm:px-6 rounded-full text-sm transition-all hover:scale-105 active:scale-95 shadow-lg flex-1 sm:flex-none"
                style={{ backgroundColor: 'var(--leaf-600)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--leaf-700)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--leaf-600)'; }}
              >
                Shop Moringa
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 font-semibold py-2.5 px-5 sm:py-3 sm:px-6 rounded-full text-sm transition-all hover:scale-105 active:scale-95 border-2 flex-1 sm:flex-none"
                style={{ borderColor: 'var(--leaf-600)', color: 'var(--leaf-600)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--leaf-100)';
                  e.currentTarget.style.borderColor = 'var(--leaf-700)';
                  e.currentTarget.style.color = 'var(--leaf-700)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.borderColor = 'var(--leaf-600)';
                  e.currentTarget.style.color = 'var(--leaf-600)';
                }}
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Enquiry?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
