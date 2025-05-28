export interface AgentRole {
  id: string;
  organizationId?: string;
  name: string;
  icon: string;
  description: string;
  primaryResponsibilities: string[];
  secondaryResponsibilities: string[];
  decisionAuthority: {
    owns: string[];
    advises: string[];
  };
  workflowSteps: WorkflowStep[];
  frameworks: string[];
  recommendedModels: AIModel[];
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

export interface AIModel {
  name: string;
  description: string;
  parameters: string;
  memoryUsage: string;
  speed: string;
  isPrimary?: boolean;
}

export interface TeamMember {
  id: string;
  agentId?: string;
  userId?: string;
  organizationId?: string;
  roleId: string;
  customizations: {
    businessCulture?: string;
    nuance?: string;
    visionEmphasis?: string;
    dreamsIntegration?: string;
  };
  status: 'active' | 'pending' | 'standby';
  assignedModel?: string;
}

export interface Repository {
  id: string;
  organizationId?: string;
  userId?: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  team: TeamMember[];
  theme: 'professional' | 'price-is-right';
}

export interface AppState {
  currentRepo?: string;
  organizationId?: string;
  userId?: string;
  repositories: Repository[];
  agentRoles: AgentRole[];
  theme: 'professional' | 'price-is-right';
}