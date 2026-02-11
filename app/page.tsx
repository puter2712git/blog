import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">내 블로그 목록</h1>
        <Link 
          href="/todo" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          📝 Todo List
        </Link>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.slug} className="border-b pb-4">
            <Link href={`/posts/${post.slug}`} className="text-xl font-semibold text-blue-600">
              {post.title}
            </Link>
            <p className="text-gray-500">{post.date}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
