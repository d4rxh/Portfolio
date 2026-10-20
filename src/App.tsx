import React, { useState, useEffect } from 'react';
import { THEMES } from './data/portfolioData';
import { ThemeMode } from './types/terminal';
import { TerminalWindow } from './components/TerminalWindow';
import { GuiPortfolioView } from './components/GuiPortfolioView';
import { MatrixBackground } from './components/MatrixBackground';
import { sounds } from './components/SoundEffects';
import { Terminal, Layout } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('matrix');
  const [crtEnabled, setCrtEnabled] = useState(false); // default CRT subtle/off for cleaner readability on mobile
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [matrixEnabled, setMatrixEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<'terminal' | 'gui'>('terminal');

  const theme = THEMES[currentTheme];

  const handleToggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Scroll to top when switching views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [viewMode]);

  return (
    <div 
      className={`min-h-screen w-full relative transition-colors duration-700 ${
        crtEnabled ? 'crt-overlay crt-scanline' : ''
      }`}
      style={{ 
        backgroundColor: theme.bg,
        ['--theme-accent' as any]: theme.accent,
        ['--theme-border' as any]: theme.border,
        ['--theme-glow' as any]: theme.glow,
      }}
    >
      {/* Matrix Falling Code Background (Fixed z-0) */}
      {matrixEnabled && <MatrixBackground color={theme.accent} opacity={0.2} />}

      {/* Persistent Floating Mode Switcher Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setViewMode(viewMode === 'terminal' ? 'gui' : 'terminal')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono font-bold shadow-2xl backdrop-blur-xl border transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ 
            background: theme.headerBg, 
            borderColor: theme.accent, 
            color: theme.accent,
            boxShadow: `0 8px 30px ${theme.glow}` 
          }}
        >
          {viewMode === 'terminal' ? (
            <>
              <Layout size={16} />
              <span>Switch to GUI View</span>
            </>
          ) : (
            <>
              <Terminal size={16} />
              <span>Switch to CLI Terminal</span>
            </>
          )}
        </button>
      </div>

      {/* View Content */}
      {viewMode === 'terminal' ? (
        <div className="w-full min-h-screen flex items-center justify-center p-2 sm:p-4 z-10 relative">
          <TerminalWindow
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            crtEnabled={crtEnabled}
            onToggleCrt={() => setCrtEnabled(!crtEnabled)}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            matrixEnabled={matrixEnabled}
            onToggleMatrix={() => setMatrixEnabled(!matrixEnabled)}
            onSwitchToGui={() => setViewMode('gui')}
          />
        </div>
      ) : (
        <div className="w-full min-h-screen overflow-y-auto z-10 relative">
          <GuiPortfolioView
            currentTheme={currentTheme}
            onSwitchToTerminal={() => setViewMode('terminal')}
            onExecuteCommand={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default App;
