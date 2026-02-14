import { getAllPosts, getAllCategories } from "@/lib/posts";
import Link from "next/link";
import PostsList from "./components/PostsList";

export default function Home() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                개발 블로그
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                프로토타입
              </p>
            </div>
            <Link 
              href="/todo" 
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 whitespace-nowrap hidden sm:inline-block"
            >
              ✓ Todo List
            </Link>
          </div>
        </div>
      </section>

      <PostsList allPosts={allPosts} categories={categories} />

      {/* Mobile Todo Button */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Link 
          href="/todo" 
          className="flex items-center justify-center w-14 h-14 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 font-semibold text-xl"
        >
          ✓
        </Link>
      </div>
    </main>
  )
}
