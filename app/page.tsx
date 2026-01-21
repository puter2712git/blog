import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-8">내 블로그 목록</h1>
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
