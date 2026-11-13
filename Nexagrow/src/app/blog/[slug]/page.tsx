'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { blogPostsBySlug } from '@/lib/blogPosts';
import BlogArticleContent from '@/components/BlogArticleContent';

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const post = slug ? blogPostsBySlug[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--leaf-100), var(--cream))' }}>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 pt-36 pb-12 text-center">
          <p className="mb-4" style={{ color: 'var(--leaf-700)' }}>Post not found.</p>
          <Link href="/blog" className="font-semibold hover:underline" style={{ color: 'var(--leaf-600)' }}>
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--leaf-100), var(--cream))' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
          style={{ color: 'var(--leaf-600)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
        <article className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg">
          <div className="flex items-center gap-3 text-sm mb-4" style={{ color: 'var(--leaf-600)' }}>
            <span className="px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'var(--leaf-100)', color: 'var(--leaf-700)' }}>
              {post.category}
            </span>
            <span>{post.date}</span>
            <span>{post.readTime} read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-8" style={{ color: 'var(--leaf-900)' }}>
            {post.title}
          </h1>
          <BlogArticleContent blocks={post.blocks} />
        </article>
      </div>
    </div>
  );
}
