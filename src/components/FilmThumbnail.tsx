import { useState, useEffect, useRef } from 'react';

interface Props {
  stills: string[];
  alt: string;
  thumbnail?: string;
}

export default function FilmThumbnail({ stills, alt, thumbnail }: Props) {
  const [current, setCurrent] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const useThumbnail = stills.length === 0 && thumbnail;

  useEffect(() => {
    if (stills.length < 2) return;
    const tick = () => {
      if (imgRef.current) {
        imgRef.current.style.opacity = '0';
      }
      setTimeout(() => {
        let n = Math.floor(Math.random() * stills.length);
        if (n === current && stills.length > 1) n = (n + 1) % stills.length;
        setCurrent(n);
        requestAnimationFrame(() => {
          if (imgRef.current) imgRef.current.style.opacity = '';
        });
      }, 600);
    };
    const interval = setInterval(tick, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [stills, current]);

  const src = useThumbnail ? thumbnail : stills[current];

  if (!src) return null;

  return (
    <img
      ref={imgRef}
      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
      src={src}
      alt={alt}
    />
  );
}