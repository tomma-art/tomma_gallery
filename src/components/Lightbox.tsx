import { useState, useEffect, useRef } from 'react';

interface LightboxProps {
  images: string[];
  initialIndex?: number;
}

export default function Lightbox({ images, initialIndex = 0 }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const open = (index: number = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const next = () => setCurrentIndex((currentIndex + 1) % images.length);
  
  const prev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  // Expose open function globally
  useEffect(() => {
    (window as any).openLightbox = open;
    return () => delete (window as any).openLightbox;
  }, [images]);

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={(e) => e.target === overlayRef.current && close()}
    >
      {/* Close button */}
      <button 
        className="absolute top-4 right-4 text-white hover:text-secondary transition-colors z-10"
        onClick={close}
      >
        <span className="material-symbols-outlined text-4xl">close</span>
      </button>

      {/* Navigation */}
      <button 
        className="absolute left-4 text-white hover:text-secondary transition-colors"
        onClick={prev}
      >
        <span className="material-symbols-outlined text-5xl">chevron_left</span>
      </button>
      
      <button 
        className="absolute right-4 text-white hover:text-secondary transition-colors"
        onClick={next}
      >
        <span className="material-symbols-outlined text-5xl">chevron_right</span>
      </button>

      {/* Image */}
      <div className="max-w-6xl max-h-[80vh] aspect-video relative">
        <img 
          src={images[currentIndex]} 
          alt={`Still ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-label-mono text-[10px] text-white/60">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Keyboard hints */}
      <div className="absolute bottom-4 right-4 font-label-mono text-[10px] text-white/40 hidden md:block">
        ← → ESC
      </div>
    </div>
  );
}