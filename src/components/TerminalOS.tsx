import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import CRTMonitor, { Box, Typewriter, playBlip, playBoot } from './CRTMonitor';
import TOMMA_LABS_ART from './tomma-labs-art.txt?raw';

interface Project {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface TerminalOSProps {
  projects: Project[];
  onLaunch?: (projectId: string) => void;
}

const LOGIN_ART = `
                         --------                                        
                        -----------                                       
                      --------------                                      
                      --------------                                      
                     --------------:                                      
                     --------------                                       
                      ------------                                        
                      ----------                                          
                         ----                                             
                 --------------          -                -------------   
                 --------------         --                ------------    
                --------------          ---              -------------    
                --------------         -----            --------------    
               --------------          ------           ------------:     
              ---------------          ------          :------------      
              --------------          --------         -------------      
             --------------          :---------       :------------       
             -#@@@@@*------          -----------      -------------       
         @@@@@@@@@@@@@@@=-         @@@@@@@@@#---      =====--------       
       @@@@@@@@  @@@@@@@@@     @@@@@@@@@@@@@@@@%-    @@@@@@@@@@@@@@@      
      @@@@@@         @@@@@@   @@@@@@       @@@@@@   @@@@@@@@@@@@@@@@@     
     @@@@@@                  @@@@@         @@@@@@@ @@@@@@@    @@@@@@@     
    @@@@@@@  @@@@@@@@@@@@@@ @@@@@@ @@@@@@@@@@@@@@@ @@@@@@     @@@@@@@     
    @@@@@@@  @@@@@@@@@@@@@  @@@@@@  @@@@@@@@@@@@@ @@@@@@     @@@@@@@      
     @@@@@@@     @@@@@@@@    @@@@@        @@@@@@  @@@@@@     @@@@@@@      
       @@@@@@@@@@@@@@@@       @@@@@@@@@@@@@@@@@  @@@@@@     @@@@@@@       
        --*%@@@@@%*---           @@@@@@@@@@@    @@@@@@@     @@@@@@@       
       --------------                        --------------:              
       --------------                         --------------              
      --------------                           ------------               
      --------------                            -----------               
     --------------                             ----------                
    --------------:                              --------                 
    --------------                                -------                 
   ---------------                                 -----                  
                                                   -----                  
                                                    ---                   
                                                     --`;

const GLITCH_CHARS = '@#$%&*+=-<>~^[]{}|/\\;:.,?!abcdefghijklmnopqrstuvwxyz0123456789';

const GLITCH_MESSAGES = [
  '|||GATEKEEPER PROTOCOL ACTIVATED|||',
  '-WELCOME TOMMA-',
  'ACTIVATING PROTOCOL|',
  'FIREWALL BYPASSED',
  'ROOT ACCESS GRANTED',
];

function generateGlitchGrid(rows?: number, cols?: number): string[][] {
  const r = rows ?? 30;
  const c = cols ?? 60;
  const grid: string[][] = [];
  for (let y = 0; y < r; y++) {
    grid[y] = [];
    for (let x = 0; x < c; x++) {
      grid[y][x] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
  }
  return grid;
}

export default function TerminalOS({ projects, onLaunch }: TerminalOSProps) {
  const [booting, setBooting] = useState(true);
  const [bootStep, setBootStep] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [piVisible, setPiVisible] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [glitchGrid, setGlitchGrid] = useState<string[][]>([]);
  const [desktop, setDesktop] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [projectRunning, setProjectRunning] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [focused, setFocused] = useState<'user' | 'pass'>('user');
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [glitchDims, setGlitchDims] = useState({ rows: 30, cols: 60 });

  // Resize glitch grid to fill container
  useEffect(() => {
    const el = terminalRef.current?.parentElement;
    if (!el) return;
    const calc = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setGlitchDims({
        cols: Math.max(30, Math.floor(w / 4.8)),
        rows: Math.max(15, Math.floor(h / 8)),
      });
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  
  useEffect(() => {
    playBoot();
    const steps = 8;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setBootStep(step);
      if (step >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          setBooting(false);
          setShowLogin(true);
        }, 400);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);
  
  // 7s timer for π
  useEffect(() => {
    if (!showLogin) return;
    const timer = setTimeout(() => {
      setPiVisible(true);
    }, 7000);
    return () => clearTimeout(timer);
  }, [showLogin]);
  
  // Glitch animation
  useEffect(() => {
    if (!glitching) return;
    let frame = 0;
    const { rows, cols } = glitchDims;
    const interval = setInterval(() => {
      setGlitchGrid(generateGlitchGrid(rows, cols));
      frame++;
      if (frame >= 50) {
        clearInterval(interval);
        setTimeout(() => {
          setGlitching(false);
          setDesktop(true);
        }, 200);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [glitching, glitchDims]);
  
  const handlePiClick = useCallback(() => {
    setGlitchGrid(generateGlitchGrid(glitchDims.rows, glitchDims.cols));
    setGlitching(true);
    setShowLogin(false);
  }, [glitchDims]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (booting || glitching) return;
    
    if (showLogin) {
      if (e.key === 'Tab') {
        e.preventDefault();
        setFocused(f => f === 'user' ? 'pass' : 'user');
        return;
      }
      if (e.key === 'Enter') {
        setLoginError('access denied');
        return;
      }
      return;
    }
    
    if (projectRunning) {
      if (e.key === 'Escape') {
        playBlip();
        setProjectRunning(false);
        setCurrentProject(null);
      }
      return;
    }
    
    playBlip();
    
    switch (e.key) {
      case 'ArrowUp':
        setSelectedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowDown':
        setSelectedIndex(prev => Math.min(projects.length - 1, prev + 1));
        break;
      case 'Enter':
        const project = projects[selectedIndex];
        setCurrentProject(project);
        setProjectRunning(true);
        onLaunch?.(project.id);
        break;
      case 'Escape':
        setMessage('');
        break;
    }
  }, [booting, glitching, showLogin, projectRunning, projects, selectedIndex, onLaunch]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  useEffect(() => {
    if (showLogin) {
      if (focused === 'user') userRef.current?.focus();
      else passRef.current?.focus();
    }
  }, [showLogin, focused]);
  
  const loadingDots = '.'.repeat(bootStep % 4);
  
  const bootMessages = [
    'Booting kernel...',
    'Loading drivers...', 
    'Mounting filesystem...',
    'Starting services...',
    'Initializing display...',
    'Loading input...',
    'Checking memory...',
    'Ready'
  ];
  
  return (
    <CRTMonitor>
      <div ref={terminalRef} className={`h-full font-mono text-green-400 flex flex-col items-center justify-center ${glitching ? '' : 'p-4'} relative overflow-hidden`}>
        {booting && (
          <div className="text-center">
            <div className="text-lg mb-2">v1.0</div>
            <div className="text-sm text-green-400/70 mb-4">Initializing system{loadingDots}</div>
            <div className="w-32 h-1 bg-green-900/30 rounded mx-auto overflow-hidden">
              <div 
                className="h-full bg-green-400 transition-all duration-200 rounded"
                style={{ width: `${(bootStep / 8) * 100}%` }}
              />
            </div>
            <div className="text-xs text-green-400/50 mt-4">
              {bootMessages[Math.min(bootStep, 7)]}
            </div>
          </div>
        )}
        
        {showLogin && (
          <div className="w-full max-w-4xl flex flex-col md:flex-row items-start gap-8">
            <pre className="text-green-400 text-[8px] leading-tight whitespace-pre shrink-0">
              {LOGIN_ART}
            </pre>
            <div className="flex flex-col gap-4 md:ml-auto md:mt-16">
              <div className="font-mono text-xs text-green-400/70 mb-2">login</div>
              <div>
                <label className="font-mono text-[10px] text-green-400/50 block mb-1">username:</label>
                <input
                  ref={userRef}
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setLoginError(''); }}
                  className="bg-transparent border border-green-400/30 px-2 py-1 text-green-400 font-mono text-xs outline-none w-48 focus:border-green-400/60"
                  onFocus={() => setFocused('user')}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-green-400/50 block mb-1">password:</label>
                <input
                  ref={passRef}
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                  className="bg-transparent border border-green-400/30 px-2 py-1 text-green-400 font-mono text-xs outline-none w-48 focus:border-green-400/60"
                  onFocus={() => setFocused('pass')}
                />
              </div>
              {loginError && (
                <div className="font-mono text-[10px] text-red-400/70 mt-1">{loginError}</div>
              )}
              <div className="font-mono text-[9px] text-green-400/20 mt-2">
                [TAB] switch field  [ENTER] submit
              </div>
            </div>
          </div>
        )}
        
        {/* Pi symbol */}
        {piVisible && !glitching && !desktop && (
          <div className="absolute bottom-4 right-4 z-50">
            <span
              onClick={() => handlePiClick()}
              className="font-mono text-green-400 cursor-pointer select-none transition-opacity duration-1000"
              style={{ opacity: piVisible ? 0.3 : 0, fontSize: '18px' }}
              onContextMenu={e => e.preventDefault()}
            >
              π
            </span>
          </div>
        )}
        
        {/* Glitch screen */}
        {glitching && (
          <div className="absolute inset-0 z-40 bg-black overflow-hidden">
            {/* Heavy CRT scanlines for glitch phase */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-60" style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.6) 1px, rgba(0, 0, 0, 0.6) 3px)',
              backgroundSize: '100% 3px',
            }} />
            {/* CRT screen curvature vignette */}
            <div className="absolute inset-0 pointer-events-none z-10" style={{
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.7) 100%)',
            }} />

            {/* Base glitch grid */}
            <div className="absolute inset-0" style={{ animation: 'glitchScan 0.04s infinite' }}>
              <div className="flex flex-wrap gap-0">
                {glitchGrid.map((row, y) => (
                  <div key={y} className="flex w-full" style={{ height: `${100 / glitchGrid.length}%` }}>
                    {row.map((char, x) => (
                      <span
                        key={x}
                        className="text-green-400 text-[8px] leading-none"
                        style={{ 
                          opacity: Math.random() > 0.7 ? 0 : 0.1 + Math.random() * 0.9,
                          filter: Math.random() > 0.9 ? 'blur(1px) brightness(1.5)' : 'none',
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Color flash overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ animation: 'glitchFlash 0.3s infinite' }} />

            {/* Pixel sorting bars */}
            <PixelSortOverlay />

            {/* Bending scanline */}
            <div className="absolute left-0 w-full bg-green-400/20 pointer-events-none" style={{ animation: 'glitchScanlineBend 0.08s infinite', mixBlendMode: 'screen' }} />

            {/* RGB split lines */}
            <div className="absolute w-full h-[2px] bg-cyan-400/30 pointer-events-none" style={{ top: '30%', animation: 'glitchBar2 0.08s infinite' }} />
            <div className="absolute w-full h-[3px] bg-magenta-400/25 pointer-events-none" style={{ top: '60%', animation: 'glitchBar1 0.1s infinite' }} />

            {/* Loading bar */}
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 z-20 w-64">
              <LoadingBar />
            </div>

            {/* Messages centered */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <GlitchMessages />
            </div>
          </div>
        )}
        
        {desktop && !projectRunning && (
          <div className="flex flex-col items-center">
            <div className="w-full overflow-x-auto mb-4 text-center">
              <pre className="text-green-400 text-xs leading-tight whitespace-pre inline-block text-left">
                {TOMMA_LABS_ART}
              </pre>
            </div>
            
            {message && (
              <div className="mb-4 p-2 border border-[#7bdc75]/30 bg-[#7bdc75]/10 text-center">
                <Typewriter text={message} speed={10} />
              </div>
            )}
            
            <Box width={50}>
              <div className="py-1 text-center">SELECT PROJECT TO LOAD:</div>
              {projects.map((proj, i) => (
                <div 
                  key={proj.id}
                  className={`cursor-pointer py-0.5 -mx-2 px-2 ${i === selectedIndex ? 'bg-[#7bdc75]/20' : ''}`}
                  onClick={() => {
                    setSelectedIndex(i);
                    playBlip();
                  }}
                >
                  [{i === selectedIndex ? 'X' : ' '}] {proj.name} - {proj.description}
                </div>
              ))}
            </Box>
            
            <div className="mt-2 text-[#7bdc75]/50 text-xs text-center">
              [↑↓] SELECT  [ENTER] LOAD  [ESC] CLEAR
            </div>
          </div>
        )}
        
        {projectRunning && currentProject && (
          <div className="w-full max-w-4xl">
            <Box title={`LOADING: ${currentProject.name.toUpperCase()}`} width={80}>
              <div className="py-2">
                {currentProject.id === 'tomma_ascii' && <TommaAsciiProject onClose={() => {
                  playBlip();
                  setProjectRunning(false);
                  setCurrentProject(null);
                }} />}
              </div>
            </Box>
          </div>
        )}
      </div>
    </CRTMonitor>
  );
}

function LoadingBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 15 + 5;
        return next >= 100 ? 0 : next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] text-green-400/60 mb-1 font-mono">
        <span>LOADING</span>
        <span>{Math.floor(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-green-900/30 rounded overflow-hidden">
        <div
          className="h-full bg-green-400 rounded transition-all duration-[150ms]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function GlitchMessages() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % GLITCH_MESSAGES.length);
        setVisible(true);
      }, 200);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <div 
        className="font-mono text-green-400 text-lg md:text-2xl font-bold tracking-widest uppercase"
        style={{ 
          opacity: visible ? 0.9 : 0,
          transition: 'opacity 0.08s ease',
          textShadow: visible 
            ? '0 0 10px rgba(123, 220, 117, 0.5), 0 0 40px rgba(123, 220, 117, 0.2)'
            : 'none',
        }}
      >
        {GLITCH_MESSAGES[index]}
      </div>
    </div>
  );
}

function PixelSortOverlay() {
  const bars = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: `${5 + Math.random() * 85}%`,
    height: `${2 + Math.random() * 6}px`,
    anim: i % 3 === 0 ? 'glitchBar1' : i % 3 === 1 ? 'glitchBar2' : 'glitchBar3',
    color: [
      'rgba(0, 255, 0, 0.15)',
      'rgba(255, 0, 255, 0.12)',
      'rgba(0, 255, 255, 0.12)',
      'rgba(255, 255, 0, 0.1)',
      'rgba(255, 255, 255, 0.08)',
    ][i % 5],
    delay: `${Math.random() * 0.2}s`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bars.map(bar => (
        <div
          key={bar.id}
          className="absolute left-0 w-full"
          style={{
            top: bar.top,
            height: bar.height,
            backgroundColor: bar.color,
            animation: `${bar.anim} ${0.1 + Math.random() * 0.15}s infinite`,
            animationDelay: bar.delay,
            mixBlendMode: 'screen' as const,
          }}
        />
      ))}
    </div>
  );
}

function TommaAsciiProject({ onClose }: { onClose: () => void }) {
  const COLS = 112;
  const ROWS = 45;
  const [grid, setGrid] = useState<string[][]>([]);
  const [speed, setSpeed] = useState(10);
  const [tommaFreq, setTommaFreq] = useState(10);
  const [mode, setMode] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [ripples, setRipples] = useState<{cx: number, cy: number, r: number, maxR: number}[]>([]);
  
  const CHAR_SETS = [
    '·.°oO@#§•¶¢£€®©∑§•¶°±≠≤≥÷∞∆∇√∑∏∫≈~≠æœφλπωμ∟',
    '0123456789',
    'abcdefghijklmnopqrstuvwxyz'
  ];
  const TOMMA = 'tommaTOMMA';
  
  const getRandomChar = useCallback(() => {
    if (Math.random() * 100 < 45) return ' ';
    if (Math.random() * 100 < tommaFreq) {
      return TOMMA[Math.floor(Math.random() * TOMMA.length)];
    }
    const chars = CHAR_SETS[mode];
    return chars[Math.floor(Math.random() * chars.length)];
  }, [tommaFreq, mode]);
  
  useEffect(() => {
    const newGrid = [];
    for (let y = 0; y < ROWS; y++) {
      newGrid[y] = [];
      for (let x = 0; x < COLS; x++) {
        newGrid[y][x] = getRandomChar();
      }
    }
    setGrid(newGrid);
  }, [getRandomChar]);
  
  useEffect(() => {
    if (paused) return;
    
    const interval = setInterval(() => {
      if (ripples.length < 4 && Math.random() < 0.12) {
        const cx = Math.floor(Math.random() * COLS);
        const cy = Math.floor(Math.random() * ROWS);
        setRipples(prev => [...prev, { cx, cy, r: 0, maxR: 5 + Math.floor(Math.random() * 10) }]);
      }
      
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
            for (const rip of ripples) {
              const dist = Math.sqrt(Math.pow(x - rip.cx, 2) + Math.pow(y - rip.cy, 2));
              if (dist < rip.r + 1 && dist > rip.r - 1) {
                newGrid[y][x] = '●';
              }
            }
            if (Math.random() < 0.3) {
              newGrid[y][x] = getRandomChar();
            }
          }
        }
        return newGrid;
      });
      
      setRipples(prev => prev.map(r => ({ ...r, r: r.r + 0.5 })).filter(r => r.r < r.maxR));
      
    }, 1000 / speed);
    
    return () => clearInterval(interval);
  }, [speed, paused, ripples, getRandomChar]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    
    playBlip();
    
    switch (e.key) {
      case 'a': setSpeed(s => Math.max(1, s - 1)); break;
      case 's': setSpeed(s => Math.min(60, s + 1)); break;
      case 'd': setGrid(prev => prev.map(row => row.map(() => getRandomChar()))); break;
      case 'f': setTommaFreq(f => Math.max(1, f - 2)); break;
      case 'j': setTommaFreq(f => Math.min(50, f + 2)); break;
      case 'k': setMode(m => (m + 1) % 3); break;
      case 'l': setPaused(p => !p); break;
      case ';': setShowHelp(h => !h); break;
    }
  }, [onClose, getRandomChar]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  return (
    <div className="text-xs">
      <pre className="leading-none text-sm mb-2">
        {grid.map((row, y) => (
          <div key={y}>{row.join('')}</div>
        ))}
      </pre>
      
      <div className="flex justify-between items-center text-[#7bdc75]/70 pt-2 border-t border-[#7bdc75]/20">
        <div className="flex gap-4">
          <span>SPD: {speed}</span>
          <span>FREQ: {tommaFreq}</span>
          <span>MODE: {['SYM', 'NUM', 'LET'][mode]}</span>
        </div>
        <div className="flex gap-4">
          <span>[A/S] SPEED</span>
          <span>[D] REGEN</span>
          <span>[F/J] FREQ</span>
          <span>[K] MODE</span>
          <span>[L] PAUSE</span>
          <span>[ESC] EXIT</span>
        </div>
      </div>
    </div>
  );
}