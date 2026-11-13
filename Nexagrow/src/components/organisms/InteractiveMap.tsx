'use client';

import React, { useState } from 'react';
import { MapPin, Satellite, Map, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react';
import { BRAND } from '@/lib/brand';

const googleMapsUrl = 'https://www.google.com/maps?q=25.14704,82.239736';

/**
 * Pocket Map - Compact when closed, expands on click to show full map.
 */
export default function InteractiveMap() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const toggleMapType = () => setMapType((prev) => (prev === 'roadmap' ? 'satellite' : 'roadmap'));
  const openInGoogleMaps = () => window.open(googleMapsUrl, '_blank');

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 ease-out"
      style={{ borderColor: 'var(--leaf-200)' }}
    >
      {/* Pocket header - always visible, clickable */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5 bg-white hover:bg-[var(--leaf-50)] transition-colors text-left"
        aria-expanded={isExpanded}
        aria-controls="pocket-map-content"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--leaf-100)' }}
          >
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--leaf-600)' }} />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg" style={{ color: 'var(--leaf-800)' }}>
              View our location
            </h3>
            <p className="text-sm" style={{ color: 'var(--leaf-600)' }}>
              Kanewra, Manda, Meja • Prayagraj, Uttar Pradesh
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hidden sm:inline" style={{ color: 'var(--leaf-600)' }}>
            {isExpanded ? 'Collapse' : 'Open map'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" style={{ color: 'var(--leaf-600)' }} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: 'var(--leaf-600)' }} />
          )}
        </div>
      </button>

      {/* Expandable map content - rolls open/closed */}
      <div
        id="pocket-map-content"
        className="transition-all duration-300 ease-out overflow-hidden"
        style={{ maxHeight: isExpanded ? 'min(450px, 55vh)' : 0 }}
      >
        <div className="relative bg-gray-50">
          {/* Map controls */}
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMapType();
              }}
              className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-50 transition-colors"
              title={mapType === 'roadmap' ? 'Satellite view' : 'Street view'}
            >
              {mapType === 'roadmap' ? (
                <Satellite className="w-5 h-5 text-gray-700" />
              ) : (
                <Map className="w-5 h-5 text-gray-700" />
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openInGoogleMaps();
              }}
              className="bg-white shadow-md rounded-lg p-2 hover:bg-gray-50 transition-colors"
              title="Open in Google Maps"
            >
              <Maximize2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Map iframe */}
          <div className="relative w-full h-[400px] min-h-[280px]">
            <iframe
                key={mapType}
                src={`https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3404.7459736776973!2d82.239736!3d25.14704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDA4JzQ5LjMiTiA4MsKwMTQnMjMuMSJF!5e${mapType === 'satellite' ? '1' : '0'}!3m2!1sen!2sin!4v1769949202263!5m2!1sen!2sin`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
                title={`${BRAND.name} Location`}
              />
          </div>
        </div>
      </div>
    </div>
  );
}
