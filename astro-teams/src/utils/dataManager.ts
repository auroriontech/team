/**
 * Data Manager Utility
 * 
 * Handles all data operations for the Aurorion Teams app including:
 * - Repository CRUD operations
 * - Team member management
 * - Data persistence with localStorage
 * - Export/import functionality
 * 
 * @author Aurorion Teams Collective
 * @version 1.0.0
 */

import type { Repository, TeamMember, AppState } from '../types';
import { defaultAgentRoles } from '../data/agentRoles';

const STORAGE_KEY = 'aurorion-teams-data';
const STORAGE_VERSION = '1.0.0';

/**
 * Default application state
 */
const defaultState: AppState = {
  repositories: [],
  agentRoles: defaultAgentRoles,
  theme: 'professional'
};

/**
 * Load application state from localStorage
 * @returns AppState - Current application state
 */
export function loadAppState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;
    
    const parsed = JSON.parse(stored);
    
    // Version compatibility check
    if (parsed.version !== STORAGE_VERSION) {
      console.warn('Data version mismatch. Using default state.');
      return defaultState;
    }
    
    return { ...defaultState, ...parsed.data };
  } catch (error) {
    console.error('Failed to load app state:', error);
    return defaultState;
  }
}

/**
 * Save application state to localStorage
 * @param state - Application state to save
 */
export function saveAppState(state: AppState): void {
  try {
    const dataToSave = {
      version: STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      data: state
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Failed to save app state:', error);
    throw new Error('Unable to save data. Storage may be full.');
  }
}

/**
 * Create a new repository
 * @param name - Repository name
 * @param description - Repository description
 * @param organizationId - Optional organization ID
 * @param userId - Optional user ID
 * @returns Repository - New repository object
 */
export function createRepository(
  name: string, 
  description: string, 
  organizationId?: string, 
  userId?: string
): Repository {
  const now = new Date();
  
  return {
    id: `repo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    organizationId,
    userId,
    name: name.trim(),
    description: description.trim(),
    createdAt: now,
    updatedAt: now,
    team: [],
    theme: 'professional'
  };
}

/**
 * Add a team member to a repository
 * @param repoId - Repository ID
 * @param teamMember - Team member to add
 * @param state - Current application state
 * @returns AppState - Updated application state
 */
export function addTeamMember(
  repoId: string, 
  teamMember: TeamMember, 
  state: AppState
): AppState {
  const repositories = state.repositories.map(repo => {
    if (repo.id === repoId) {
      return {
        ...repo,
        team: [...repo.team, teamMember],
        updatedAt: new Date()
      };
    }
    return repo;
  });
  
  return { ...state, repositories };
}

/**
 * Update team member in repository
 * @param repoId - Repository ID
 * @param memberIndex - Index of team member to update
 * @param updates - Partial team member updates
 * @param state - Current application state
 * @returns AppState - Updated application state
 */
export function updateTeamMember(
  repoId: string,
  memberIndex: number,
  updates: Partial<TeamMember>,
  state: AppState
): AppState {
  const repositories = state.repositories.map(repo => {
    if (repo.id === repoId) {
      const team = [...repo.team];
      team[memberIndex] = { ...team[memberIndex], ...updates };
      
      return {
        ...repo,
        team,
        updatedAt: new Date()
      };
    }
    return repo;
  });
  
  return { ...state, repositories };
}

/**
 * Export repository configuration to JSON
 * @param repoId - Repository ID to export
 * @param state - Current application state
 * @returns string - JSON string of repository data
 */
export function exportRepository(repoId: string, state: AppState): string {
  const repository = state.repositories.find(repo => repo.id === repoId);
  
  if (!repository) {
    throw new Error(`Repository with ID ${repoId} not found`);
  }
  
  const exportData = {
    exportVersion: STORAGE_VERSION,
    exportDate: new Date().toISOString(),
    repository: repository
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import repository configuration from JSON
 * @param jsonData - JSON string containing repository data
 * @param state - Current application state
 * @returns AppState - Updated application state with imported repository
 */
export function importRepository(jsonData: string, state: AppState): AppState {
  try {
    const importData = JSON.parse(jsonData);
    
    if (!importData.repository) {
      throw new Error('Invalid import format: missing repository data');
    }
    
    // Generate new ID to avoid conflicts
    const importedRepo: Repository = {
      ...importData.repository,
      id: `repo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${importData.repository.name} (Imported)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return {
      ...state,
      repositories: [...state.repositories, importedRepo]
    };
  } catch (error) {
    console.error('Import failed:', error);
    throw new Error('Invalid import data format');
  }
}

/**
 * Generate a unique team member ID
 * @returns string - Unique team member ID
 */
export function generateTeamMemberId(): string {
  return `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique organization ID
 * @returns string - Unique organization ID
 */
export function generateOrganizationId(): string {
  return `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique agent ID
 * @returns string - Unique agent ID
 */
export function generateAgentId(): string {
  return `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique user ID
 * @returns string - Unique user ID
 */
export function generateUserId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}