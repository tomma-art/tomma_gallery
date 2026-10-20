import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const GLITCH_CHARS = '@#$%&*+=-<>~^[]{}|/\\;:.,?!abcdefghijklmnopqrstuvwxyz0123456789';

const GLITCH_MESSAGES = [
  'WARNING',
  'GATEKEEPER ACTIVATED',
  'INTRUSION DETECTED',
  'UNAUTHORIZED ACCESS',
  'BREACH PROTOCOL',
  'SYSTEM COMPROMISED',
  'FIREWALL BYPASSED',
  'ROOT ACCESS GRANTED',
  'ENCRYPTION LAYER FAILED',
  'KERNEL PANIC',
  'MEMORY CORRUPTION',
  'SHELLCODE EXECUTED',
  'BACKDOOR OPEN',
  'TRACE ROUTE OBSCURED',
];

function generateGlitchGrid(rows: number, cols: number): string[][] {
  const grid: string[][] = [];
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
  }
  return grid;
}

interface GlitchConfig {
  gridRows: number;
  gridCols: number;
  gridSpeed: number;
  flashIntensity: number;
  barCount: number;
  barSpeed: number;
  scanlineSpeed: number;
  messageSpeed: number;
  messageText: string;
  textColor: string;
  bgColor: string;
}

const DEFAULT_CONFIG: GlitchConfig = {
  gridRows: 30,
  gridCols: 60,
  gridSpeed: 60,
  flashIntensity: 1,
  barCount: 12,
  barSpeed: 1,
  scanlineSpeed: 1,
  messageSpeed: 1,
  messageText: GLITCH_MESSAGES.join('|'),
  textColor: '#7bdc75',
  bgColor: '#000000',
};

function Slider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-green-400/70 mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step ?? 1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none bg-green-900/30 rounded outline-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:bg-green-400 [&::-webkit-slider-thumb]:rounded-full"
      />
    </div>
  );
}

function ColorInput({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <div className="text-xs text-green-400/70 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-8 h-8 p-0 border border-green-400/30 bg-transparent cursor-pointer"
        />
        <span className="text-[10px] text-green-400/50 font-mono">{value}</span>
      </div>
    </div>
  );
}

