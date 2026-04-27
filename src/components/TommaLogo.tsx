import { useState, useEffect, useRef } from 'react';

let globalTime = 0;
let isRunning = true;

export default function TommaLogo() {
  const [time, setTime] = useState(globalTime);
  const [, forceUpdate] = useState(0);
  const runningRef = useRef(true);
  
  useEffect(() => {
    runningRef.current = true;
    
    const interval = setInterval(() => {
      if (runningRef.current) {
        globalTime += 1;
        setTime(globalTime);
        forceUpdate(n => n + 1);
      }
    }, 150);
    
    return () => {
      runningRef.current = false;
      clearInterval(interval);
    };
  }, []);
  
  const gridSize = 14;
  const dots: { x: number; y: number; opacity: number }[] = [];
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize * 2; x++) {
      const wave1 = Math.sin(x * 0.4 + y * 0.3 + time * 0.08);
      const wave2 = Math.cos(x * 0.2 - y * 0.5 + time * 0.06);
      const wave3 = Math.sin((x + y) * 0.15 + time * 0.04);
      const combined = (wave1 + wave2 + wave3) / 3;
      
      if (combined > 0.2) {
        const opacity = Math.min(1, (combined + 0.5) * 0.8);
        dots.push({ x, y, opacity });
      }
    }
  }
  
  return (
    <div className="relative w-28 h-12 rounded-md overflow-hidden bg-[#0a120c] border border-[#7bdc75]/30">
      <svg width="100%" height="100%" viewBox="0 0 28 12" preserveAspectRatio="none" className="absolute inset-0 opacity-70">
        {dots.map((dot, i) => (
          <rect
            key={i}
            x={dot.x}
            y={dot.y}
            width="1"
            height="1"
            fill="#7bdc75"
            opacity={dot.opacity}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="font-display-lg text-[#7bdc75] lowercase tracking-tight select-none">
          tomma
        </h1>
      </div>
    </div>
  );
}

export function useLogoTime() {
  return globalTime;
}