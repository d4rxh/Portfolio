import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types/terminal';
import { PINNED_PROJECTS as STATIC_PROJECTS } from '../data/portfolioData';
import { fetchLiveProjects } from '../services/githubService';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(false);

  const loadProjects = useCallback(async (force = false) => {
    setLoading(true);
    try {
      const data = await fetchLiveProjects(force);
      setProjects(data);
      setIsLiveSynced(true);
    } catch (err) {
      console.warn('Falling back to static projects:', err);
      setProjects(STATIC_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects(false);
  }, [loadProjects]);

  const pinnedProjects = projects.filter((p) => p.pinned);

  return {
    projects,
    pinnedProjects,
    loading,
    isLiveSynced,
    refresh: () => loadProjects(true),
  };
}
