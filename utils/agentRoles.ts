// Re-export existing agent roles with utility functions
import { defaultAgentRoles } from '../data/agentRoles';
import type { AgentRole } from '../types';

export const agentRoles = defaultAgentRoles;
export type { AgentRole };

export function getAgentRole(id: string): AgentRole | undefined {
  return agentRoles.find(role => role.id === id);
}

export function getAgentRolesByIds(ids: string[]): AgentRole[] {
  return ids.map(id => getAgentRole(id)).filter(Boolean) as AgentRole[];
}

// Theme mapping for compatibility with team builder
export function getAgentThemeColors(roleId: string, theme: 'professional' | 'price' = 'professional') {
  const themeMap = {
    'architect-engineer': { professional: '#2563eb', price: '#dc2626' },
    'tester-reviewer': { professional: '#059669', price: '#7c3aed' },
    'optimizer-watchdog': { professional: '#dc2626', price: '#059669' },
    'scrum-knowledge': { professional: '#7c3aed', price: '#2563eb' },
    'morale-catalyst': { professional: '#f59e0b', price: '#ec4899' },
    'technical-enablement': { professional: '#6366f1', price: '#f59e0b' },
    'standup-facilitator': { professional: '#0891b2', price: '#dc2626' }
  };
  
  return themeMap[roleId]?.[theme] || '#6c757d';
}