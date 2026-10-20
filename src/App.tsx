import React, { useState } from 'react';
import { THEMES } from './data/portfolioData';
import { ThemeMode } from './types/terminal';
import { TerminalWindow } from './components/TerminalWindow';
import { GuiPortfolioView } from './components/GuiPortfolioView';
import { MatrixBackground } from './components/MatrixBackground';
import { sounds } from './components/SoundEffects';
import { Terminal, Layout } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('matrix');
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [matrixEnabled, setMatrixEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<'terminal' | 'gui'>('terminal');

  const theme = THEMES[currentTheme];

  const handleToggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div 
      className={`min-h-screen w-full relative flex flex-col justify-center items-center transition-colors duration-700 ${
        crtEnabled ? 'crt-overlay crt-scanline' : ''
      }`}
      style={{ 
        backgroundColor: theme.bg,
        ['--theme-accent' as any]: theme.accent,
        ['--theme-border' as any]: theme.border,
        ['--theme-glow' as any]: theme.glow,
      }}
    >
      {/* Matrix Falling Code Background */}
      {matrixEnabled && <MatrixBackground color={theme.accent} opacity={0.25} />}

      {/* Floating View Switcher at bottom-right */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setViewMode(viewMode === 'terminal' ? 'gui' : 'terminal')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-2xl backdrop-blur-md border transition-all hover:scale-105 active:scale-95"
          style={{ 
            background: theme.headerBg, 
            borderColor: theme.border, 
            color: theme.accent,
            boxShadow: `0 8px 32px ${theme.glow}` 
          }}
        >
          {viewMode === 'terminal' ? (
            <>
              <Layout size={15} />
              <span>Switch to GUI View</span>
            </>
          ) : (
            <>
              <Terminal size={15} />
              <span>Switch to Terminal</span>
            </>
          )}
        </button>
      </div>

      {/* Main View Area */}
      <main className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 z-10">
        {viewMode === 'terminal' ? (
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
        ) : (
          <GuiPortfolioView
            currentTheme={currentTheme}
            onSwitchToTerminal={() => setViewMode('terminal')}
            onExecuteCommand={() => {}}
          />
        )}
      </main>
    </div>
  );
};

export default App;
