import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--cream))' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-16">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--leaf-800)' }}>Privacy Policy</h1>
        <p className="text-gray-600 mb-6">
          {BRAND.name} respects your privacy. This policy outlines how we collect, use, and protect your personal information.
        </p>
        <p className="text-gray-600 mb-6">
          We collect information you provide when placing orders, subscribing to our newsletter, or contacting us. 
          Your data is used to process orders, improve our services, and communicate with you. We do not sell your personal information.
        </p>
        <Link href="/" className="inline-block font-medium" style={{ color: 'var(--leaf-600)' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
