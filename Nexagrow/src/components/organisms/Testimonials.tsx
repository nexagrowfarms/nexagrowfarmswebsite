"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { BRAND } from "@/lib/brand";

/**
 * Testimonial item shape for client feedback cards.
 */
interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: number;
  text: string;
  initials: string;
  /** Profile image path (e.g. in /public). Falls back to initials if missing. */
  image?: string;
}

const UNSPLASH = "https://images.unsplash.com";
const avatar = (id: string) =>
  `${UNSPLASH}/photo-${id}?w=128&h=128&fit=crop&crop=face`;

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Wellness Coach",
    rating: 5,
    initials: "PS",
    image: avatar("1494790108377-be9c29b29330"),
    text: `${BRAND.name} Moringa has become a daily staple for me and my clients. The quality is consistent and you can tell it's grown with care. Highly recommend for anyone looking for clean, potent nutrition.`,
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Fitness Enthusiast",
    rating: 5,
    initials: "RM",
    image: avatar("1507003211169-0a1dd7228f2d"),
    text: `I've tried several Moringa brands. ${BRAND.name} stands out for taste and freshness. No aftertaste, mixes well in smoothies. My energy levels have noticeably improved since I started.`,
  },
  {
    id: 3,
    name: "Anita Desai",
    role: "Nutritionist",
    rating: 5,
    initials: "AD",
    image: avatar("1573496359142-b8d87734a5a2"),
    text: `As a nutritionist I recommend only products I trust. ${BRAND.name}'s chemical-free approach and transparency about sourcing make it a brand I'm happy to suggest to my patients.`,
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Organic Farmer",
    rating: 5,
    initials: "VS",
    image: avatar("1472099645785-5658abf4ff4e"),
    text: `Knowing the team behind ${BRAND.name} and their commitment to fair farming practices, I feel good every time I order. Great product and a company that cares about the whole chain.`,
  },
  {
    id: 5,
    name: "Kavita Reddy",
    role: "Busy Professional",
    rating: 5,
    initials: "KR",
    image: avatar("1580489944761-15a19d654956"),
    text: `I needed something quick and nutritious for my hectic schedule. One spoon of ${BRAND.name} Moringa in my morning drink and I'm set. Simple, effective, and genuinely organic.`,
  },
  {
    id: 6,
    name: "Arjun Patel",
    role: "Health Blogger",
    rating: 5,
    initials: "AP",
    image: avatar("1500648767791-00dcc994a43e"),
    text: `After reviewing dozens of superfoods, ${BRAND.name} Moringa is in my top three. The packaging is thoughtful, delivery is prompt, and the product speaks for itself. Worth every rupee.`,
  },
  {
    id: 7,
    name: "Meera Krishnan",
    role: "Yoga Instructor",
    rating: 5,
    initials: "MK",
    image: avatar("1544005313-94ddf0286d2b"),
    text: `I combine yoga with clean nutrition. ${BRAND.name} fits perfectly into that lifestyle. No fillers, no nonsense—just pure Moringa. My students ask me where I get it from.`,
  },
  {
    id: 8,
    name: "Suresh Nair",
    role: "Retired Teacher",
    rating: 5,
    initials: "SN",
    image: avatar("1560250097-0b93528c311a"),
    text: `At my age I pay attention to what I put in my body. ${BRAND.name} gives me peace of mind. The team is responsive and the product is exactly as described. Will order again.`,
  },
];

const CARDS_PER_PAGE = 4;

/**
 * Testimonials organism - Client feedback section with cards, ratings, and Load More.
 * Matches homepage leaf theme; placed below Benefits.
 */
export default function Testimonials() {
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);
  const testimonials = INITIAL_TESTIMONIALS;
  const visible = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + CARDS_PER_PAGE, testimonials.length));
  };

  return (
    <section
      className="w-full py-14 sm:py-16 md:py-20"
      style={{ background: "linear-gradient(to bottom, var(--leaf-50), var(--cream))" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-block w-12 h-px mb-3" style={{ backgroundColor: "var(--leaf-300)" }} aria-hidden />
          <p className="text-sm font-medium uppercase tracking-wide mb-2" style={{ color: "var(--leaf-600)" }}>
            Client Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span style={{ color: "var(--leaf-800)" }}>What Our </span>
            <span style={{ color: "var(--leaf-600)" }}>Clients Are Saying</span>
          </h2>
        </div>

        {/* Mobile/tablet: horizontal sliding carousel; desktop: grid */}
        <div className="flex lg:grid overflow-x-auto overflow-y-visible gap-6 lg:gap-8 snap-x snap-mandatory pb-2 lg:pb-0 lg:grid-cols-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visible.map((t, index) => (
            <article
              key={t.id}
              className="relative rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow border shrink-0 w-[85vw] sm:w-[75vw] md:w-[60vw] lg:w-auto snap-center animate-testimonial-slide-in"
              style={{
                borderColor: "var(--leaf-200)",
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Quote icon - top right */}
              <div
                className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full opacity-20"
                style={{ backgroundColor: "var(--leaf-200)" }}
                aria-hidden
              >
                <Quote className="w-6 h-6" style={{ color: "var(--leaf-600)" }} />
              </div>

              {/* Profile row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 relative bg-leaf-100">
                  {t.image ? (
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-lg font-bold"
                      style={{ backgroundColor: "var(--leaf-100)", color: "var(--leaf-700)" }}
                    >
                      {t.initials}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-base" style={{ color: "var(--leaf-800)" }}>
                    {t.name}
                  </p>
                  <p className="text-sm" style={{ color: "var(--leaf-600)" }}>
                    {t.role}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current"
                      style={{ color: "var(--leaf-500)" }}
                      aria-hidden
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--leaf-800)" }}>
                  {t.rating}.0
                </span>
              </div>

              {/* Testimonial text */}
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{t.text}</p>
            </article>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={loadMore}
              className="px-8 py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: "var(--leaf-600)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--leaf-700)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--leaf-600)";
              }}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
