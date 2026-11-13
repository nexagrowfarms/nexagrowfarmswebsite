'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';
import { BRAND } from '@/lib/brand';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEmail('');
      // TODO: wire to newsletter API
    }
  };

  return (
    <footer className="relative border-t overflow-hidden" style={{ borderColor: 'var(--leaf-200)' }}>
      {/* Full-footer background image - low opacity */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden
        style={{
          backgroundImage: 'url("/footer .png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          opacity: 0.38,
        }}
      />
      <div className="absolute inset-0 z-[1]" style={{ backgroundColor: 'color-mix(in srgb, var(--cream) 82%, transparent)' }} aria-hidden />

      {/* Content overlay */}
      <div className="relative z-10">
      {/* Upper content section */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16" style={{ maxWidth: 'var(--content-max)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Logo */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block">
              <Image
                src={BRAND.logo}
                alt={BRAND.shortName}
                width={72}
                height={72}
                className="h-16 w-16 object-contain"
              />
            </Link>
          </div>

          {/* Newsletter & links — single bordered block */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className="rounded-2xl border-2 bg-white/70 backdrop-blur-sm p-5 sm:p-6 shadow-sm"
              style={{ borderColor: 'var(--leaf-200)' }}
            >
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--leaf-800)' }}>
                The Organic Way of Life
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--leaf-600)' }}>
                Subscribe for special offers, newsletters and become a part of our movement.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mb-5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your e-mail"
                  className="flex-1 min-w-0 px-4 py-3 rounded-lg border-2 text-sm outline-none focus:ring-2"
                  style={{ borderColor: 'var(--leaf-200)' }}
                />
                <button
                  type="submit"
                  className="shrink-0 px-4 py-3 rounded-lg font-semibold text-white text-sm"
                  style={{ backgroundColor: 'var(--leaf-600)' }}
                >
                  →
                </button>
              </form>

              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-4 border-t" style={{ borderColor: 'var(--leaf-200)' }}>
                <Link
                  href="/privacy-policy"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: 'var(--leaf-800)' }}
                >
                  Privacy Policy
                </Link>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <Link
                  href="/terms"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: 'var(--leaf-800)' }}
                >
                  Terms & Conditions
                </Link>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <Link
                  href="/refund-policy"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: 'var(--leaf-800)' }}
                >
                  Refund Policy
                </Link>
              </div>
            </div>

            {/* Social media icons */}
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors hover:bg-[var(--leaf-50)]"
                style={{ borderColor: 'var(--leaf-200)', color: 'var(--leaf-600)' }}
                aria-label="Facebook"
              >
                <span className="text-sm font-bold">f</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors hover:bg-[var(--leaf-50)]"
                style={{ borderColor: 'var(--leaf-200)', color: 'var(--leaf-600)' }}
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors hover:bg-[var(--leaf-50)]"
                style={{ borderColor: 'var(--leaf-200)', color: 'var(--leaf-600)' }}
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors hover:bg-[var(--leaf-50)]"
                style={{ borderColor: 'var(--leaf-200)', color: 'var(--leaf-600)' }}
                aria-label="LinkedIn"
              >
                <span className="text-xs font-bold">in</span>
              </a>
            </div>
          </div>

          {/* Our Info - Visit Us & Contact Us */}
          <div className="lg:col-span-4 min-w-0">
            <div
              className="bg-[var(--cream)] rounded-2xl p-5 sm:p-6 md:p-7 shadow-sm border-2 overflow-hidden"
              style={{ borderColor: 'var(--leaf-200)' }}
            >
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 shrink-0" style={{ color: 'var(--leaf-500)' }} />
                    Visit Us
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed break-words">
                    {BRAND.legalName}<br />
                    Khasra no. 355,<br />
                    Village- Kanewra, Manda, Meja<br />
                    Prayagraj- 212104, Uttar Pradesh
                  </p>
                </div>
                <div className="min-w-0 pr-0">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    Contact Us
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: 'var(--leaf-500)' }} />
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 break-words">
                    <strong>CIN:</strong> {BRAND.cin}
                  </p>
                  <a
                    href="tel:7310400944"
                    className="inline-flex items-center gap-2 text-sm hover:underline mb-2"
                    style={{ color: 'var(--leaf-600)' }}
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    7310400944
                  </a>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="inline-flex items-start gap-2 text-sm hover:underline break-all"
                    style={{ color: 'var(--leaf-600)' }}
                  >
                    <Mail className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{BRAND.email}</span>
                  </a>
                  <p className="text-xs text-gray-500 mt-3 leading-snug">
                    For the enquiry form and map, use <strong className="text-gray-600">Contact</strong> in the site header.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom bar — legal links live in the newsletter block above; avoid duplicate links here */}
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 sm:px-6 lg:px-8 py-4 text-center"
        style={{ backgroundColor: 'var(--leaf-900)', color: 'var(--cream)' }}
      >
        <p className="text-sm">
          © {new Date().getFullYear()} {BRAND.shortName}. All rights reserved.
        </p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
