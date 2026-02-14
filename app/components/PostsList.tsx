'use client';

import Link from "next/link";
import { useState, useMemo } from "react";
import { PostData } from "@/lib/posts";

interface PostsListProps {
  allPosts: PostData[];
  categories: string[];
}

export default function PostsList({ allPosts, categories }: PostsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') {
      return allPosts;
    }
    return allPosts.filter(post => post.category === selectedCategory);
  }, [allPosts, selectedCategory]);

  return (
    <>
      {/* Category Filter Section */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                !selectedCategory || selectedCategory === 'all'
                  ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-purple-400'
              }`}
            >
              전체 ({allPosts.length})
            </button>
            {categories.map((category) => {
              const count = allPosts.filter(p => p.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-purple-400'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            {selectedCategory && selectedCategory !== 'all' 
              ? `${selectedCategory} 포스트` 
              : '최근 포스트'}
          </h2>

          <div className="grid gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Link 
                  key={post.slug} 
                  href={`/posts/${post.slug}`}
                  className="group"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-purple-400">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {post.category}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
                          <span>📅</span>
                          {new Date(post.date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className="text-2xl text-gray-300 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  아직 포스트가 없습니다. 곧 작성될 예정입니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
