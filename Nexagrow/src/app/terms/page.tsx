import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--cream))' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-16">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--leaf-800)' }}>Terms & Conditions</h1>
        <p className="text-gray-600 mb-6">
          By using {BRAND.name}&apos;s website and services, you agree to these terms. Please read them carefully.
        </p>
        <p className="text-gray-600 mb-6">
          We reserve the right to modify these terms. Continued use after changes constitutes acceptance. 
          Products are subject to availability. Prices may change without notice.
        </p>
        <Link href="/" className="inline-block font-medium" style={{ color: 'var(--leaf-600)' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
