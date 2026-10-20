import { useState, useEffect } from 'react';

interface Props {
  children?: React.ReactNode;
  scanlines?: boolean;
}

export default function CRTMonitor({ 
  children, 
  scanlines = true
}: Props) {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Phosphor glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(123, 220, 117, 0.03) 0%, transparent 70%)',
        }}
      />
      
      {/* Scanlines */}
      {scanlines && (
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.15) 1px, rgba(0, 0, 0, 0.15) 2px)',
            backgroundSize: '100% 2px',
          }}
        />
      )}
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-0 w-full h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}

// Simple ASCII box drawing helper
export function Box({ title, children, width = 40 }: { title?: string; children: React.ReactNode; width?: number }) {
  const border = '─'.repeat(width - 2);

  return (
    <div className="font-mono text-[#7bdc75] inline-block" style={{ minWidth: `${width}ch` }}>
      <div>┌{border}┐</div>
      <div className="border-l border-r border-[#7bdc75]/30 px-2" style={{ minHeight: '1em' }}>
        {title && <div className="text-[#7bdc75]/70">{title}</div>}
        {children}
      </div>
      <div>└{border}┘</div>
    </div>
  );
}

// Typing effect component
export function Typewriter({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);
  
  return <span>{displayed}</span>;
}

// Sound effects
export function playBlip() {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.frequency.value = 1200;
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
  
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    audioCtx.close();
  }, 80);
}

export function playBoot() {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const playTone = (freq: number, delay: number, duration: number) => {
    setTimeout(() => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration / 1000);
      oscillator.start();
      setTimeout(() => oscillator.stop(), duration);
    }, delay);
  };
  
  playTone(440, 0, 100);
  playTone(660, 200, 100);
  playTone(880, 400, 200);
}