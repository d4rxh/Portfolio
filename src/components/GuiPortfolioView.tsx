import React, { useState } from 'react';
import { SKILL_CATEGORIES, USER_PROFILE, THEMES } from '../data/portfolioData';
import { ThemeMode, Project } from '../types/terminal';
import { useProjects } from '../hooks/useProjects';
import { 
  Terminal, 
  ExternalLink, 
  Github, 
  Mail, 
  Code2, 
  Sparkles, 
  Layers, 
  Cpu, 
  Server, 
  CheckCircle2, 
  Star,
  Copy,
  Check,
  Play,
  RefreshCw
} from 'lucide-react';

interface GuiPortfolioViewProps {
  currentTheme: ThemeMode;
  onSwitchToTerminal: () => void;
  onExecuteCommand: (cmd: string) => void;
}

export const GuiPortfolioView: React.FC<GuiPortfolioViewProps> = ({
  currentTheme,
  onSwitchToTerminal,
}) => {
  const theme = THEMES[currentTheme];
  const { projects, loading, refresh } = useProjects();
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Derive unique categories dynamically
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(USER_PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full pb-36 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto relative select-text">
      {/* Top Navbar */}
      <header className="py-4 sm:py-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 mb-8 sm:mb-12">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shrink-0"
            style={{ background: theme.accent, color: theme.bg }}
          >
            &gt;_
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg tracking-wide text-white leading-tight">
              {USER_PROFILE.name}
            </h1>
            <p className="text-xs text-gray-400">@{USER_PROFILE.handle} • Portfolio</p>
          </div>
        </div>

        <button
          onClick={onSwitchToTerminal}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-medium transition-all shadow-md hover:scale-105 active:scale-95 ml-auto"
          style={{ background: theme.headerBg, border: `1px solid ${theme.border}`, color: theme.accent }}
        >
          <Terminal size={15} />
          <span>Launch CLI</span>
        </button>
      </header>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start mb-14 sm:mb-20">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: theme.badgeBg, color: theme.badgeText }}
          >
            <span className="w-2 h-2 rounded-full animate-ping shrink-0" style={{ background: theme.accent }}></span>
            <span className="truncate">Available for projects & engineering roles</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Building High-Speed <span style={{ color: theme.accent }}>Streaming Platforms</span> & Intelligent <span style={{ color: theme.accent }}>AI Systems</span>.
          </h2>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
            {USER_PROFILE.bio}
          </p>

          <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-2">
            <a
              href={USER_PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg w-full sm:w-auto"
              style={{ background: theme.accent, color: theme.bg }}
            >
              <Github size={17} />
              <span>GitHub (@{USER_PROFILE.handle})</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 flex-1 sm:flex-none"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Mail size={16} />}
              <span>{copied ? 'Copied!' : 'Email Me'}</span>
            </button>

            <button
              onClick={onSwitchToTerminal}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm border border-white/10 hover:border-white/30 text-gray-300 transition-all flex-1 sm:flex-none font-mono"
            >
              <Code2 size={16} />
              <span>Terminal CLI</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div 
          className="rounded-2xl p-5 sm:p-6 border backdrop-blur-md relative overflow-hidden shadow-2xl"
          style={{ background: theme.terminalBg, borderColor: theme.border }}
        >
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={USER_PROFILE.avatar} 
              alt={USER_PROFILE.name} 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 object-cover shadow-md shrink-0"
              style={{ borderColor: theme.accent }}
            />
            <div className="min-w-0">
              <h3 className="font-bold text-white text-base sm:text-lg truncate">{USER_PROFILE.name}</h3>
              <p className="text-xs text-gray-400 truncate">Full-Stack & Systems Developer</p>
              <p className="text-xs mt-1" style={{ color: theme.accent }}>📍 {USER_PROFILE.location}</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-gray-300 border-t border-white/10 pt-3.5">
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Public Repos</span>
              <span className="font-semibold text-white font-mono">{USER_PROFILE.stats.publicRepos} Repositories</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Specialization</span>
              <span className="font-semibold text-white">Audio/Video Streaming & AI</span>
            </div>
            <div className="flex flex-col py-1 gap-1">
              <span className="text-gray-400">Primary Stack</span>
              <span className="font-semibold text-xs leading-normal" style={{ color: theme.accent }}>
                {USER_PROFILE.stats.primaryStack.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-14 sm:mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap" style={{ color: theme.accent }}>
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">GitHub Live Showcase</span>
              <span 
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border"
                style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: theme.border, color: theme.accent }}
                title="Automatically synced with GitHub @d4rxh"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'animate-ping' : ''}`} style={{ background: theme.accent }} />
                <span>Auto-Synced</span>
              </span>
              <button
                onClick={() => refresh()}
                disabled={loading}
                className="p-1 rounded-md border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all text-xs"
                title="Refresh repositories from GitHub"
              >
                <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            <h3 className="text-xl sm:text-3xl font-bold text-white">Featured & GitHub Repositories</h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Live repos from <a href="https://github.com/d4rxh" target="_blank" rel="noreferrer" className="underline hover:text-white" style={{ color: theme.accent }}>@d4rxh</a>. Pinned & showcase projects are highlighted first.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0"
                style={{
                  background: selectedCategory === cat ? theme.accent : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory === cat ? theme.bg : '#9ca3af',
                  border: `1px solid ${selectedCategory === cat ? theme.accent : 'rgba(255, 255, 255, 0.1)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredProjects.map((project: Project) => (
            <div
              key={project.id}
              className={`rounded-2xl p-5 sm:p-6 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group relative ${
                project.pinned ? 'ring-1' : ''
              }`}
              style={{ 
                background: theme.terminalBg, 
                borderColor: project.pinned ? theme.accent : theme.border,
                boxShadow: project.pinned ? `0 0 24px -8px ${theme.glow}` : undefined,
                ['--tw-ring-color' as any]: project.pinned ? `${theme.accent}44` : 'transparent',
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-lg sm:text-xl text-white group-hover:text-emerald-400 transition-colors" style={{ color: theme.text }}>
                        {project.name}
                      </h4>
                      {project.pinned && (
                        <span 
                          className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-sm" 
                          style={{ 
                            background: theme.badgeBg, 
                            color: theme.badgeText,
                            border: `1px solid ${theme.accent}66`
                          }}
                        >
                          <Star size={10} fill="currentColor" /> Highlighted
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{project.tagline}</p>
                  </div>

                  <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-mono bg-white/5 border border-white/10 text-gray-400 shrink-0">
                    {project.category}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Key Features Bullet List */}
                <div className="mb-4 space-y-1.5">
                  {project.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: theme.accent }} />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono border"
                      style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)', color: '#d1d5db' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons: Prominent "Try Now 🚀" and "GitHub" */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-3 border-t border-white/10">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all hover:opacity-95 hover:scale-[1.02] active:scale-95 shadow-lg order-1 sm:order-2"
                      style={{ 
                        background: theme.accent, 
                        color: theme.bg,
                        boxShadow: `0 4px 16px ${theme.glow}` 
                      }}
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Try Now 🚀</span>
                      <ExternalLink size={13} className="opacity-75" />
                    </a>
                  ) : null}

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all hover:bg-white/10 active:scale-95 order-2 sm:order-1"
                    style={{ borderColor: theme.border, color: theme.text }}
                  >
                    <Github size={15} />
                    <span>View GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-14 sm:mb-20">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-1.5" style={{ color: theme.accent }}>
            <Layers size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Expertise</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-bold text-white">Technical Arsenal & Stack</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-5 sm:p-6 border backdrop-blur-md"
              style={{ background: theme.terminalBg, borderColor: theme.border }}
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-5 pb-3 border-b border-white/10">
                <div className="p-2 rounded-lg" style={{ background: theme.badgeBg, color: theme.accent }}>
                  {cat.title.includes('Languages') ? <Code2 size={18} /> :
                   cat.title.includes('Frontend') ? <Layers size={18} /> :
                   cat.title.includes('Backend') ? <Server size={18} /> : <Cpu size={18} />}
                </div>
                <h4 className="font-bold text-base sm:text-lg text-white">{cat.title}</h4>
              </div>

              <div className="space-y-3.5">
                {cat.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-gray-200">{skill.name}</span>
                      <span className="font-mono" style={{ color: theme.accent }}>{skill.level}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%`, background: theme.accent }}
                      />
                    </div>
                    {skill.info && (
                      <p className="text-[11px] text-gray-400 mt-1">{skill.info}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section 
        className="rounded-2xl p-6 sm:p-10 border text-center relative overflow-hidden shadow-2xl"
        style={{ background: theme.terminalBg, borderColor: theme.border }}
      >
        <h3 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Let's Connect & Build Together</h3>
        <p className="text-gray-400 text-xs sm:text-sm max-w-lg mx-auto mb-6 leading-relaxed">
          Have an exciting project, open source idea, or collaboration in mind? Reach out directly.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 max-w-md mx-auto">
          <a
            href={`mailto:${USER_PROFILE.email}`}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-lg w-full sm:w-auto"
            style={{ background: theme.accent, color: theme.bg }}
          >
            <Mail size={16} />
            <span>Send Email ({USER_PROFILE.email})</span>
          </a>

          <a
            href={USER_PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <Github size={16} />
            <span>GitHub Profile</span>
          </a>
        </div>
      </section>
    </div>
  );
};
