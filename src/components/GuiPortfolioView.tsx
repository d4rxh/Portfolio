import React, { useState } from 'react';
import { PINNED_PROJECTS, SKILL_CATEGORIES, USER_PROFILE, THEMES } from '../data/portfolioData';
import { ThemeMode, Project } from '../types/terminal';
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
  Check
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
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Streaming', 'AI / Bots', 'Web Apps'];

  const filteredProjects = selectedCategory === 'All'
    ? PINNED_PROJECTS
    : PINNED_PROJECTS.filter((p) => p.category === selectedCategory);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(USER_PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-7xl mx-auto z-10 relative select-text">
      {/* Top Navbar */}
      <header className="py-6 flex items-center justify-between border-b border-white/10 mb-10">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg"
            style={{ background: theme.accent, color: theme.bg }}
          >
            &gt;_
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide text-white">
              {USER_PROFILE.name}
            </h1>
            <p className="text-xs text-gray-400">@{USER_PROFILE.handle} • Portfolio</p>
          </div>
        </div>

        <button
          onClick={onSwitchToTerminal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:scale-105 active:scale-95"
          style={{ background: theme.headerBg, border: `1px solid ${theme.border}`, color: theme.accent }}
        >
          <Terminal size={16} />
          <span>Launch CLI Terminal</span>
        </button>
      </header>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-16">
        <div className="lg:col-span-2 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: theme.badgeBg, color: theme.badgeText }}>
            <span className="w-2 h-2 rounded-full animate-ping" style={{ background: theme.accent }}></span>
            <span>Available for innovative projects & collaborations</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Building High-Speed <span style={{ color: theme.accent }}>Streaming Platforms</span> & Intelligent <span style={{ color: theme.accent }}>AI Systems</span>.
          </h2>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl leading-relaxed">
            {USER_PROFILE.bio}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={USER_PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg"
              style={{ background: theme.accent, color: theme.bg }}
            >
              <Github size={18} />
              <span>GitHub Profile</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95"
            >
              {copied ? <Check size={18} className="text-emerald-400" /> : <Mail size={18} />}
              <span>{copied ? 'Email Copied!' : 'Copy Email'}</span>
            </button>

            <button
              onClick={onSwitchToTerminal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm border border-white/10 hover:border-white/30 text-gray-300 transition-all"
            >
              <Code2 size={18} />
              <span>Interactive CLI</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div 
          className="rounded-2xl p-6 border backdrop-blur-md relative overflow-hidden shadow-2xl"
          style={{ background: theme.terminalBg, borderColor: theme.border }}
        >
          <div className="flex items-center gap-4 mb-5">
            <img 
              src={USER_PROFILE.avatar} 
              alt={USER_PROFILE.name} 
              className="w-16 h-16 rounded-full border-2 object-cover shadow-md"
              style={{ borderColor: theme.accent }}
            />
            <div>
              <h3 className="font-bold text-white text-lg">{USER_PROFILE.name}</h3>
              <p className="text-xs text-gray-400">Full-Stack & Systems Developer</p>
              <p className="text-xs mt-1" style={{ color: theme.accent }}>📍 {USER_PROFILE.location}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-300 border-t border-white/10 pt-4">
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Public Repos</span>
              <span className="font-semibold text-white">{USER_PROFILE.stats.publicRepos} Repositories</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Specialization</span>
              <span className="font-semibold text-white">Audio/Video Streaming & AI</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Primary Stack</span>
              <span className="font-semibold text-right max-w-[180px] truncate" style={{ color: theme.accent }}>
                {USER_PROFILE.stats.primaryStack.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2" style={{ color: theme.accent }}>
              <Sparkles size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Featured Work</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">Pinned & Showcase Projects</h3>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project: Project) => (
            <div
              key={project.id}
              className="rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
              style={{ background: theme.terminalBg, borderColor: theme.border }}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xl text-white group-hover:text-emerald-400 transition-colors" style={{ color: theme.text }}>
                        {project.name}
                      </h4>
                      {project.pinned && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: theme.badgeBg, color: theme.badgeText }}>
                          <Star size={10} fill="currentColor" /> Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{project.tagline}</p>
                  </div>

                  <span className="text-[11px] px-2.5 py-1 rounded-md font-mono bg-white/5 border border-white/10 text-gray-400">
                    {project.category}
                  </span>
                </div>

                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Key Features Bullet List */}
                <div className="mb-4 space-y-1.5">
                  {project.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: theme.accent }} />
                      <span>{feat}</span>
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
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-mono border"
                      style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)', color: '#d1d5db' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold border transition-all hover:bg-white/10"
                    style={{ borderColor: theme.border, color: theme.text }}
                  >
                    <Github size={14} />
                    <span>View Repository</span>
                  </a>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                      style={{ background: theme.accent, color: theme.bg }}
                    >
                      <ExternalLink size={14} />
                      <span>Live Preview</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-20">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2" style={{ color: theme.accent }}>
            <Layers size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Expertise</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">Technical Arsenal & Stack</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-6 border backdrop-blur-md"
              style={{ background: theme.terminalBg, borderColor: theme.border }}
            >
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/10">
                <div className="p-2 rounded-lg" style={{ background: theme.badgeBg, color: theme.accent }}>
                  {cat.title.includes('Languages') ? <Code2 size={20} /> :
                   cat.title.includes('Frontend') ? <Layers size={20} /> :
                   cat.title.includes('Backend') ? <Server size={20} /> : <Cpu size={20} />}
                </div>
                <h4 className="font-bold text-lg text-white">{cat.title}</h4>
              </div>

              <div className="space-y-4">
                {cat.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-gray-200">{skill.name}</span>
                      <span style={{ color: theme.accent }}>{skill.level}%</span>
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
        className="rounded-2xl p-8 border text-center relative overflow-hidden"
        style={{ background: theme.terminalBg, borderColor: theme.border }}
      >
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Let's Connect & Build Together</h3>
        <p className="text-gray-400 text-sm max-w-lg mx-auto mb-6">
          Have an exciting project, open source idea, or collaboration in mind? Reach out directly.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4">
          <a
            href={`mailto:${USER_PROFILE.email}`}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ background: theme.accent, color: theme.bg }}
          >
            <Mail size={16} />
            <span>Send Email</span>
          </a>

          <a
            href={USER_PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-105 active:scale-95"
          >
            <Github size={16} />
            <span>GitHub Profile</span>
          </a>
        </div>
      </section>
    </div>
  );
};
