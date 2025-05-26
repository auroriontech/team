// Updated to use MDX content collections
import { getCollection } from 'astro:content';
import type { AgentRole } from '../types';

// Legacy compatibility - will be replaced by content collections
import { defaultAgentRoles } from '../data/agentRoles';

export const agentRoles = defaultAgentRoles;
export type { AgentRole };

// New content collection functions
export async function getAgentRolesFromContent() {
  try {
    const roles = await getCollection('agent-roles');
    return roles.map(role => ({
      id: role.id,
      name: role.data.name,
      icon: role.data.icon,
      description: role.data.description,
      ...role.data
    }));
  } catch (error) {
    console.warn('Content collections not available, using legacy data');
    return defaultAgentRoles;
  }
}

export async function getTeamMembersFromContent() {
  try {
    const members = await getCollection('team-members');
    return members.map(member => ({
      id: member.id,
      ...member.data,
      content: member.body
    }));
  } catch (error) {
    console.warn('Content collections not available');
    return [];
  }
}

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