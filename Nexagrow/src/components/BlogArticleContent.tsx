import React from 'react';
import type { BlogBlock } from '@/lib/blogPosts';

export default function BlogArticleContent({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={index}
                className="text-xl sm:text-2xl font-bold pt-2"
                style={{ color: 'var(--leaf-800)' }}
              >
                {block.text}
              </h2>
            );
          case 'paragraph':
            return (
              <p key={index} className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--leaf-700)' }}>
                {block.text}
              </p>
            );
          case 'list':
            return (
              <ul key={index} className="space-y-3 pl-5 list-disc">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--leaf-700)' }}>
                    {item}
                  </li>
                ))}
              </ul>
            );
          case 'callout':
            return (
              <div
                key={index}
                className="p-5 sm:p-6 rounded-xl"
                style={{
                  background: 'linear-gradient(to right, var(--leaf-50), var(--leaf-100))',
                  borderLeft: '4px solid var(--leaf-500)',
                }}
              >
                <p className="text-base sm:text-lg leading-relaxed font-medium" style={{ color: 'var(--leaf-800)' }}>
                  {block.text}
                </p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
