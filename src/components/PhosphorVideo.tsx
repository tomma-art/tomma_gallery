import { useRef, useState } from 'react';

interface Props {
  src?: string;
  title?: string;
}

export default function PhosphorVideo({ src, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  
  if (!src) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center text-[#7bdc75]/50 font-mono">
        [NO VIDEO SIGNAL]
      </div>
    );
  }
  
  return (
    <div className="relative w-full">
      {/* Green phosphor video container */}
      <div 
        className="relative overflow-hidden"
        style={{
          filter: 'hue-rotate(70deg) saturate(2) brightness(1.1)',
        }}
      >
        <video
          ref={videoRef}
          src={src}
          className="w-full aspect-video"
          style={{
            mixBlendMode: 'screen',
            filter: 'sepia(20%) saturate(200%) hue-rotate(70deg)',
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          controls
        />
        
        {/* CRT scanline overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 50, 0, 0.1) 2px,
              rgba(0, 50, 0, 0.1) 4px
            )`,
          }}
        />
        
        {/* Screen glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 30px rgba(0, 255, 0, 0.2)',
          }}
        />
      </div>
      
      {/* Title bar */}
      <div className="mt-2 font-mono text-xs text-[#7bdc75]/70 flex justify-between">
        <span>VIDEO_SIGNAL: {title || 'UNTITLED'}</span>
        <span>{playing ? '[PLAYING]' : '[STOPPED]'}</span>
      </div>
    </div>
  );
}

// ASCII art player for audio
export function AsciiPlayer({ playing = false }: { playing: boolean }) {
  const frames = [
    '◉────────',
    '─◉───────',
    '──◉──────',
    '───◉─────',
    '────◉────',
    '─────◉───',
    '──────◉──',
    '───────◉─',
  ];
  
  const [frame, setFrame] = useState(0);
  
  if (playing) {
    setInterval(() => setFrame(f => (f + 1) % frames.length), 200);
  }
  
  return (
    <pre className="text-[#7bdc75] font-mono text-sm">
      {playing ? frames[frame] : '────────'}
    </pre>
  );
}