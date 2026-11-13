"use client";

import React from "react";
import Image from "next/image";

/** From Our Farms: hero image + supporting farm tiles. */
const COLLAGE_IMAGES = [
  { src: "/farms-field.png", alt: "Moringa saplings in our farm field" },
  { src: "/farms-leaves-closeup.png", alt: "Fresh moringa leaves from our farms" },
  { src: "/farms-moringa-tree.png", alt: "Healthy moringa tree at our farm" },
  { src: "/farms-harvest-hands.png", alt: "Hands harvesting fresh moringa leaves on our farm" },
];

/**
 * Moodboard layout: one large hero with three supporting tiles.
 */
const MOODBOARD_LAYOUT = [
  { index: 0, className: "col-span-2 row-span-2 min-h-[280px] sm:min-h-[320px] md:min-h-[380px] rounded-2xl" },
  { index: 1, className: "col-span-1 row-span-1 min-h-[100px] sm:min-h-[130px] rounded-2xl" },
  { index: 2, className: "col-span-1 row-span-1 min-h-[100px] sm:min-h-[130px] rounded-2xl" },
  { index: 3, className: "col-span-2 sm:col-span-2 row-span-1 min-h-[120px] sm:min-h-[130px] rounded-2xl" },
];

/**
 * Collage section with agriculture/farming images.
 * Full layout: moodboard-style (irregular grid, varying sizes). Compact: simple 2x2 grid.
 */
export default function AgricultureCollage({
  title = "From Our Farms",
  subtitle,
  compact = false,
  images: imagesOverride,
  fullWidth = false,
}: {
  title?: string;
  subtitle?: string;
  compact?: boolean;
  /** When provided and compact, use these images for the grid (e.g. Our World in Pictures). */
  images?: { src: string; alt: string }[];
  /** If true, content is not constrained by content-max (full-width layout). */
  fullWidth?: boolean;
}) {
  const containerStyle = fullWidth ? undefined : { maxWidth: 'var(--content-max)' };
  if (compact) {
    const images = imagesOverride?.length ? imagesOverride : COLLAGE_IMAGES.slice(0, 4);
    return (
      <section
        className="w-full py-12 sm:py-14 md:py-16"
        style={{
          background: "linear-gradient(to bottom, var(--leaf-50), var(--leaf-100))",
        }}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={containerStyle}>
          {(title || subtitle) && (
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--leaf-800)" }}>
                {title}
              </h2>
              {subtitle && (
                <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--leaf-700)" }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {images.map((item, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow aspect-square min-h-[120px] sm:min-h-[140px]">
                <Image src={item.src} alt={item.alt} fill className="object-cover object-center" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full py-12 sm:py-14 md:py-16"
      style={{
        background: "linear-gradient(to bottom, var(--leaf-50), var(--leaf-100))",
      }}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={containerStyle}>
        {(title || subtitle) && (
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--leaf-800)" }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--leaf-700)" }}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {/* Moodboard-style: irregular grid, varying sizes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {MOODBOARD_LAYOUT.map(({ index, className }) => {
            const item = COLLAGE_IMAGES[index];
            if (!item) return null;
            return (
              <div
                key={index}
                className={`relative overflow-hidden shadow-md hover:shadow-lg transition-shadow ${className}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
