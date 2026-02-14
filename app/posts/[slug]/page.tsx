import { getAllPosts, getPostData } from "@/lib/posts";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

function extractHeadings(html: string) {
  const headingRegex = /<h([1-3]) id="([^"]*)"[^>]*>([^<]+)<\/h\1>/g;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      text: match[3],
      id: match[2],
    });
  }

  return headings;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  if (!postData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            글을 찾을 수 없습니다.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const headings = extractHeadings(postData.contentHtml);
  const formattedDate = new Date(postData.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header with back button */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-purple-400 hover:text-blue-700 dark:hover:text-purple-300 transition-colors font-medium"
          >
            <span>←</span>
            목록으로
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {postData.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <time dateTime={postData.date}>{formattedDate}</time>
                </div>
                
                {/* Tags */}
                {postData.tags && postData.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>🏷️</span>
                    <div className="flex gap-2 flex-wrap">
                        {postData.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-t border-slate-200 dark:border-slate-700" />
            </div>

            {/* Content */}
            <div
              className="prose dark:prose-invert prose-slate max-w-none
                prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-gray-900 dark:prose-h2:text-white
                prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-gray-800 dark:prose-h3:text-gray-100
                prose-p:text-lg prose-p:leading-8 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:mb-5
                prose-a:text-blue-600 dark:prose-a:text-purple-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-code:text-red-600 dark:prose-code:text-red-400 prose-code:bg-red-50 dark:prose-code:bg-red-950/30
                prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:py-4 prose-pre:px-6
                prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-4 prose-blockquote:italic
                prose-ul:list-disc prose-ul:ml-6 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-2
                prose-table:border-collapse prose-th:bg-slate-200 dark:prose-th:bg-slate-700 prose-th:p-3 prose-th:text-left
                prose-td:border prose-td:border-slate-300 dark:prose-td:border-slate-600 prose-td:p-3
                prose-img:rounded-lg prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
            />

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  마지막 수정: <time dateTime={postData.date}>{formattedDate}</time>
                </p>
                <Link
                  href="/"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  목록으로
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar with Table of Contents */}
          <aside className="hidden lg:block">
            {headings.length > 0 && (
              <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                  목차
                </h2>
                <nav className="space-y-2">
                  {headings.map((heading, index) => (
                    <a
                      key={index}
                      href={`#${heading.id}`}
                      className={`text-sm transition-colors block truncate ${
                        heading.level === 1
                          ? 'font-bold text-gray-900 dark:text-white'
                          : heading.level === 2
                            ? 'font-semibold text-gray-800 dark:text-gray-200 ml-3'
                            : 'text-gray-700 dark:text-gray-400 ml-6 hover:text-blue-600 dark:hover:text-purple-400'
                      }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}