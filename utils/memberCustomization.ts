export interface BehaviorParameter {
  id: string;
  label: string;
  description: string;
  min: number;
  max: number;
  default: number;
  step: number;
  unit?: string;
}

export interface ToolPreference {
  id: string;
  name: string;
  category: 'development' | 'communication' | 'analysis' | 'automation';
  description: string;
  isDefault: boolean;
}

export interface AuthorityLevel {
  id: string;
  level: string;
  description: string;
  permissions: string[];
}

export const behaviorParameters: BehaviorParameter[] = [
  {
    id: 'creativity',
    label: 'Creativity Level',
    description: 'How creative and innovative the agent should be in problem-solving',
    min: 0,
    max: 100,
    default: 70,
    step: 5,
    unit: '%'
  },
  {
    id: 'precision',
    label: 'Precision Focus',
    description: 'How detail-oriented and precise the agent should be',
    min: 0,
    max: 100,
    default: 80,
    step: 5,
    unit: '%'
  },
  {
    id: 'autonomy',
    label: 'Autonomy Level',
    description: 'How independently the agent should operate',
    min: 0,
    max: 100,
    default: 60,
    step: 10,
    unit: '%'
  },
  {
    id: 'collaboration',
    label: 'Collaboration Style',
    description: 'How actively the agent engages with other team members',
    min: 0,
    max: 100,
    default: 75,
    step: 5,
    unit: '%'
  },
  {
    id: 'risktolerance',
    label: 'Risk Tolerance',
    description: 'How willing the agent is to take calculated risks',
    min: 0,
    max: 100,
    default: 40,
    step: 10,
    unit: '%'
  },
  {
    id: 'responseSpeed',
    label: 'Response Speed',
    description: 'How quickly the agent should respond to requests',
    min: 1,
    max: 10,
    default: 7,
    step: 1,
    unit: '/10'
  }
];

export const toolPreferences: ToolPreference[] = [
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    category: 'development',
    description: 'Primary code editor for development tasks',
    isDefault: true
  },
  {
    id: 'git',
    name: 'Git',
    category: 'development',
    description: 'Version control system',
    isDefault: true
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'development',
    description: 'Containerization platform',
    isDefault: false
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    description: 'Team communication platform',
    isDefault: true
  },
  {
    id: 'jira',
    name: 'Jira',
    category: 'automation',
    description: 'Project management and issue tracking',
    isDefault: false
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    category: 'analysis',
    description: 'Performance metrics and analysis tools',
    isDefault: false
  }
];

export const authorityLevels: AuthorityLevel[] = [
  {
    id: 'observer',
    level: 'Observer',
    description: 'Can view and report but not make decisions',
    permissions: ['view', 'report']
  },
  {
    id: 'contributor',
    level: 'Contributor',
    description: 'Can participate in discussions and provide input',
    permissions: ['view', 'report', 'suggest', 'collaborate']
  },
  {
    id: 'specialist',
    level: 'Specialist',
    description: 'Has decision authority within their area of expertise',
    permissions: ['view', 'report', 'suggest', 'collaborate', 'decide-specialist']
  },
  {
    id: 'leader',
    level: 'Team Leader',
    description: 'Can make decisions affecting the entire team',
    permissions: ['view', 'report', 'suggest', 'collaborate', 'decide-specialist', 'decide-team']
  },
  {
    id: 'admin',
    level: 'Administrator',
    description: 'Full authority including system and security decisions',
    permissions: ['view', 'report', 'suggest', 'collaborate', 'decide-specialist', 'decide-team', 'admin']
  }
];

export const defaultMemberConfiguration = {
  customName: '',
  customDescription: '',
  behaviors: behaviorParameters.reduce((acc, param) => {
    acc[param.id] = param.default;
    return acc;
  }, {} as Record<string, number>),
  tools: toolPreferences.filter(tool => tool.isDefault).map(tool => tool.id),
  authorityLevel: 'specialist',
  escalationPath: ['team-lead', 'admin'],
  workingHours: {
    timezone: 'UTC',
    startHour: 9,
    endHour: 17,
    workDays: [1, 2, 3, 4, 5] // Monday to Friday
  },
  notifications: {
    email: true,
    slack: true,
    urgent: true
  }
};

export function validateMemberConfiguration(config: any): boolean {
  // Basic validation
  if (!config) return false;
  
  // Validate behavior parameters
  if (!config.behaviors) return false;
  for (const param of behaviorParameters) {
    const value = config.behaviors[param.id];
    if (typeof value !== 'number' || value < param.min || value > param.max) {
      return false;
    }
  }
  
  // Validate authority level
  if (!authorityLevels.find(level => level.id === config.authorityLevel)) {
    return false;
  }
  
  // Validate tools
  if (!Array.isArray(config.tools)) return false;
  
  return true;
}

export function createMemberConfiguration(roleId: string, roleName: string) {
  return {
    ...defaultMemberConfiguration,
    roleId,
    roleName,
    id: `${roleId}-${Date.now()}`,
    customName: roleName,
    customDescription: `Customized ${roleName} agent`
  };
}