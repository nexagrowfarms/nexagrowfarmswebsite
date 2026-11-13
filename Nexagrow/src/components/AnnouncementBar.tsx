'use client';

/**
 * AnnouncementBar - Scrolling promotional banner at the top of the site.
 * Displays moving messages in a marquee-style strip above the navbar.
 */

const ANNOUNCEMENTS = [
  '🥳 So many perks await! Membership now LIVE',
  '⚡ Big Savings Alert! Get 10% OFF on orders above ₹3000 | Use code - NEXA10',
  '🚚 Enjoy Free Shipping on orders above ₹1499 | Shop Now',
];

export default function AnnouncementBar() {
  return (
    <div
      className="w-full overflow-hidden whitespace-nowrap py-1.5 sm:py-2 text-xs sm:text-sm font-medium"
      style={{ backgroundColor: 'var(--sage)', color: 'var(--charcoal)' }}
      aria-label="Promotional announcements"
    >
      <div className="inline-flex animate-marquee">
        {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((msg, i) => (
          <span key={i} className="mx-12 inline-flex items-center">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
