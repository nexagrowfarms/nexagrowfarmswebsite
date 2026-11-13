'use client';

import { useEffect } from 'react';

const IDLE_DELAY_MS = 800;

/**
 * Toggles classes on <html> so the scrollbar is more visible while scrolling
 * and fades when idle (scrollbar-visible / scrollbar-idle).
 */
export default function ScrollbarVisibility() {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const show = () => {
      if (typeof document === 'undefined') return;
      document.documentElement.classList.remove('scrollbar-idle');
      document.documentElement.classList.add('scrollbar-visible');
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        document.documentElement.classList.remove('scrollbar-visible');
        document.documentElement.classList.add('scrollbar-idle');
        timeoutId = null;
      }, IDLE_DELAY_MS);
    };

    const handleScroll = () => show();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