function GlitchPreview({ config, running, onToggle }: {
  config: GlitchConfig; running: boolean; onToggle: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ cols: 60, rows: 30 });
  const [glitchGrid, setGlitchGrid] = useState<string[][]>([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [messageVisible, setMessageVisible] = useState(true);
  const messages = config.messageText.split('|').filter(Boolean);

  // Resize to fill container at 8px char size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const calc = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const cols = Math.max(20, Math.floor(w / 4.8));
      const rows = Math.max(10, Math.floor(h / 8));
      setDims({ cols, rows });
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!running) {
      setGlitchGrid([]);
      return;
    }
    const rows = Math.max(dims.rows, config.gridRows);
    const cols = Math.max(dims.cols, config.gridCols);
    setGlitchGrid(generateGlitchGrid(rows, cols));

    const gridInterval = setInterval(() => {
      setGlitchGrid(generateGlitchGrid(rows, cols));
    }, config.gridSpeed);

    return () => clearInterval(gridInterval);
  }, [running, dims, config.gridRows, config.gridCols, config.gridSpeed]);

  useEffect(() => {
    if (!running || messages.length === 0) return;
    const interval = setInterval(() => {
      setMessageVisible(false);
      setTimeout(() => {
        setMessageIndex(i => (i + 1) % messages.length);
        setMessageVisible(true);
      }, 100);
    }, config.messageSpeed * 200);
    return () => clearInterval(interval);
  }, [running, config.messageSpeed, messages.length]);

  const rows = Math.max(dims.rows, config.gridRows);
  const cols = Math.max(dims.cols, config.gridCols);

  const bars = useMemo(() => running ? Array.from({ length: config.barCount }, (_, i) => ({
    top: `${Math.random() * 95}%`,
    height: `${2 + Math.random() * 6}px`,
    color: [
      `rgba(0, 255, 0, ${0.15 * config.flashIntensity})`,
      `rgba(255, 0, 255, ${0.12 * config.flashIntensity})`,
      `rgba(0, 255, 255, ${0.12 * config.flashIntensity})`,
      `rgba(255, 255, 0, ${0.1 * config.flashIntensity})`,
    ][i % 4],
    delay: `${Math.random() * 0.2}s`,
    animSpeed: `${0.1 / config.barSpeed}s`,
  })) : [], [running, config.barCount, config.flashIntensity, config.barSpeed]);

  return (
    <div ref={containerRef} className="relative flex-1 bg-black rounded overflow-hidden border border-green-400/20" style={{ minHeight: '400px' }}>
      {!running && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <span className="text-green-400/30 font-mono text-sm">press Test Glitch</span>
        </div>
      )}

      {/* Grid */}
      <div className="absolute inset-0" style={{
        animation: running ? 'glitchScan 0.06s infinite' : 'none',
      }}>
        <div className="flex flex-wrap gap-0">
          {glitchGrid.map((row, y) => (
            <div key={y} className="flex w-full" style={{ height: `${100 / glitchGrid.length}%` }}>
              {row.map((char, x) => (
                <span key={x}
                  className="text-[8px] leading-none"
                  style={{
                    color: config.textColor,
                    opacity: running ? (Math.random() > 0.75 ? 0 : 0.1 + Math.random() * 0.9) : 0,
                  }}
                >{char}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Flash */}
      {running && <div className="absolute inset-0 pointer-events-none" style={{
        animation: `glitchFlash ${0.4 / config.flashIntensity}s infinite`,
      }} />}

      {/* Bars */}
      {bars.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {bars.map((bar, i) => (
            <div key={i} className="absolute left-0 w-full" style={{
              top: bar.top,
              height: bar.height,
              backgroundColor: bar.color,
              animation: `${i % 3 === 0 ? 'glitchBar1' : i % 3 === 1 ? 'glitchBar2' : 'glitchBar3'} ${bar.animSpeed} infinite`,
              animationDelay: bar.delay,
              mixBlendMode: 'screen',
            }} />
          ))}
        </div>
      )}

      {/* Scanline */}
      {running && (
        <div className="absolute left-0 w-full pointer-events-none" style={{
          backgroundColor: `${config.textColor}33`,
          animation: `glitchScanlineBend ${0.15 / config.scanlineSpeed}s infinite`,
          mixBlendMode: 'screen',
        }} />
      )}

      {/* RGB lines */}
      {running && (
        <>
          <div className="absolute w-full h-[1px] pointer-events-none" style={{
            top: '30%',
            backgroundColor: '#0ff4',
            animation: `glitchBar2 ${0.1 / config.barSpeed}s infinite`,
          }} />
          <div className="absolute w-full h-[2px] pointer-events-none" style={{
            top: '60%',
            backgroundColor: '#f0f4',
            animation: `glitchBar1 ${0.12 / config.barSpeed}s infinite`,
          }} />
        </>
      )}

      {/* Messages */}
      {running && messages.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="font-mono text-lg md:text-2xl font-bold tracking-widest uppercase" style={{
              color: config.textColor,
              opacity: messageVisible ? 0.9 : 0,
              transition: 'opacity 0.08s ease',
              textShadow: messageVisible
                ? `0 0 10px ${config.textColor}80, 0 0 40px ${config.textColor}33`
                : 'none',
            }}>
              {messages[messageIndex]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GlitchTool() {
  const [config, setConfig] = useState<GlitchConfig>(DEFAULT_CONFIG);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = useCallback((key: keyof GlitchConfig, value: number | string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleTest = () => {
    setRunning(false);
    setTimeout(() => setRunning(true), 50);
  };

  const handleCopy = () => {
    const out = `{
  gridRows: ${config.gridRows},
  gridCols: ${config.gridCols},
  gridSpeed: ${config.gridSpeed},
  flashIntensity: ${config.flashIntensity},
  barCount: ${config.barCount},
  barSpeed: ${config.barSpeed},
  scanlineSpeed: ${config.scanlineSpeed},
  messageSpeed: ${config.messageSpeed},
  messageText: '${config.messageText}',
  textColor: '${config.textColor}',
  bgColor: '${config.bgColor}',
}`;
    navigator.clipboard.writeText(out);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="h-full flex gap-4 p-4 font-mono text-green-400">
      {/* Preview */}
      <GlitchPreview config={config} running={running} onToggle={() => setRunning(r => !r)} />

      {/* Controls */}
      <div className="w-72 shrink-0 bg-black/50 border border-green-400/20 rounded p-4 overflow-y-auto">
        <div className="text-sm font-bold mb-4 tracking-wider uppercase">Glitch Controls</div>

        <div className="border border-green-400/20 rounded p-3 mb-4">
          <div className="text-xs text-green-400/50 mb-2 uppercase tracking-wider">Engine</div>
          <Slider label="Grid Rows" value={config.gridRows} min={10} max={60} onChange={v => update('gridRows', v)} />
          <Slider label="Grid Cols" value={config.gridCols} min={20} max={120} onChange={v => update('gridCols', v)} />
          <Slider label="Grid Speed (ms)" value={config.gridSpeed} min={10} max={200} onChange={v => update('gridSpeed', v)} />
        </div>

        <div className="border border-green-400/20 rounded p-3 mb-4">
          <div className="text-xs text-green-400/50 mb-2 uppercase tracking-wider">Effects</div>
          <Slider label="Flash Intensity" value={config.flashIntensity} min={0} max={3} step={0.1} onChange={v => update('flashIntensity', v)} />
          <Slider label="PixelSort Bars" value={config.barCount} min={0} max={30} onChange={v => update('barCount', v)} />
          <Slider label="Bar Speed" value={config.barSpeed} min={0.2} max={3} step={0.1} onChange={v => update('barSpeed', v)} />
          <Slider label="Scanline Speed" value={config.scanlineSpeed} min={0.2} max={3} step={0.1} onChange={v => update('scanlineSpeed', v)} />
        </div>

        <div className="border border-green-400/20 rounded p-3 mb-4">
          <div className="text-xs text-green-400/50 mb-2 uppercase tracking-wider">Text</div>
          <Slider label="Message Speed" value={config.messageSpeed} min={0.2} max={3} step={0.1} onChange={v => update('messageSpeed', v)} />
          <div className="mb-3">
            <div className="text-xs text-green-400/70 mb-1">Messages</div>
            <textarea
              value={config.messageText}
              onChange={e => update('messageText', e.target.value)}
              className="w-full bg-transparent border border-green-400/30 rounded p-2 text-[10px] text-green-400 outline-none resize-none h-16"
              placeholder="WARNING|ALERT|ERROR"
            />
            <div className="text-[9px] text-green-400/30 mt-1">separate with |</div>
          </div>
        </div>

        <div className="border border-green-400/20 rounded p-3 mb-4">
          <div className="text-xs text-green-400/50 mb-2 uppercase tracking-wider">Colors</div>
          <ColorInput label="Text Color" value={config.textColor} onChange={v => update('textColor', v)} />
          <ColorInput label="Background" value={config.bgColor} onChange={v => update('bgColor', v)} />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleTest}
            className="flex-1 px-3 py-2 border border-green-400/50 text-green-400 text-xs rounded hover:bg-green-400/10 transition-colors uppercase tracking-wider"
          >
            Test Glitch
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 px-3 py-2 border border-green-400/30 text-green-400/70 text-xs rounded hover:bg-green-400/10 transition-colors uppercase tracking-wider"
          >
            {copied ? 'Copied!' : 'Copy Config'}
          </button>
        </div>
      </div>
    </div>
  );
}