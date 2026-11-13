'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect to home when already signed in
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
      router.refresh();
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, name: name.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'Registration failed.');
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setError('Something went wrong.');
    }
    setLoading(false);
  };

  // Don't show register form while checking session or when authenticated (redirecting)
  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--cream))' }}>
        <Navbar />
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent mt-32" style={{ borderColor: 'var(--leaf-600)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--cream))' }}>
      <Navbar />
      <main className="pt-36 md:pt-44 pb-16 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border-2 p-8" style={{ borderColor: 'var(--leaf-200)' }}>
          <h1 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--leaf-800)' }}>
            Create account
          </h1>

          {success ? (
            <p className="text-center" style={{ color: 'var(--leaf-600)' }}>
              Account created. Redirecting to sign in…
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--leaf-800)' }}>
                  Name (optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--leaf-200)' }}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--leaf-800)' }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--leaf-200)' }}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--leaf-800)' }}>
                  Password (min 8 characters)
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl border-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--leaf-200)' }}
                  disabled={loading}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-60"
                style={{ backgroundColor: 'var(--leaf-600)' }}
              >
                {loading ? 'Creating account…' : 'Sign up'}
              </button>
            </form>
          )}

          <p className="text-center text-sm mt-6" style={{ color: 'var(--leaf-700)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--leaf-600)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
