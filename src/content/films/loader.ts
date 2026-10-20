import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/films');
const PUBLIC_DIR = path.join(process.cwd(), 'public/images/films');

function urlEncodeFilename(f: string): string {
  return f.replace(/ /g, '%20');
}

function getFilmImages(slug: string): string[] {
  const folderPath = path.join(PUBLIC_DIR, slug);
  if (fs.existsSync(folderPath)) {
    return fs.readdirSync(folderPath)
      .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .filter(f => !/^thumbnail\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .sort()
      .map(f => `/images/films/${slug}/${urlEncodeFilename(f)}`);
  }
  return [];
}

function getFilmThumbnail(slug: string): string | null {
  const folderPath = path.join(PUBLIC_DIR, slug);
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    const thumb = files.find(f => /^thumbnail\.(jpg|jpeg|png|webp)$/i.test(f));
    if (thumb) {
      return `/images/films/${slug}/${urlEncodeFilename(thumb)}`;
    }
  }
  return null;
}

export function getAllFilms() {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  
  return files
    .map(filename => {
      const filepath = path.join(CONTENT_DIR, filename);
      const file = fs.readFileSync(filepath, 'utf-8');
      const { data, content } = matter(file);
      const slug = filename.replace(/\.mdx?$/, '');
      
      // Auto-discover stills from folder if not specified
      let stills = data.stills || [];
      if (stills.length === 0) {
        stills = getFilmImages(slug);
      }
      
      const thumbnail = data.thumbnail || getFilmThumbnail(slug);
      
      return {
        slug,
        ...data,
        stills,
        thumbnail,
        description: content.trim(),
      };
    })
    .filter(f => !f.slug.startsWith('_'))
    .sort((a, b) => (a.order || 999) - (b.order || 999));
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
  return `/images/films/${slug}/${urlEncodeFilename(imagePath)}`;
}