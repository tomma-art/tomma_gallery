import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/films');

export function getAllFilms() {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  
  return files.map(filename => {
    const filepath = path.join(CONTENT_DIR, filename);
    const file = fs.readFileSync(filepath, 'utf-8');
    const { data, content } = matter(file);
    const slug = filename.replace(/\.mdx?$/, '');
    
    return {
      slug,
      ...data,
      description: content.trim(),
    };
  }).filter(f => !f.slug.startsWith('_')); // Skip templates
}

export function getFilm(slug: string) {
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
    description: content.trim(),
  };
}

export function resolveFilmImage(slug: string, imagePath: string): string {
  // If it's already a URL (external), use it as-is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Otherwise, resolve to your local images folder
  return `/images/films/${slug}/${imagePath}`;
}