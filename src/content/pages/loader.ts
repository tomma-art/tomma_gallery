import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/pages');

export function getPage(slug: string) {
  const filepath = path.join(CONTENT_DIR, `${slug}.md`);
  const altFilepath = path.join(CONTENT_DIR, `${slug}.mdx`);
  
  if (!fs.existsSync(filepath) && !fs.existsSync(altFilepath)) {
    return null;
  }
  
  const filePath = fs.existsSync(filepath) ? filepath : altFilepath;
  const file = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(file);
  
  return {
    slug,
    ...data,
    content: content.trim(),
  };
}