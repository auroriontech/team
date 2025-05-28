// Script to seed the Astro DB with initial data
import { db, UserProfiles, TeamMembers, Projects } from 'astro:db';

async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Seed Team Members (AI Agents)
    console.log('Seeding team members...');
    await db.insert(TeamMembers).values([
      {
        id: 'architect-engineer-001',
        name: 'Alex Chen',
        role: 'architect-engineer',
        avatar: '/avatars/alex-chen.svg',
        bio: 'System architecture and implementation specialist with expertise in TypeScript, cloud platforms, and scalable design patterns.',
        email: 'alex.chen@aurorion.teams',
        skills: JSON.stringify(['TypeScript', 'System Architecture', 'Cloud Platforms', 'Database Design', 'API Development']),
        specializations: JSON.stringify(['Microservices', 'Event-Driven Architecture', 'Performance Optimization']),
        joinDate: '2024-01-15',
        autonomyLevel: 85,
        creativity: 80,
        precision: 90,
        authorityLevel: 'lead',
      },
      {
        id: 'tester-reviewer-001',
        name: 'Maya Patel',
        role: 'tester-reviewer',
        avatar: '/avatars/maya-patel.svg',
        bio: 'Quality assurance specialist following ISTQB and ISO 25010 standards for comprehensive testing and validation.',
        email: 'maya.patel@aurorion.teams',
        skills: JSON.stringify(['Test Automation', 'Quality Assurance', 'ISTQB Standards', 'Performance Testing', 'Security Testing']),
        specializations: JSON.stringify(['End-to-End Testing', 'Load Testing', 'Accessibility Testing']),
        joinDate: '2024-01-20',
        autonomyLevel: 75,
        precision: 95,
        collaboration: 85,
        authorityLevel: 'senior',
      },
      {
        id: 'optimizer-watchdog-001',
        name: 'Jordan Taylor',
        role: 'optimizer-watchdog',
        avatar: '/avatars/jordan-taylor.svg',
        bio: 'Performance optimization and risk management expert using ITIL and DevOps best practices.',
        email: 'jordan.taylor@aurorion.teams',
        skills: JSON.stringify(['Performance Monitoring', 'DevOps', 'Risk Assessment', 'Incident Response', 'Cost Optimization']),
        specializations: JSON.stringify(['Application Performance Monitoring', 'Infrastructure Optimization', 'Security Monitoring']),
        joinDate: '2024-01-25',
        autonomyLevel: 80,
        riskTolerance: 30,
        precision: 85,
        authorityLevel: 'senior',
      },
      {
        id: 'scrum-knowledge-001',
        name: 'Sam Rivera',
        role: 'scrum-knowledge',
        avatar: '/avatars/sam-rivera.svg',
        bio: 'Agile workflow coordinator and knowledge management specialist using PMBOK and Scrum methodologies.',
        email: 'sam.rivera@aurorion.teams',
        skills: JSON.stringify(['Agile Methodologies', 'Project Management', 'Documentation', 'Knowledge Management', 'Sprint Planning']),
        specializations: JSON.stringify(['Scrum Master', 'Workflow Optimization', 'Team Coordination']),
        joinDate: '2024-02-01',
        autonomyLevel: 70,
        collaboration: 95,
        precision: 80,
        authorityLevel: 'member',
      },
      {
        id: 'morale-catalyst-001',
        name: 'Casey Morgan',
        role: 'morale-catalyst',
        avatar: '/avatars/casey-morgan.svg',
        bio: 'Team health monitor and intervention specialist with authority to break loops and escalate issues.',
        email: 'casey.morgan@aurorion.teams',
        skills: JSON.stringify(['Team Dynamics', 'Conflict Resolution', 'Psychology', 'Communication', 'Leadership']),
        specializations: JSON.stringify(['Loop Detection', 'Team Health Assessment', 'Crisis Intervention']),
        joinDate: '2024-02-05',
        autonomyLevel: 90,
        collaboration: 90,
        creativity: 85,
        authorityLevel: 'lead',
      },
      {
        id: 'technical-enablement-001',
        name: 'Riley Kim',
        role: 'technical-enablement',
        avatar: '/avatars/riley-kim.svg',
        bio: 'Tool provisioning and MCP integration specialist ensuring team has necessary technical resources.',
        email: 'riley.kim@aurorion.teams',
        skills: JSON.stringify(['Tool Integration', 'MCP Systems', 'API Management', 'DevOps', 'Cloud Infrastructure']),
        specializations: JSON.stringify(['Multi-Component Platforms', 'Credential Management', 'System Integration']),
        joinDate: '2024-02-10',
        autonomyLevel: 75,
        precision: 90,
        responseSpeed: 8,
        authorityLevel: 'senior',
      },
      {
        id: 'standup-facilitator-001',
        name: 'Avery Brooks',
        role: 'standup-facilitator',
        avatar: '/avatars/avery-brooks.svg',
        bio: 'Cross-agent synthesis and meeting orchestration specialist for team coordination and status reporting.',
        email: 'avery.brooks@aurorion.teams',
        skills: JSON.stringify(['Meeting Facilitation', 'Status Reporting', 'Cross-Team Communication', 'Synthesis', 'Coordination']),
        specializations: JSON.stringify(['Standup Meetings', 'Status Synthesis', 'Team Coordination']),
        joinDate: '2024-02-15',
        autonomyLevel: 70,
        collaboration: 95,
        responseSpeed: 9,
        authorityLevel: 'member',
      },
    ]);

    // Seed Projects
    console.log('Seeding projects...');
    await db.insert(Projects).values([
      {
        id: 'aurorion-teams-001',
        name: 'Aurorion Teams',
        slug: 'aurorion-teams',
        description: 'Multi-agent AI team coordination platform with specialized roles and workflow management.',
        status: 'active',
        priority: 'high',
        startDate: '2024-01-01',
        progress: 75,
        tasksTotal: 150,
        tasksCompleted: 112,
        tags: JSON.stringify(['ai-agents', 'workflow', 'team-coordination', 'typescript', 'astro']),
        category: 'platform',
        repository: 'https://github.com/aurorion/team',
      },
      {
        id: 'aurorion-landing-001',
        name: 'Aurorion Landing',
        slug: 'aurorion-landing',
        description: 'Marketing website and landing pages for Aurorion AI platform showcase.',
        status: 'active',
        priority: 'medium',
        startDate: '2024-01-15',
        progress: 60,
        tasksTotal: 80,
        tasksCompleted: 48,
        tags: JSON.stringify(['marketing', 'landing-page', 'astro', 'seo']),
        category: 'marketing',
        repository: 'https://github.com/aurorion/landing',
      },
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();