# Film Content Guide

## Adding a New Film

1. **Copy the template:**
   ```bash
   cp src/content/films/film-template.md src/content/films/your-film-slug.md
   ```

2. **Edit the markdown file** - fill in frontmatter + description

3. **Add images** (optional):
   - Put images in `/public/images/films/your-film-slug/`
   - Reference as `/images/films/your-film-slug/still-1.jpg`
   - Or use external URLs directly

## Image Guidelines

- **For best quality:** Use local images in `/public/images/films/`
- **For quick setup:** Use external URLs (Vimeo thumbnails, Unsplash, etc.)
- **Recommended size:** 1920x1080 for stills
- **Format:** JPG or WebP

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| title | Yes | Film title |
| videoUrl | No | Vimeo/similar embed URL |
| runtime | Yes | e.g., "18:42" |
| format | No | e.g., "DCP", "ProRes" |
| resolution | No | e.g., "4K" |
| year | Yes | Release year |
| client | No | Client/commissioner |
| role | No | Your role |
| stills | No | Array of image URLs |
| credits | No | Array of {role, name} |

## Example

```markdown
---
title: "My New Film"
videoUrl: "https://player.vimeo.com/video/123456"
runtime: "05:30"
year: "2024"
client: "Nike"
role: "Director"
stills:
  - "/images/films/my-new-film/shot-01.jpg"
credits:
  - { role: "Director", name: "Tom Maher" }
  - { role: "Producer", name: "Jane Doe" }
---

A short description of the film...
```

## Testing

```bash
npm run dev
# Visit http://localhost:4321/films
```