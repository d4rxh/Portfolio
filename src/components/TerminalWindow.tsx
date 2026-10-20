import React, { useState, useRef, useEffect } from 'react';
import { 
  USER_PROFILE, 
  PINNED_PROJECTS, 
  SKILL_CATEGORIES, 
  THEMES, 
  ASCII_BANNER 
} from '../data/portfolioData';
import { ThemeMode, HistoryItem, Project } from '../types/terminal';
import { sounds } from './SoundEffects';
import { 
  Terminal as TerminalIcon, 
  Volume2, 
  VolumeX, 
  Tv, 
  Sparkles, 
  Layout, 
  ExternalLink, 
  Github, 
  Mail, 
  Star,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface TerminalWindowProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  matrixEnabled: boolean;
  onToggleMatrix: () => void;
  onSwitchToGui: () => void;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  currentTheme,
  onThemeChange,
  crtEnabled,
  onToggleCrt,
  soundEnabled,
  onToggleSound,
  matrixEnabled,
  onToggleMatrix,
  onSwitchToGui,
}) => {
  const theme = THEMES[currentTheme];
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMaximized, setIsMaximized] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const availableCommands = [
    'help', 'about', 'projects', 'skills', 'contact', 
    'theme', 'matrix', 'crt', 'audio', 'gui', 'clear', 
    'banner', 'whoami', 'history', 'date', 'sudo'
  ];

  const quickPills = [
    { label: 'help', cmd: 'help' },
    { label: 'about', cmd: 'about' },
    { label: 'projects', cmd: 'projects' },
    { label: 'skills', cmd: 'skills' },
    { label: 'contact', cmd: 'contact' },
    { label: 'matrix', cmd: 'matrix' },
    { label: 'theme', cmd: 'theme' },
    { label: 'GUI view', cmd: 'gui' },
    { label: 'clear', cmd: 'clear' },
  ];

  // Welcome MOTD on mount
  useEffect(() => {
    const welcomeOutput = (
      <div className="space-y-3 mb-4">
        <pre 
          className="font-mono text-xs md:text-sm leading-none overflow-x-auto select-none font-bold" 
          style={{ color: theme.accent }}
        >
          {ASCII_BANNER}
        </pre>
        <div className="border-l-2 pl-3 py-1 space-y-1 text-xs md:text-sm font-mono" style={{ borderColor: theme.accent }}>
          <p className="text-white font-semibold">
            Welcome to <span style={{ color: theme.accent }}>{USER_PROFILE.name}'s</span> Interactive Terminal Portfolio!
          </p>
          <p className="text-gray-300">
            Role: <span className="text-gray-100">{USER_PROFILE.role}</span>
          </p>
          <p className="text-gray-400">
            Type <span className="font-bold underline" style={{ color: theme.accent }}>help</span> to list commands or tap any quick action below.
          </p>
        </div>
      </div>
    );

    setHistory([{
      id: 'init-motd',
      command: 'welcome',
      timestamp: new Date().toLocaleTimeString(),
      output: welcomeOutput,
    }]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Keep focus on input
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    sounds.playEnterChime();

    // Add to command history list
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let outputNode: React.ReactNode = null;

    switch (mainCmd) {
      case 'help':
      case '?':
        outputNode = (
          <div className="space-y-3 my-2 text-xs md:text-sm font-mono">
            <p className="font-bold text-white border-b border-white/10 pb-1">
              🚀 Available Commands & Utilities:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold mb-1" style={{ color: theme.accent }}>
                  — Navigation & Profile —
                </p>
                <div className="space-y-1">
                  <p><span className="font-bold text-white">about</span> - Biography, background & facts</p>
                  <p><span className="font-bold text-white">projects</span> (or <span className="text-gray-400">ls</span>) - Showcase of pinned works</p>
                  <p><span className="font-bold text-white">skills</span> - Interactive technical capability bars</p>
                  <p><span className="font-bold text-white">contact</span> - Email, GitHub & social handles</p>
                  <p><span className="font-bold text-white">whoami</span> - Current user & environment</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold mb-1" style={{ color: theme.accent }}>
                  — System & Visuals —
                </p>
                <div className="space-y-1">
                  <p><span className="font-bold text-white">theme [name]</span> - Change terminal color theme</p>
                  <p><span className="font-bold text-white">matrix</span> - Toggle falling digital rain</p>
                  <p><span className="font-bold text-white">crt</span> - Toggle retro CRT scanline effect</p>
                  <p><span className="font-bold text-white">audio</span> - Toggle typing & chime audio clicks</p>
                  <p><span className="font-bold text-white">gui</span> - Switch to visual web card view</p>
                  <p><span className="font-bold text-white">banner</span> - Display ASCII brand banner</p>
                  <p><span className="font-bold text-white">clear</span> (or <span className="text-gray-400">cls</span>) - Clean terminal screen</p>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-xs italic pt-1">
              Tip: Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-white font-mono">Tab</kbd> for auto-completion or <kbd className="px-1 py-0.5 rounded bg-white/10 text-white font-mono">↑</kbd><kbd className="px-1 py-0.5 rounded bg-white/10 text-white font-mono">↓</kbd> for history.
            </p>
          </div>
        );
        break;

      case 'about':
        outputNode = (
          <div className="space-y-3 my-2 text-xs md:text-sm font-mono border-l-2 pl-3" style={{ borderColor: theme.accent }}>
            <div className="flex items-center gap-3">
              <img 
                src={USER_PROFILE.avatar} 
                alt="Avatar" 
                className="w-12 h-12 rounded-full border border-white/20"
              />
              <div>
                <h4 className="font-bold text-white text-base">{USER_PROFILE.name} (@{USER_PROFILE.handle})</h4>
                <p className="text-xs" style={{ color: theme.accent }}>{USER_PROFILE.role}</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">
              {USER_PROFILE.bio}
            </p>

            <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-1.5 text-xs">
              <p><span className="text-gray-400">💻 Core Languages:</span> Python, C++, C, TypeScript, JavaScript, SQL, HTML5, CSS3</p>
              <p><span className="text-gray-400">🎯 Specialties:</span> Audio/Video Streaming Engines, Progressive Web Apps (PWA), AI Chatbots & Voice Assistants</p>
              <p><span className="text-gray-400">📍 Location:</span> {USER_PROFILE.location}</p>
              <p><span className="text-gray-400">📫 Contact:</span> <a href={`mailto:${USER_PROFILE.email}`} className="underline hover:text-white" style={{ color: theme.accent }}>{USER_PROFILE.email}</a></p>
            </div>
          </div>
        );
        break;

      case 'projects':
      case 'ls':
      case 'proj':
        outputNode = (
          <div className="space-y-4 my-3 text-xs md:text-sm font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <p className="font-bold text-white">📁 Showcase & Pinned Projects ({PINNED_PROJECTS.length}):</p>
              <span className="text-[11px] text-gray-400">Click links to inspect repo or live demo</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {PINNED_PROJECTS.map((proj: Project) => (
                <div 
                  key={proj.id} 
                  className="p-3.5 rounded-xl border transition-all hover:border-white/40"
                  style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: theme.border }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">{proj.name}</span>
                      {proj.pinned && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: theme.badgeBg, color: theme.badgeText }}>
                          <Star size={10} fill="currentColor" /> Pinned
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">[{proj.category}]</span>
                  </div>

                  <p className="text-xs text-gray-300 mb-2">{proj.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {proj.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded border hover:bg-white/10 transition-colors"
                      style={{ borderColor: theme.border, color: theme.text }}
                    >
                      <Github size={13} />
                      <span>GitHub</span>
                    </a>

                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded transition-colors"
                        style={{ background: theme.accent, color: theme.bg }}
                      >
                        <ExternalLink size={13} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-4 my-2 text-xs md:text-sm font-mono">
            <p className="font-bold text-white border-b border-white/10 pb-1">
              ⚡ Technical Proficiency & Skills Matrix:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="p-3 rounded-xl border bg-white/5 space-y-2.5" style={{ borderColor: theme.border }}>
                  <p className="font-bold text-white text-xs uppercase tracking-wide flex items-center gap-2" style={{ color: theme.accent }}>
                    <span>▶</span> {cat.title}
                  </p>

                  <div className="space-y-2">
                    {cat.skills.map((s) => {
                      const bars = Math.round((s.level / 100) * 16);
                      const barStr = '█'.repeat(bars) + '░'.repeat(16 - bars);
                      return (
                        <div key={s.name} className="text-xs">
                          <div className="flex justify-between text-gray-300 font-mono">
                            <span>{s.name}</span>
                            <span style={{ color: theme.accent }}>{s.level}%</span>
                          </div>
                          <div className="text-[11px] font-mono tracking-tight" style={{ color: theme.accent }}>
                            [{barStr}]
                          </div>
                          {s.info && <p className="text-[10px] text-gray-400 mt-0.5">{s.info}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'contact':
      case 'socials':
        outputNode = (
          <div className="space-y-3 my-2 text-xs md:text-sm font-mono border-l-2 pl-3" style={{ borderColor: theme.accent }}>
            <p className="font-bold text-white">📫 Connect with {USER_PROFILE.name}:</p>
            <div className="space-y-1.5">
              <p>
                <span className="text-gray-400">Email: </span>
                <a href={`mailto:${USER_PROFILE.email}`} className="font-bold underline" style={{ color: theme.accent }}>
                  {USER_PROFILE.email}
                </a>
              </p>
              <p>
                <span className="text-gray-400">GitHub: </span>
                <a href={USER_PROFILE.github} target="_blank" rel="noreferrer" className="font-bold underline" style={{ color: theme.accent }}>
                  {USER_PROFILE.github}
                </a>
              </p>
              <p>
                <span className="text-gray-400">Portfolio: </span>
                <span className="text-emerald-400 font-bold">d4rxh.netlify.app</span>
              </p>
            </div>
            <p className="text-xs text-gray-400 italic pt-1">
              "Feel free to reach out for project inquiries, open source collaborations, or just to say hi!"
            </p>
          </div>
        );
        break;

      case 'theme':
        if (args.length === 0) {
          const themeList = Object.keys(THEMES) as ThemeMode[];
          outputNode = (
            <div className="space-y-2 my-2 text-xs md:text-sm font-mono">
              <p className="font-bold text-white">🎨 Active Theme: <span style={{ color: theme.accent }}>{theme.name}</span></p>
              <p className="text-gray-300">Available Themes:</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {themeList.map((tKey) => (
                  <button
                    key={tKey}
                    onClick={() => onThemeChange(tKey)}
                    className="px-2.5 py-1 rounded text-xs font-mono border transition-all hover:scale-105"
                    style={{
                      background: currentTheme === tKey ? THEMES[tKey].accent : 'rgba(255, 255, 255, 0.05)',
                      color: currentTheme === tKey ? THEMES[tKey].bg : '#e5e7eb',
                      borderColor: THEMES[tKey].border,
                    }}
                  >
                    {tKey} {currentTheme === tKey ? '✓' : ''}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400">Usage: <code className="text-white">theme matrix</code>, <code className="text-white">theme sakura</code>, <code className="text-white">theme cyberpunk</code>, etc.</p>
            </div>
          );
        } else {
          const chosen = args[0].toLowerCase() as ThemeMode;
          if (THEMES[chosen]) {
            onThemeChange(chosen);
            outputNode = <p className="text-xs md:text-sm font-mono text-emerald-400">Switched theme to {THEMES[chosen].name}!</p>;
          } else {
            sounds.playErrorBeep();
            outputNode = <p className="text-xs md:text-sm font-mono text-rose-400">Theme '{args[0]}' not recognized. Try: {Object.keys(THEMES).join(', ')}</p>;
          }
        }
        break;

      case 'matrix':
        onToggleMatrix();
        outputNode = <p className="text-xs md:text-sm font-mono text-emerald-400">Matrix digital rain {matrixEnabled ? 'disabled' : 'enabled'}!</p>;
        break;

      case 'crt':
        onToggleCrt();
        outputNode = <p className="text-xs md:text-sm font-mono text-emerald-400">CRT scanline effect {crtEnabled ? 'disabled' : 'enabled'}!</p>;
        break;

      case 'audio':
      case 'sound':
        onToggleSound();
        outputNode = <p className="text-xs md:text-sm font-mono text-emerald-400">Terminal audio click sound {soundEnabled ? 'muted' : 'enabled'}!</p>;
        break;

      case 'gui':
      case 'view':
        onSwitchToGui();
        outputNode = <p className="text-xs md:text-sm font-mono text-emerald-400">Switching to Visual Card Portfolio Mode...</p>;
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        setInputVal('');
        return;

      case 'banner':
      case 'motd':
        outputNode = (
          <pre className="font-mono text-xs md:text-sm leading-none overflow-x-auto select-none font-bold" style={{ color: theme.accent }}>
            {ASCII_BANNER}
          </pre>
        );
        break;

      case 'whoami':
        outputNode = <p className="text-xs md:text-sm font-mono text-gray-300">guest@d4rxh-portfolio [Authenticated as Developer Visitor]</p>;
        break;

      case 'date':
        outputNode = <p className="text-xs md:text-sm font-mono text-gray-300">{new Date().toString()}</p>;
        break;

      case 'history':
        outputNode = (
          <div className="text-xs md:text-sm font-mono space-y-1">
            <p className="font-bold text-white">Command History:</p>
            {commandHistory.map((cmd, idx) => (
              <p key={idx} className="text-gray-400">{idx + 1}. {cmd}</p>
            ))}
          </div>
        );
        break;

      case 'sudo':
        sounds.playErrorBeep();
        outputNode = (
          <p className="text-xs md:text-sm font-mono text-rose-400">
            Permission denied: User is not in the sudoers file. This incident will be reported to Darshan Rajput! 😉
          </p>
        );
        break;

      case 'cat':
        if (args.length === 0) {
          outputNode = <p className="text-xs md:text-sm font-mono text-yellow-400">Usage: cat &lt;filename&gt; (try: cat about.txt, cat skills.json)</p>;
        } else {
          const file = args[0].toLowerCase();
          if (file.includes('about')) {
            outputNode = <p className="text-xs md:text-sm font-mono text-gray-300">{USER_PROFILE.bio}</p>;
          } else if (file.includes('skill')) {
            outputNode = <pre className="text-xs font-mono text-emerald-400">{JSON.stringify(SKILL_CATEGORIES, null, 2)}</pre>;
          } else {
            sounds.playErrorBeep();
            outputNode = <p className="text-xs md:text-sm font-mono text-rose-400">cat: {args[0]}: No such file or directory</p>;
          }
        }
        break;

      default:
        sounds.playErrorBeep();
        outputNode = (
          <p className="text-xs md:text-sm font-mono text-rose-400">
            zsh: command not found: <span className="font-bold text-white">{trimmed}</span>. Type <span className="underline cursor-pointer text-white font-bold" onClick={() => executeCommand('help')}>help</span> for available commands.
          </p>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: trimmed,
        timestamp: new Date().toLocaleTimeString(),
        output: outputNode,
      },
    ]);

    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    sounds.playKeyClick();

    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;
      const match = availableCommands.find((c) => c.startsWith(current));
      if (match) {
        setInputVal(match);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
      setInputVal('');
    }
  };

  return (
    <div 
      className={`mx-auto w-full transition-all duration-300 z-10 relative flex flex-col ${
        isMaximized 
          ? 'fixed inset-0 p-2 md:p-4 max-w-full h-full' 
          : 'max-w-5xl h-[88vh] md:h-[82vh] rounded-2xl shadow-2xl p-2 md:p-6'
      }`}
    >
      <div 
        onClick={handleTerminalClick}
        className="w-full h-full flex flex-col rounded-xl overflow-hidden border backdrop-blur-xl relative transition-colors duration-500 shadow-2xl"
        style={{ background: theme.terminalBg, borderColor: theme.border }}
      >
        {/* Terminal Header Bar */}
        <div 
          className="px-4 py-3 border-b flex items-center justify-between select-none z-20"
          style={{ background: theme.headerBg, borderColor: theme.border }}
        >
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setHistory([])}
              title="Clear Terminal" 
              className="w-3.5 h-3.5 rounded-full bg-red-500/90 hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center text-[8px] text-red-950 font-bold opacity-80 hover:opacity-100"
            >
              ×
            </button>
            <button 
              onClick={onToggleMatrix}
              title="Toggle Matrix Rain" 
              className="w-3.5 h-3.5 rounded-full bg-yellow-500/90 hover:bg-yellow-600 transition-colors cursor-pointer flex items-center justify-center text-[8px] text-yellow-950 font-bold opacity-80 hover:opacity-100"
            >
              -
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              title="Maximize / Restore" 
              className="w-3.5 h-3.5 rounded-full bg-emerald-500/90 hover:bg-emerald-600 transition-colors cursor-pointer flex items-center justify-center text-[8px] text-emerald-950 font-bold opacity-80 hover:opacity-100"
            >
              +
            </button>
          </div>

          {/* Title Tab */}
          <div className="flex items-center gap-2 font-mono text-xs md:text-sm font-semibold text-gray-300 truncate px-2">
            <TerminalIcon size={14} style={{ color: theme.accent }} />
            <span>d4rxh@portfolio: ~ ({theme.name})</span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute Sounds' : 'Enable Audio'}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              {soundEnabled ? <Volume2 size={15} style={{ color: theme.accent }} /> : <VolumeX size={15} />}
            </button>

            {/* CRT Toggle */}
            <button
              onClick={onToggleCrt}
              title={crtEnabled ? 'Disable CRT' : 'Enable CRT Scanlines'}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <Tv size={15} style={{ color: crtEnabled ? theme.accent : undefined }} />
            </button>

            {/* Matrix Rain Toggle */}
            <button
              onClick={onToggleMatrix}
              title="Toggle Matrix Rain"
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <Sparkles size={15} style={{ color: matrixEnabled ? theme.accent : undefined }} />
            </button>

            {/* Maximize Toggle */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              title="Toggle Fullscreen"
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-gray-400 hover:text-white hidden sm:block"
            >
              {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            {/* Switch to GUI button */}
            <button
              onClick={onSwitchToGui}
              title="Switch to GUI Portfolio View"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all active:scale-95 ml-1"
              style={{ background: theme.badgeBg, color: theme.accent, border: `1px solid ${theme.border}` }}
            >
              <Layout size={13} />
              <span className="hidden sm:inline">GUI View</span>
            </button>
          </div>
        </div>

        {/* Quick Command Pills for 1-Tap Navigation */}
        <div 
          className="px-4 py-2 border-b flex items-center gap-2 overflow-x-auto select-none shrink-0"
          style={{ background: 'rgba(0, 0, 0, 0.25)', borderColor: theme.border }}
        >
          <span className="text-[11px] text-gray-400 uppercase font-mono font-bold shrink-0">Quick Run:</span>
          {quickPills.map((p) => (
            <button
              key={p.label}
              onClick={() => executeCommand(p.cmd)}
              className="px-2.5 py-0.5 rounded text-xs font-mono transition-all hover:scale-105 active:scale-95 shrink-0 border"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderColor: theme.border,
                color: theme.text,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Terminal Output Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3 font-mono text-xs md:text-sm select-text">
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              {item.command !== 'welcome' && (
                <div className="flex items-center gap-2 text-gray-400 font-mono">
                  <span className="font-bold" style={{ color: theme.prompt }}>d4rxh@portfolio:~$</span>
                  <span className="text-white font-semibold">{item.command}</span>
                  <span className="text-[10px] text-gray-400 ml-auto">{item.timestamp}</span>
                </div>
              )}
              {item.output && <div className="mt-1">{item.output}</div>}
            </div>
          ))}

          {/* Active Input Line */}
          <div className="flex items-center gap-2 pt-2">
            <span className="font-bold shrink-0 font-mono" style={{ color: theme.prompt }}>
              d4rxh@portfolio:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent border-none outline-none font-mono text-xs md:text-sm text-white caret-emerald-400 w-full"
              placeholder="type 'help' for commands..."
              style={{ color: theme.text }}
            />
          </div>

          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
