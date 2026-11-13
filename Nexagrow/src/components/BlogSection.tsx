'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock, Leaf } from 'lucide-react';
import { blogPosts } from '@/lib/blogPosts';

const featuredPosts = blogPosts;

export default function BlogSection() {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 md:py-24"
      style={{ background: 'linear-gradient(180deg, var(--cream) 0%, var(--leaf-50) 50%, var(--cream) 100%)' }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a5f3d' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--content-max)' }}>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'var(--leaf-100)' }}>
            <Leaf className="w-4 h-4" style={{ color: 'var(--leaf-600)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--leaf-700)' }}>
              From the blog
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--leaf-900)' }}>
            Stories on{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(to right, var(--leaf-600), var(--leaf-500))' }}
            >
              our story & moringa
            </span>
          </h2>
          <p className="text-lg" style={{ color: 'var(--leaf-700)' }}>
            Who we are, what moringa does to your body, and why it matters for the planet.
          </p>
        </div>

        {/* Post cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group group/card flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-[var(--leaf-200)] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card image area - image with fallback */}
              <div
                className="relative h-40 sm:h-44 flex items-center justify-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--leaf-100) 0%, var(--leaf-50) 100%)' }}
              >
                {post.image ? (
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <Leaf className="w-12 h-12 opacity-30 transition-transform duration-300 group-hover/card:scale-110" style={{ color: 'var(--leaf-500)' }} />
                )}
              </div>

              <div className="flex flex-col flex-1 p-6">
                <span
                  className="inline-block w-fit text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3"
                  style={{ backgroundColor: 'var(--leaf-100)', color: 'var(--leaf-700)' }}
                >
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover/card:text-[var(--leaf-700)] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime} read
                  </span>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold transition-colors"
                  style={{ color: 'var(--leaf-600)' }}
                >
                  Read more
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/card:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(to right, var(--leaf-500), var(--leaf-600))' }}
          >
            View all posts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
