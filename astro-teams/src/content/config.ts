import { defineCollection, z } from 'astro:content';

const teamMemberSchema = z.object({
  name: z.string(),
  agentId: z.string().optional(),
  userId: z.string().optional(),
  organizationId: z.string().optional(),
  role: z.enum([
    'architect-engineer',
    'tester-reviewer', 
    'optimizer-watchdog',
    'scrum-knowledge',
    'morale-catalyst',
    'technical-enablement',
    'standup-facilitator'
  ]),
  avatar: z.string().optional(),
  bio: z.string(),
  status: z.enum(['active', 'inactive', 'on-leave']).default('active'),
  joinDate: z.date(),
  skills: z.array(z.string()),
  specializations: z.array(z.string()),
  
  // Cross-project statistics
  projects: z.record(z.object({
    contribution: z.number().min(0).max(100), // Percentage contribution
    specialization: z.string(),
    startDate: z.date(),
    status: z.enum(['active', 'completed', 'paused']),
    achievements: z.array(z.string()).optional()
  })).optional(),
  
  // Member preferences and configuration
  preferences: z.object({
    workingHours: z.object({
      timezone: z.string().default('UTC'),
      startHour: z.number().min(0).max(23).default(9),
      endHour: z.number().min(0).max(23).default(17),
      workDays: z.array(z.number().min(1).max(7)).default([1,2,3,4,5])
    }),
    communicationStyle: z.enum(['direct', 'collaborative', 'analytical', 'supportive']),
    autonomyLevel: z.number().min(0).max(100).default(70),
    riskTolerance: z.number().min(0).max(100).default(50)
  }),
  
  // Behavior parameters
  behaviors: z.object({
    creativity: z.number().min(0).max(100).default(70),
    precision: z.number().min(0).max(100).default(80),
    collaboration: z.number().min(0).max(100).default(75),
    responseSpeed: z.number().min(1).max(10).default(7)
  }).optional(),
  
  // Authority and permissions
  authority: z.object({
    level: z.enum(['observer', 'contributor', 'specialist', 'leader', 'admin']).default('specialist'),
    permissions: z.array(z.string()),
    escalationPath: z.array(z.string()).optional()
  }).optional(),
  
  // Contact and social
  contact: z.object({
    email: z.string().email().optional(),
    slack: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional()
  }).optional(),
  
  // Performance metrics
  metrics: z.object({
    tasksCompleted: z.number().default(0),
    averageCompletionTime: z.number().optional(), // in hours
    qualityScore: z.number().min(0).max(100).optional(),
    collaborationRating: z.number().min(0).max(5).optional()
  }).optional()
});

const agentRoleSchema = z.object({
  name: z.string(),
  organizationId: z.string().optional(),
  icon: z.string(),
  description: z.string(),
  category: z.enum(['core', 'operational', 'support']),
  
  responsibilities: z.object({
    primary: z.array(z.string()),
    secondary: z.array(z.string())
  }),
  
  decisionAuthority: z.object({
    owns: z.array(z.string()),
    advises: z.array(z.string())
  }),
  
  workflow: z.object({
    steps: z.array(z.object({
      step: z.number(),
      title: z.string(),
      description: z.string()
    })),
    handoffProtocol: z.string(),
    loopPrevention: z.number().default(2) // max iterations
  }),
  
  frameworks: z.array(z.string()),
  tools: z.array(z.string()),
  
  recommendedModels: z.array(z.object({
    name: z.string(),
    description: z.string(),
    parameters: z.string(),
    memoryUsage: z.string(),
    speed: z.enum(['very-fast', 'fast', 'medium', 'slow']),
    isPrimary: z.boolean().default(false)
  })),
  
  themes: z.object({
    professional: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string()
    }),
    priceIsRight: z.object({
      primary: z.string(),
      secondary: z.string(), 
      accent: z.string()
    })
  })
});

const docsSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(['planning', 'architecture', 'implementation', 'guides', 'reference', 'projects', 'platforms', 'tools']),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  lastUpdated: z.date(),
  status: z.enum(['draft', 'active', 'archived', 'deprecated']).default('active'),
  tags: z.array(z.string()).default([]),
  authors: z.array(z.string()).optional(),
  relatedDocs: z.array(z.string()).optional()
});

const projectSchema = z.object({
  name: z.string(),
  organizationId: z.string().optional(),
  userId: z.string().optional(),
  description: z.string(),
  status: z.enum(['active', 'completed', 'paused', 'archived', 'planning']).default('active'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  
  // Repository information
  repository: z.object({
    url: z.string().url(),
    branch: z.string().default('main'),
    provider: z.enum(['github', 'gitlab', 'bitbucket', 'other']).default('github'),
    isPrivate: z.boolean().default(false),
    lastCommit: z.date().optional(),
    stars: z.number().optional(),
    forks: z.number().optional(),
    language: z.string().optional()
  }).optional(),
  
  // Project metadata
  metadata: z.object({
    startDate: z.date(),
    endDate: z.date().optional(),
    budget: z.number().optional(),
    client: z.string().optional(),
    category: z.enum(['web-app', 'mobile-app', 'api', 'library', 'tool', 'documentation', 'other']),
    stack: z.array(z.string()).default([]),
    frameworks: z.array(z.string()).default([]),
    databases: z.array(z.string()).default([])
  }),
  
  // Team assignment
  team: z.object({
    founder: z.string().optional(), // Technical founder (Caleb Coverdale)
    agents: z.array(z.string()).default([]), // AI agent assignments (primary workforce)
    collaborators: z.array(z.string()).default([]), // External human contributors
    consultants: z.array(z.string()).default([]) // External advisors/consultants
  }).optional(),
  
  // Project progress
  progress: z.object({
    completion: z.number().min(0).max(100).default(0),
    milestones: z.array(z.object({
      name: z.string(),
      description: z.string(),
      dueDate: z.date(),
      status: z.enum(['pending', 'in-progress', 'completed', 'blocked']).default('pending'),
      assignee: z.string().optional()
    })).default([]),
    currentPhase: z.string().optional()
  }).optional(),
  
  // Documentation and resources
  resources: z.object({
    documentation: z.array(z.string()).default([]), // References to docs
    externalLinks: z.array(z.object({
      title: z.string(),
      url: z.string().url(),
      type: z.enum(['design', 'specification', 'reference', 'tool', 'other']).default('other')
    })).default([]),
    screenshots: z.array(z.string()).default([]),
    videos: z.array(z.string()).default([])
  }).optional(),
  
  // Environment and deployment
  environments: z.array(z.object({
    name: z.string(),
    url: z.string().url().optional(),
    status: z.enum(['healthy', 'warning', 'error', 'offline']).default('healthy'),
    lastDeployment: z.date().optional(),
    version: z.string().optional()
  })).default([]),
  
  // Contact and support
  contact: z.object({
    email: z.string().email().optional(),
    slack: z.string().optional(),
    discord: z.string().optional(),
    website: z.string().url().optional()
  }).optional(),
  
  // Tags and categorization
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  archived: z.boolean().default(false)
});

export const collections = {
  'team-members': defineCollection({
    type: 'content',
    schema: teamMemberSchema
  }),
  'team-roles': defineCollection({
    type: 'content', 
    schema: agentRoleSchema
  }),
  'founders': defineCollection({
    type: 'content',
    schema: z.object({
      name: z.string(),
      title: z.string(),
      bio: z.string(),
      email: z.string().email().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional()
    })
  }),
  'docs': defineCollection({
    type: 'content',
    schema: docsSchema
  }),
  'projects': defineCollection({
    type: 'content',
    schema: projectSchema
  })
};