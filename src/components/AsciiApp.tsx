import { useState, useEffect, useRef } from 'react';

const presets = [
  { name: 'skull', chars: '###     ###\n#   ___   #\n#  (o o)  #\n#   ( _ )  #\n#   -----  #\n##### #####' },
  { name: 'heart', chars: '  ♥♥   ♥♥  \n ♥♥♥♥ ♥♥♥♥ \n♥♥♥♥♥♥♥♥♥♥\n ♥♥♥♥♥♥♥ \n  ♥♥♥♥♥♥  \n   ♥♥♥♥   \n    ♥♥♥    \n     ♥     ' },
  { name: 'cat', chars: '  /\\___/\\  \n ( o o o ) \n (  =^=  ) \n  (______)' },
  { name: 'robot', chars: '  _____\n /_____\\\n| [O] [O] |\n|   ___   |\n|  |___|  |\n|___| |___|' },
  { name: 'skull', chars: '    _____\n   /     \\\n  | () () |\n  |   ^   |\n   \\_____/' },
];

const charsetPresets = {
  'standard': ' .:-=+*#%@',
  'detailed': ' ░▒▓█',
  'blocks': ' ▂▃▄▅▆▇█',
  'circles': ' .oO0@',
};

export default function AsciiApp() {
  const [input, setInput] = useState('TOMMA');
  const [output, setOutput] = useState('');
  const [charset, setCharset] = useState('standard');
  const [width, setWidth] = useState(40);
  const [mirror, setMirror] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateAscii = () => {
    const chars = charsetPresets[charset as keyof typeof charsetPresets] || charsetPresets.standard;
    const len = chars.length;
    
    // Create ASCII art from input text
    let result = '';
    const textWidth = input.length * 6;
    const scale = Math.max(1, Math.floor(textWidth / width));
    
    for (let y = 0; y < 12; y++) {
      let line = '';
      for (let x = 0; x < width; x++) {
        // Simple pattern based on position
        const cx = Math.floor(x / scale) % input.length;
        const charIndex = Math.floor(Math.abs(Math.sin(cx * y * 0.5)) * len);
        line += chars[Math.min(charIndex, len - 1)];
      }
      result += (mirror ? line.split('').reverse().join('') : line) + '\n';
    }
    
    setOutput(result);
  };

  useEffect(() => {
    generateAscii();
  }, [input, charset, width, mirror]);

  return (
    <div className="h-full flex flex-col font-mono text-xs">
      <div className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="Enter text"
            className="flex-1 bg-[#1a1a1a] border border-emerald-900/50 text-white px-2 py-1 focus:outline-none focus:border-[#7bdc75]"
          />
          <select
            value={charset}
            onChange={(e) => setCharset(e.target.value)}
            className="bg-[#1a1a1a] border border-emerald-900/50 text-white px-2 py-1 focus:outline-none"
          >
            <option value="standard">Standard</option>
            <option value="detailed">Detailed</option>
            <option value="blocks">Blocks</option>
            <option value="circles">Circles</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-white/70">
            <input
              type="checkbox"
              checked={mirror}
              onChange={(e) => setMirror(e.target.checked)}
              className="accent-[#7bdc75]"
            />
            Mirror
          </label>
          <label className="flex items-center gap-2 text-white/70">
            Width:
            <input
              type="range"
              min="20"
              max="80"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
              className="accent-[#7bdc75]"
            />
            {width}
          </label>
        </div>
      </div>

      <div className="flex-1 bg-[#1a1a1a] border border-emerald-900/30 p-2 overflow-auto">
        <pre className="text-[#7bdc75] whitespace-pre leading-tight">
{output}
        </pre>
      </div>

      <div className="mt-2 flex gap-2 flex-wrap">
        {presets.map(p => (
          <button
            key={p.name}
            onClick={() => setOutput(p.chars)}
            className="text-xs text-white/50 hover:text-white border border-white/20 px-2 py-1"
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}