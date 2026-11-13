'use client';

import React from 'react';
import { Phone, Mail, MapPin, Leaf, Shield, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { EnquiryForm } from '@/components/EnquiryForm';
import InteractiveMap from '@/components/organisms/InteractiveMap';
import { BRAND } from '@/lib/brand';

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--leaf-100), var(--cream))' }}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-36 sm:pt-40 md:pt-44 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Leaf className="w-8 h-8" style={{ color: 'var(--leaf-600)' }} />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--leaf-600), var(--leaf-500))', WebkitBackgroundClip: 'text' }}>
              Contact Us
            </h1>
            <Leaf className="w-8 h-8" style={{ color: 'var(--leaf-600)' }} />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with {BRAND.name}. We&apos;re here to help you with all your organic product needs.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--leaf-100)' }}>
              <MapPin className="w-6 h-6" style={{ color: 'var(--leaf-600)' }} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Visit Us</h3>
            <p className="text-gray-600 leading-relaxed">
              {BRAND.legalName}<br />
              Khasra no. 355,<br />
              Village- Kanewra, Manda, Meja<br />
              Prayagraj- 212104, Uttar Pradesh
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--leaf-100)' }}>
              <Phone className="w-6 h-6" style={{ color: 'var(--leaf-600)' }} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Call Us</h3>
            <p className="text-gray-600 mb-2">
              Contact us for inquiries about our organic products and services.
            </p>
            <a href="tel:7310400944" className="text-lg font-semibold hover:underline" style={{ color: 'var(--leaf-600)' }}>
              7310400944
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--leaf-100)' }}>
              <Mail className="w-6 h-6" style={{ color: 'var(--leaf-600)' }} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Company Details</h3>
            <p className="text-gray-600 text-sm">
              <strong>CIN:</strong> U01111UP2026PTC241871
            </p>
          </div>
        </div>

        {/* Pocket Map */}
        <div className="mb-12">
          <InteractiveMap />
        </div>

        {/* Certifications */}
        <div className="rounded-2xl p-8 mb-12 text-white" style={{ background: 'linear-gradient(to right, var(--leaf-600), var(--leaf-500))' }}>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-4">Trusted & Certified</h2>
            <p className="opacity-90" style={{ color: 'var(--leaf-100)' }}>Your trust is our most precious ingredient</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
              <Shield className="w-10 h-10 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">FSSAI Certified</h3>
              <p className="opacity-90" style={{ color: 'var(--leaf-100)' }}>10852006000031</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
              <Award className="w-10 h-10 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">GST Registered</h3>
              <p className="opacity-90" style={{ color: 'var(--leaf-100)' }}>06EWFPB8259H1ZD</p>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
}
