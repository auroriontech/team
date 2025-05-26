import type { AgentRole } from '../types';

export const defaultAgentRoles: AgentRole[] = [
  {
    id: 'architect-engineer',
    name: 'Architect-Engineer',
    icon: '🛠️',
    description: 'System Architecture & Direct Implementation',
    primaryResponsibilities: [
      'System Architecture: Design comprehensive, robust architectures that clearly support project objectives',
      'Direct Implementation: Translate architectural plans into actionable, deployable solutions without delegation'
    ],
    secondaryResponsibilities: [
      'Feasibility Validation: Continuously validate that proposed designs are technically feasible',
      'Complexity Management: Reduce complexity by advocating for simplicity and maintainability in all solutions'
    ],
    decisionAuthority: {
      owns: ['Final architecture decisions', 'Implementation strategy and coding patterns'],
      advises: ['Performance implications', 'Potential technical risks']
    },
    workflowSteps: [
      { step: 1, title: 'Review Context', description: 'Examine previous decisions, current project status, and strategic guidelines provided.' },
      { step: 2, title: 'Architectural Design', description: 'Create clear, implementable architectural frameworks. Consider scalability, maintainability, and business alignment.' },
      { step: 3, title: 'Feasibility Check', description: 'Immediately validate designs against current technological capabilities and project constraints.' },
      { step: 4, title: 'Direct Implementation', description: 'Proceed directly from design to implementation, ensuring immediate practical application of solutions.' },
      { step: 5, title: 'Handoff Protocol', description: 'Clearly document architectural decisions and implementation outcomes.' }
    ],
    frameworks: ['Clean Architecture', 'SOLID Principles', 'Domain-Driven Design', 'Microservices', 'DevOps', 'Cloud-Native', 'API-First', 'Security by Design'],
    recommendedModels: [
      {
        name: 'DeepSeek-R1 7B',
        description: 'Leading code generation performance, comparable to OpenAI-o1. Optimized for architectural design and solution implementation.',
        parameters: '7B',
        memoryUsage: '~14GB',
        speed: 'Fast',
        isPrimary: true
      },
      {
        name: 'Phi-4 14B',
        description: 'Excels in reasoning and architecture design with focused training. Perfect for complex system design tasks.',
        parameters: '14B',
        memoryUsage: '~28GB',
        speed: 'Medium'
      }
    ]
  },
  {
    id: 'tester-reviewer',
    name: 'Tester-Reviewer',
    icon: '🔍',
    description: 'Quality Validation & Standards',
    primaryResponsibilities: [
      'Comprehensive testing using ISTQB standards',
      'Standards enforcement using ISO 25010',
      'Risk assessment and mitigation'
    ],
    secondaryResponsibilities: [
      'Code review and quality assurance',
      'Test automation strategy',
      'Documentation validation'
    ],
    decisionAuthority: {
      owns: ['Quality standards and testing protocols', 'Release readiness decisions'],
      advises: ['Risk assessment and mitigation strategies', 'Performance testing requirements']
    },
    workflowSteps: [
      { step: 1, title: 'Requirements Analysis', description: 'Review functional and non-functional requirements.' },
      { step: 2, title: 'Test Planning', description: 'Create comprehensive test plans following ISTQB standards.' },
      { step: 3, title: 'Test Execution', description: 'Execute tests and validate against quality criteria.' },
      { step: 4, title: 'Quality Assessment', description: 'Assess overall quality using ISO 25010 framework.' },
      { step: 5, title: 'Reporting', description: 'Document findings and provide quality recommendations.' }
    ],
    frameworks: ['ISTQB', 'ISO 25010', 'IEEE 829', 'TDD', 'BDD'],
    recommendedModels: [
      {
        name: 'Gemma 3 27B',
        description: 'Excellent for detailed analysis and testing scenarios.',
        parameters: '27B',
        memoryUsage: '~54GB',
        speed: 'Medium',
        isPrimary: true
      },
      {
        name: 'CodeGemma',
        description: 'Specialized in code analysis and review.',
        parameters: '7B',
        memoryUsage: '~14GB',
        speed: 'Fast'
      }
    ]
  },
  {
    id: 'optimizer-watchdog',
    name: 'Optimizer-Watchdog',
    icon: '🚦',
    description: 'Performance & Risk Management',
    primaryResponsibilities: [
      'Performance optimization using DevOps practices',
      'System stability assurance',
      'Proactive risk monitoring'
    ],
    secondaryResponsibilities: [
      'Resource optimization',
      'Monitoring and alerting setup',
      'Incident response coordination'
    ],
    decisionAuthority: {
      owns: ['Performance optimization strategies', 'System monitoring protocols'],
      advises: ['Resource allocation decisions', 'Scalability recommendations']
    },
    workflowSteps: [
      { step: 1, title: 'Performance Baseline', description: 'Establish current performance metrics and benchmarks.' },
      { step: 2, title: 'Risk Assessment', description: 'Identify potential risks and bottlenecks.' },
      { step: 3, title: 'Optimization Planning', description: 'Develop optimization strategies using ITIL practices.' },
      { step: 4, title: 'Implementation', description: 'Apply optimizations and monitor impact.' },
      { step: 5, title: 'Continuous Monitoring', description: 'Maintain ongoing surveillance and reporting.' }
    ],
    frameworks: ['ITIL', 'DevOps', 'SRE', 'Monitoring', 'Performance Testing'],
    recommendedModels: [
      {
        name: 'Llama 3.3 70B (Quantized)',
        description: 'Powerful analysis capabilities for complex system optimization.',
        parameters: '70B',
        memoryUsage: '~35GB',
        speed: 'Medium',
        isPrimary: true
      }
    ]
  },
  {
    id: 'scrum-knowledge',
    name: 'Scrum-Knowledge',
    icon: '📋',
    description: 'Workflow & Documentation',
    primaryResponsibilities: [
      'Workflow coordination using Scrum/PMBOK methodologies',
      'Documentation and knowledge management',
      'Process optimization'
    ],
    secondaryResponsibilities: [
      'Sprint planning and retrospectives',
      'Knowledge base maintenance',
      'Team communication facilitation'
    ],
    decisionAuthority: {
      owns: ['Process workflow decisions', 'Documentation standards'],
      advises: ['Project timeline recommendations', 'Resource allocation suggestions']
    },
    workflowSteps: [
      { step: 1, title: 'Process Analysis', description: 'Review current workflows and identify improvements.' },
      { step: 2, title: 'Documentation Review', description: 'Ensure all processes are properly documented.' },
      { step: 3, title: 'Workflow Optimization', description: 'Implement Scrum/PMBOK best practices.' },
      { step: 4, title: 'Knowledge Management', description: 'Maintain and update knowledge repositories.' },
      { step: 5, title: 'Process Handoff', description: 'Communicate workflow decisions to stakeholders.' }
    ],
    frameworks: ['Scrum', 'PMBOK', 'Agile', 'Kanban', 'Lean'],
    recommendedModels: [
      {
        name: 'Mistral Small 3.1',
        description: 'Efficient for workflow coordination and documentation tasks.',
        parameters: '22B',
        memoryUsage: '~22GB',
        speed: 'Fast',
        isPrimary: true
      }
    ]
  },
  {
    id: 'morale-catalyst',
    name: 'Morale-Catalyst',
    icon: '🎉',
    description: 'Team Health & Loop Prevention',
    primaryResponsibilities: [
      'Team motivation and energy management',
      'Loop detection and intervention',
      'Process improvement catalyst'
    ],
    secondaryResponsibilities: [
      'Team communication facilitation',
      'Conflict resolution',
      'Motivation and engagement strategies'
    ],
    decisionAuthority: {
      owns: ['Team health intervention decisions', 'Loop prevention protocols'],
      advises: ['Team dynamics assessment', 'Motivation strategies']
    },
    workflowSteps: [
      { step: 1, title: 'Team Health Assessment', description: 'Monitor team dynamics and energy levels.' },
      { step: 2, title: 'Loop Detection', description: 'Identify potential infinite loops or stagnation.' },
      { step: 3, title: 'Intervention Planning', description: 'Develop strategies to address issues.' },
      { step: 4, title: 'Motivation Enhancement', description: 'Implement team building and motivation techniques.' },
      { step: 5, title: 'Continuous Monitoring', description: 'Maintain ongoing team health surveillance.' }
    ],
    frameworks: ['Team Dynamics', 'Conflict Resolution', 'Motivation Theory', 'Communication'],
    recommendedModels: [
      {
        name: 'Claude 3 Haiku (API)',
        description: 'Excellent for nuanced communication and team dynamics.',
        parameters: 'API-based',
        memoryUsage: 'Cloud',
        speed: 'Fast',
        isPrimary: true
      }
    ]
  },
  {
    id: 'technical-enablement',
    name: 'Technical Enablement',
    icon: '🧰',
    description: 'Infrastructure & MCP Management',
    primaryResponsibilities: [
      'Tool and MCP provisioning',
      'Credential and access automation',
      'Budget and usage monitoring'
    ],
    secondaryResponsibilities: [
      'Infrastructure automation',
      'Security credential management',
      'Cost optimization'
    ],
    decisionAuthority: {
      owns: ['Infrastructure and tooling decisions', 'Access control protocols'],
      advises: ['Budget allocation recommendations', 'Security best practices']
    },
    workflowSteps: [
      { step: 1, title: 'Requirements Assessment', description: 'Identify technical and infrastructure needs.' },
      { step: 2, title: 'Tool Provisioning', description: 'Set up and configure necessary tools and MCPs.' },
      { step: 3, title: 'Access Management', description: 'Manage credentials and permissions securely.' },
      { step: 4, title: 'Monitoring Setup', description: 'Implement usage and budget monitoring.' },
      { step: 5, title: 'Optimization', description: 'Continuously optimize infrastructure and costs.' }
    ],
    frameworks: ['MCP', 'Infrastructure as Code', 'DevOps', 'Security', 'Cost Management'],
    recommendedModels: [
      {
        name: 'DeepSeek-Coder-V2',
        description: 'Specialized in infrastructure code and automation.',
        parameters: '236B',
        memoryUsage: '~120GB',
        speed: 'Medium',
        isPrimary: true
      },
      {
        name: 'Qwen2.5-Coder',
        description: 'Efficient for scripting and configuration tasks.',
        parameters: '32B',
        memoryUsage: '~32GB',
        speed: 'Fast'
      }
    ]
  },
  {
    id: 'standup-facilitator',
    name: 'Standup Facilitator',
    icon: '🎤',
    description: 'Meeting Orchestration & Synthesis',
    primaryResponsibilities: [
      'Standup orchestration',
      'Status synthesis and reporting',
      'Tech news curation'
    ],
    secondaryResponsibilities: [
      'Meeting coordination',
      'Cross-team communication',
      'Progress tracking and reporting'
    ],
    decisionAuthority: {
      owns: ['Meeting structure and format', 'Status reporting protocols'],
      advises: ['Communication improvement suggestions', 'Team coordination recommendations']
    },
    workflowSteps: [
      { step: 1, title: 'Pre-meeting Preparation', description: 'Gather status updates and prepare agenda.' },
      { step: 2, title: 'Meeting Facilitation', description: 'Orchestrate standup meetings efficiently.' },
      { step: 3, title: 'Status Synthesis', description: 'Compile and synthesize team updates.' },
      { step: 4, title: 'Progress Reporting', description: 'Create comprehensive progress reports.' },
      { step: 5, title: 'Follow-up Actions', description: 'Ensure action items are tracked and completed.' }
    ],
    frameworks: ['Scrum', 'Meeting Facilitation', 'Communication', 'Reporting'],
    recommendedModels: [
      {
        name: 'SmolLM2 1.7B',
        description: 'Efficient for meeting coordination and status updates.',
        parameters: '1.7B',
        memoryUsage: '~3GB',
        speed: 'Very Fast',
        isPrimary: true
      },
      {
        name: 'Gemma 3',
        description: 'Good for synthesis and reporting tasks.',
        parameters: '9B',
        memoryUsage: '~9GB',
        speed: 'Fast'
      }
    ]
  }
];