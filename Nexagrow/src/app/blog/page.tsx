'use client';

import React from 'react';
import { FileText, Leaf, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { blogPosts } from '@/lib/blogPosts';

export default function BlogPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--leaf-100), var(--cream))' }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-36 sm:pt-40 md:pt-44 pb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <FileText className="w-8 h-8" style={{ color: 'var(--leaf-600)' }} />
            <h1
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(to right, var(--leaf-600), var(--leaf-500))', WebkitBackgroundClip: 'text' }}
            >
              Blog
            </h1>
            <FileText className="w-8 h-8" style={{ color: 'var(--leaf-600)' }} />
          </div>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--leaf-700)' }}>
            Our story, the science behind moringa, and why it matters for farmers and the planet.
          </p>
        </div>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 text-sm mb-3" style={{ color: 'var(--leaf-600)' }}>
                <span className="px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'var(--leaf-100)', color: 'var(--leaf-700)' }}>
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span>{post.readTime} read</span>
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--leaf-900)' }}>
                {post.title}
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: 'var(--leaf-700)' }}>
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 font-semibold transition-colors"
                style={{ color: 'var(--leaf-600)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--leaf-700)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--leaf-600)'; }}
              >
                Read more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-2xl p-8 text-center text-white" style={{ background: 'linear-gradient(to right, var(--leaf-600), var(--leaf-500))' }}>
          <Leaf className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h2 className="text-xl font-bold mb-2">Stay in the loop</h2>
          <p className="text-sm opacity-90 mb-4" style={{ color: 'var(--leaf-100)' }}>
            New posts on our story, moringa science, and sustainable farming.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm"
            style={{ color: 'var(--leaf-600)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--leaf-50)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
          >
            Contact us
          </Link>
        </section>
      </div>
    </div>
  );
}
