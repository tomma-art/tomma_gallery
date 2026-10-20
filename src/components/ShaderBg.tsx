import { useState, useEffect } from 'react';

export default function ShaderBg() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const { x, y } = mouse;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background: [
            `radial-gradient(ellipse 80% 60% at ${20 + (x - 0.5) * 10}% ${40 + (y - 0.5) * 10}%, rgba(123, 220, 117, 0.04) 0%, transparent 60%)`,
            `radial-gradient(ellipse 60% 80% at ${70 + (x - 0.5) * 8}% ${30 + (y - 0.5) * 8}%, rgba(156, 255, 147, 0.03) 0%, transparent 60%)`,
            `radial-gradient(ellipse 70% 50% at ${50 + (x - 0.5) * 6}% ${70 + (y - 0.5) * 6}%, rgba(123, 220, 117, 0.025) 0%, transparent 60%)`,
            `radial-gradient(ellipse 50% 70% at ${80 + (x - 0.5) * 12}% ${60 + (y - 0.5) * 12}%, rgba(156, 255, 147, 0.02) 0%, transparent 60%)`,
            `radial-gradient(ellipse 90% 40% at ${30 + (x - 0.5) * 9}% ${80 + (y - 0.5) * 9}%, rgba(123, 220, 117, 0.015) 0%, transparent 60%)`,
            `radial-gradient(ellipse 50% 50% at ${x * 100}% ${y * 100}%, rgba(156, 255, 147, 0.07) 0%, transparent 50%)`,
          ].join(', '),
          transition: 'background 3s ease-out',
          animation: 'fluid-bg 30s ease-in-out infinite alternate',
        }}
      />
    </div>
  );
}