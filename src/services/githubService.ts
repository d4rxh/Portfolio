import { Project } from '../types/terminal';
import { PINNED_PROJECTS as STATIC_PROJECTS } from '../data/portfolioData';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  updated_at: string;
  created_at: string;
}

const GITHUB_USERNAME = 'd4rxh';
const CACHE_KEY = 'd4rxh_github_repos_v2';
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes cache

// Curated list of repo names to pin if not otherwise flagged
const KNOWN_PINNED_NAMES = ['kawai', 'kawai-sakura-flix', 'siri-gpt', 'haruno', 'fileora'];

function inferCategory(repo: GitHubRepo): 'Streaming' | 'AI / Bots' | 'Web Apps' | 'Tools' {
  const name = repo.name.toLowerCase();
  const desc = (repo.description || '').toLowerCase();
  const topics = (repo.topics || []).map((t) => t.toLowerCase());

  if (
    name.includes('stream') ||
    name.includes('music') ||
    name.includes('flix') ||
    name.includes('kawai') ||
    name.includes('haruno') ||
    topics.includes('music') ||
    topics.includes('streaming')
  ) {
    return 'Streaming';
  }
  if (
    name.includes('bot') ||
    name.includes('gpt') ||
    name.includes('ai') ||
    name.includes('siri') ||
    topics.includes('bot') ||
    topics.includes('ai')
  ) {
    return 'AI / Bots';
  }
  if (
    name.includes('tool') ||
    name.includes('cli') ||
    name.includes('script') ||
    topics.includes('tool')
  ) {
    return 'Tools';
  }
  return 'Web Apps';
}

function inferEmoji(repo: GitHubRepo): string {
  const name = repo.name.toLowerCase();
  if (name.includes('file') || name.includes('ora')) return '📂';
  if (name.includes('sakura') || name.includes('kawai')) return '🌸';
  if (name.includes('haruno')) return '🖤';
  if (name.includes('flix') || name.includes('anime')) return '🎬';
  if (name.includes('siri') || name.includes('gpt')) return '🤖';
  if (name.includes('game') || name.includes('seek')) return '🎮';
  if (name.includes('tool')) return '🛠️';
  if (name.includes('bot')) return '🕹️';
  if (name.includes('login') || name.includes('auth')) return '🔐';
  if (repo.language === 'Python') return '🐍';
  if (repo.language === 'TypeScript' || repo.language === 'JavaScript') return '⚡';
  return '📦';
}

export async function fetchLiveProjects(forceRefresh = false): Promise<Project[]> {
  // Check session cache first for fast repeat loads
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.data)) {
          return parsed.data;
        }
      }
    } catch {
      // ignore
    }
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!res.ok) {
      console.warn(`GitHub API returned status ${res.status}. Falling back to curated catalog.`);
      return STATIC_PROJECTS;
    }

    const repos: GitHubRepo[] = await res.json();

    // Filter out forks, user profile readme repo (d4rxh), and portfolio repo
    const filteredRepos = repos.filter(
      (r) =>
        !r.fork &&
        r.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase() &&
        r.name.toLowerCase() !== 'portfolio'
    );

    // Build lookup map from existing rich static projects
    const staticMap = new Map<string, Project>();
    STATIC_PROJECTS.forEach((p) => {
      staticMap.set(p.id.toLowerCase(), p);
      // Also match without emojis
      const stripped = p.name.replace(/^[^\w]+/, '').trim().toLowerCase();
      staticMap.set(stripped, p);
    });

    const mergedProjects: Project[] = [];

    for (const repo of filteredRepos) {
      const cleanId = repo.name.toLowerCase();
      const staticMatch = staticMap.get(cleanId);

      // A project is pinned if it's in known pinned list, or has topic 'pinned', or has live demo homepage
      const hasPinnedTopic = (repo.topics || []).some((t) =>
        ['pinned', 'pin', 'featured', 'highlight'].includes(t.toLowerCase())
      );
      const isKnownPinned = KNOWN_PINNED_NAMES.includes(cleanId);
      const hasLiveUrl = Boolean(repo.homepage && repo.homepage.trim().length > 0);
      const isPinned = staticMatch ? staticMatch.pinned : isKnownPinned || hasPinnedTopic || hasLiveUrl;

      const liveUrl =
        repo.homepage && repo.homepage.trim().length > 0
          ? repo.homepage.trim()
          : staticMatch?.liveUrl;

      if (staticMatch) {
        // Merge GitHub metadata with rich curated details
        mergedProjects.push({
          ...staticMatch,
          githubUrl: repo.html_url,
          liveUrl,
          pinned: isPinned,
          tags: Array.from(
            new Set([
              ...staticMatch.tags,
              ...(repo.language ? [repo.language] : []),
              ...(repo.topics || []),
            ])
          ),
        });
      } else {
        // Brand new repository automatically discovered from GitHub!
        const emoji = inferEmoji(repo);
        const category = inferCategory(repo);
        const tags = [repo.language, ...(repo.topics || [])].filter(Boolean) as string[];

        mergedProjects.push({
          id: cleanId,
          name: `${emoji} ${repo.name}`,
          tagline: repo.description || 'Open source project on GitHub',
          description:
            repo.description ||
            `Active open source repository created by Darshan on GitHub with full documentation and source code.`,
          tags: tags.length > 0 ? tags : ['Open Source'],
          githubUrl: repo.html_url,
          liveUrl,
          pinned: isPinned,
          category,
          features: [
            'Automatically discovered from GitHub repository',
            repo.language ? `Written in ${repo.language}` : 'Full source code available',
            liveUrl ? 'Live production preview link configured' : 'Open source contribution ready',
          ],
        });
      }
    }

    // Sort: Pinned projects at the very top (highlighted front), then alphabetically
    mergedProjects.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.name.localeCompare(b.name);
    });

    // Save to session cache
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: mergedProjects })
        );
      } catch {
        // ignore
      }
    }

    return mergedProjects;
  } catch (err) {
    console.error('Error fetching live GitHub projects:', err);
    return STATIC_PROJECTS;
  }
}
