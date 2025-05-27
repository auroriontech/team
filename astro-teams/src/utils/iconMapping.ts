/**
 * Icon Mapping Utility for Astro Icon Integration
 * 
 * Maps semantic icon names to Astro Icon references using the Iconify ecosystem
 * Provides access to 200,000+ icons including Lucide, Heroicons, Tabler, etc.
 * 
 * @author Aurorion Teams Collective (Technical Enablement Agent)
 * @version 2.0.0
 */

// Agent role icons using Lucide set
export const agentIcons = {
  'architect-engineer': 'lucide:wrench',
  'tester-reviewer': 'lucide:check-circle',
  'optimizer-watchdog': 'lucide:zap',
  'scrum-knowledge': 'lucide:book-open',
  'morale-catalyst': 'lucide:heart',
  'technical-enablement': 'lucide:settings',
  'standup-facilitator': 'lucide:users'
} as const;

// Status and priority icons
export const statusIcons = {
  active: 'lucide:play',
  completed: 'lucide:check-circle',
  paused: 'lucide:pause',
  archived: 'lucide:archive',
  planning: 'lucide:clock',
  draft: 'lucide:edit',
  deprecated: 'lucide:alert-triangle'
} as const;

export const priorityIcons = {
  critical: 'lucide:alert-octagon',
  high: 'lucide:arrow-up',
  medium: 'lucide:minus',
  low: 'lucide:arrow-down'
} as const;

// Team and collaboration icons
export const teamIcons = {
  founder: 'lucide:crown',
  agent: 'lucide:bot',
  collaborator: 'lucide:user',
  team: 'lucide:users',
  meeting: 'lucide:video'
} as const;

// Navigation and UI icons
export const uiIcons = {
  home: 'lucide:home',
  back: 'lucide:arrow-left',
  forward: 'lucide:arrow-right',
  external: 'lucide:external-link',
  menu: 'lucide:menu',
  close: 'lucide:x',
  search: 'lucide:search',
  filter: 'lucide:filter',
  download: 'lucide:download',
  upload: 'lucide:upload',
  copy: 'lucide:copy',
  link: 'lucide:link',
  folder: 'lucide:folder',
  plus: 'lucide:plus'
} as const;

// Project and development icons
export const projectIcons = {
  repository: 'lucide:git-branch',
  code: 'lucide:code',
  database: 'lucide:database',
  api: 'lucide:webhook',
  documentation: 'lucide:file-text',
  testing: 'lucide:test-tube',
  deployment: 'lucide:rocket',
  monitoring: 'lucide:activity'
} as const;

// Morale and team health icons
export const moraleIcons = {
  energy: 'lucide:zap',
  happiness: 'lucide:smile',
  goals: 'lucide:target',
  collaboration: 'lucide:users',
  motivation: 'lucide:trending-up',
  warning: 'lucide:alert-triangle',
  success: 'lucide:check-circle',
  celebration: 'lucide:party-popper',
  growth: 'lucide:trending-up',
  focus: 'lucide:eye',
  balance: 'lucide:scale',
  innovation: 'lucide:lightbulb',
  battery: 'lucide:battery',
  refresh: 'lucide:rotate-ccw'
} as const;

// System and tool icons
export const systemIcons = {
  settings: 'lucide:settings',
  tools: 'lucide:wrench',
  analytics: 'lucide:bar-chart-3',
  performance: 'lucide:gauge',
  security: 'lucide:shield',
  backup: 'lucide:hard-drive',
  sync: 'lucide:refresh-cw',
  notification: 'lucide:bell'
} as const;

// Alternative icon sets for variety
export const alternativeIcons = {
  // Heroicons alternatives
  'hero-home': 'heroicons:home',
  'hero-user': 'heroicons:user',
  'hero-settings': 'heroicons:cog-6-tooth',
  
  // Tabler alternatives
  'tabler-dashboard': 'tabler:dashboard',
  'tabler-chart': 'tabler:chart-line',
  'tabler-team': 'tabler:users',
  
  // Material Design alternatives
  'mdi-rocket': 'mdi:rocket',
  'mdi-code': 'mdi:code-tags',
  'mdi-heart': 'mdi:heart'
} as const;

// Export all icon mappings as a unified type
export type IconName = 
  | keyof typeof agentIcons
  | keyof typeof statusIcons
  | keyof typeof priorityIcons
  | keyof typeof teamIcons
  | keyof typeof uiIcons
  | keyof typeof projectIcons
  | keyof typeof moraleIcons
  | keyof typeof systemIcons
  | keyof typeof alternativeIcons;

// Helper functions to get icon names by category
export function getAgentIcon(agent: keyof typeof agentIcons): string {
  return agentIcons[agent];
}

export function getStatusIcon(status: keyof typeof statusIcons): string {
  return statusIcons[status];
}

export function getPriorityIcon(priority: keyof typeof priorityIcons): string {
  return priorityIcons[priority];
}

export function getMoraleIcon(mood: keyof typeof moraleIcons): string {
  return moraleIcons[mood];
}

export function getUIIcon(ui: keyof typeof uiIcons): string {
  return uiIcons[ui];
}

// Icon size presets for consistent sizing
export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64
} as const;

export type IconSize = keyof typeof iconSizes;