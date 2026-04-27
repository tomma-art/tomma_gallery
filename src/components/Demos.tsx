import { useState, useEffect } from 'react';

export function DitherWave() {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  const cols = 8;
  const rows = 4;
  
  return (
    <div className="tui-border bg-[#1a1a1a] p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="font-label-mono text-[10px] text-secondary uppercase">[ dither_wave ]</span>
        <span className="font-label-mono text-[10px] text-emerald-100/40">{time}ms</span>
      </div>
      <svg width="100%" height="100%" viewBox={`${cols} ${rows}`} preserveAspectRatio="none">
        {[...Array(rows)].map((_, y) => (
          [...Array(cols)].map((_, x) => {
            const wave = Math.sin(x * 0.8 + time * 0.1) * Math.cos(y * 0.5 + time * 0.08);
            const normalized = (wave + 1) / 2;
            if (normalized > 0.4) {
              return (
                <rect
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  width="1"
                  height="1"
                  fill="#7bdc75"
                  opacity={normalized * 0.8}
                />
              );
            }
            return null;
          })
        ))}
      </svg>
    </div>
  );
}

export function MatrixRain() {
  const [chars, setChars] = useState<string[]>([]);
  
  useEffect(() => {
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
    const interval = setInterval(() => {
      const newChars = [...Array(20)].map(() => 
        chars[Math.floor(Math.random() * chars.length)]
      );
      setChars(newChars);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="tui-border bg-[#1a1a1a] p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="font-label-mono text-[10px] text-secondary uppercase">[ matrix ]</span>
        <span className="font-label-mono text-[10px] text-emerald-100/40">fps: {Math.floor(1000 / 100)}</span>
      </div>
      <div className="font-body-reg text-secondary leading-tight tracking-wider" style={{ fontFamily: 'monospace' }}>
        {chars.join(' ')}
      </div>
    </div>
  );
}

export function NoiseField() {
  const [noise, setNoise] = useState<number[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newNoise = [...Array(32)].map(() => Math.random());
      setNoise(newNoise);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="tui-border bg-[#1a1a1a] p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="font-label-mono text-[10px] text-secondary uppercase">[ white_noise ]</span>
      </div>
      <div className="flex gap-0.5 h-8">
        {noise.map((n, i) => (
          <div 
            key={i} 
            className="flex-1 bg-secondary"
            style={{ opacity: n }}
          />
        ))}
      </div>
    </div>
  );
}

export function GlitchText({ text = 'GLITCH' }: { text?: string }) {
  const [glitchText, setGlitchText] = useState(text);
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const glitched = text.split('').map(char => {
          if (Math.random() > 0.8) {
            return chars[Math.floor(Math.random() * chars.length)];
          }
          return char;
        }).join('');
        setGlitchText(glitched);
      } else {
        setGlitchText(text);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [text]);
  
  return (
    <div className="tui-border bg-[#1a1a1a] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-label-mono text-[10px] text-secondary uppercase">[ glitch_text ]</span>
      </div>
      <div className="font-headline-md text-secondary lowercase tracking-widest">
        {glitchText}
      </div>
    </div>
  );
}