import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const postsDirectory = path.join(process.cwd(), 'content')

export interface PostData {
  slug: string;
  title: string;
  date: string;
  description: string;
  contentHtml?: string;
  tags: string[];
}

function getFilesRecursively(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.map((entry) => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() ? getFilesRecursively(res) : res;
  });
  return Array.prototype.concat(...files);
}

export function getAllPosts(): PostData[] {
  const allFilePaths = getFilesRecursively(postsDirectory);

  const mdFiles = allFilePaths.filter(filePath => filePath.endsWith('.md'));
  
  const allPostsData = mdFiles.map((fullPath) => {
    const fileName = path.basename(fullPath);
    const slug = fileName.replace(/\.md$/, '');

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      tags: data.tags || [],
    } as PostData;
  });

  return allPostsData.sort((p0, p1) => (p0.date < p1.date ? 1 : -1));
}

export async function getPostData(slug: string) {
  const allFilePaths = getFilesRecursively(postsDirectory);
  const targetFilePath = allFilePaths.find(fp => fp.endsWith(`${slug}.md`));

  if (!targetFilePath) {
    throw new Error(`Post with slug "${slug}" not found.`);
  }

  const fileContents = fs.readFileSync(targetFilePath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    tags: data.tags || [],
    ...(data as { title: string, date: string, description: string }),
  };
}