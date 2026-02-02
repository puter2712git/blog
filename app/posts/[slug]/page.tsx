import { getAllPosts, getPostData } from "@/lib/posts";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  if (!postData) return <div>글을 찾을 수 없습니다.</div>;

  return (
    <article className="p-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </article>
  )
}