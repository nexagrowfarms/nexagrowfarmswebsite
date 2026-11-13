"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/brand';

/**
 * Hero organism - Main landing section with headline and CTA.
 * Displays responsive background (mobile.webp on mobile, herosection.webp on desktop),
 * "THE HARMONY OF MORINGA" headline, and TRY IT NOW button.
 * @returns Hero section component
 */
const Hero = () => {
  return (
    <div className="relative w-full min-h-[90vh] sm:min-h-[650px] md:min-h-[720px] lg:min-h-[800px] overflow-hidden">
      {/* Hero Section Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {/* Mobile hero image - object-[center_55%] shows product packaging & bottom elements */}
        <Image
          src="/mobile.webp"
          alt={`${BRAND.name} Hero - Mobile`}
          fill
          className="object-cover object-[center_55%] animate-fade-in md:hidden"
          priority
          quality={90}
          sizes="100vw"
        />
        {/* Desktop hero image */}
        <Image
          src="/herosection.webp"
          alt={`${BRAND.name} Hero Section`}
          fill
          className="object-cover object-[85%_center] animate-fade-in hidden md:block"
          priority
          quality={90}
          sizes="100vw"
        />
        {/* Animated overlay for better text readability – stronger on mobile for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/15 to-transparent sm:from-white/40 sm:via-transparent sm:to-transparent animate-gradient-shift"></div>

        {/* Floating particles – leaf theme (hidden on mobile, visible on tablet+) */}
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          <div className="absolute top-20 right-20 w-2 h-2 rounded-full opacity-60 animate-float-1" style={{ backgroundColor: 'var(--leaf-400)' }}></div>
          <div className="absolute top-40 right-40 w-1.5 h-1.5 rounded-full opacity-50 animate-float-2" style={{ backgroundColor: 'var(--leaf-500)' }}></div>
          <div className="absolute bottom-32 right-32 w-2.5 h-2.5 rounded-full opacity-40 animate-float-3" style={{ backgroundColor: 'var(--leaf-300)' }}></div>
          <div className="absolute bottom-48 left-24 w-2 h-2 rounded-full opacity-50 animate-float-4" style={{ backgroundColor: 'var(--stem-light)' }}></div>
        </div>
      </div>

      {/* Transparent navbar overlay area - allows navbar to blend seamlessly */}
      <div className="absolute top-0 left-0 right-0 h-20 z-30 pointer-events-none"></div>

      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-8 pt-36 sm:pt-40 md:pt-44 lg:pt-48 pb-6 sm:pb-10 md:pb-12 h-full min-h-[85vh] sm:min-h-[600px] md:min-h-[650px] lg:min-h-[700px] flex flex-col justify-start sm:justify-center" style={{ maxWidth: 'var(--content-max)', paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center h-full">
          {/* Left Side - Content - tighter spacing on mobile so bottom elements stay visible */}
          <div className="space-y-3 sm:space-y-5 md:space-y-6 lg:space-y-8">
            {/* Headline with staggered animations – responsive sizing */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="font-bold leading-tight">
                <span className="block text-3xl sm:text-3xl md:text-4xl lg:text-5xl uppercase animate-slide-up-1" style={{ color: 'var(--leaf-800)' }}>THE</span>
                <span className="block text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase animate-slide-up-2 leading-tight" style={{ color: 'var(--leaf-800)' }}>HARMONY</span>
                <span className="block text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase animate-slide-up-3 leading-tight" style={{ color: 'var(--leaf-900)' }}>OF MORINGA</span>
              </h1>
            </div>

            {/* Sub-headline – bigger on phone */}
            <p className="text-xl sm:text-lg md:text-xl lg:text-2xl font-medium animate-fade-in-delay" style={{ color: 'var(--leaf-800)' }}>
              Nature&apos;s answer to everyday health
            </p>

            {/* CTA Button – leaf/stem theme, bigger on phone */}
            <div className="pt-2 sm:pt-4 animate-fade-in-delay-2">
              <Link
                href="/collections/moringa"
                className="inline-block text-white font-bold py-4 px-8 sm:py-4 sm:px-8 rounded-full text-xl sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-pulse-slow"
                style={{ backgroundColor: 'var(--leaf-600)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--leaf-700)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--leaf-600)'; }}
              >
                SHOP NOW
              </Link>
            </div>
          </div>

          {/* Right Side - Product Image is already in the background image */}
          <div className="hidden lg:block"></div>
        </div>
      </div>

    </div>
  );
};

export default Hero;
