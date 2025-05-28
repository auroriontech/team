// Database Validation Rules and Constraints
// ISTQB Quality Validation by Tester-Reviewer Agent

import { z } from 'zod';

// Team Member Validation Schema
export const teamMemberValidation = z.object({
  id: z.string().uuid('Invalid team member ID format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  role: z.enum(['architect-engineer', 'tester-reviewer', 'optimizer-watchdog', 'scrum-knowledge', 'morale-catalyst', 'technical-enablement', 'standup-facilitator']),
  avatar: z.string().url('Invalid avatar URL').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  joinDate: z.string().datetime('Invalid join date format'),
  email: z.string().email('Invalid email format'),
  linkedin: z.string().url('Invalid LinkedIn URL').optional(),
  slack: z.string().regex(/^@[a-zA-Z0-9._-]+$/, 'Invalid Slack handle format').optional(),
  
  // Skills validation
  skills: z.array(z.string().min(1).max(50)).max(20, 'Too many skills listed').optional(),
  specializations: z.array(z.string().min(1).max(100)).max(10, 'Too many specializations').optional(),
  
  // Preferences validation
  timezone: z.string().regex(/^[A-Za-z]+\/[A-Za-z_]+$/, 'Invalid timezone format').default('America/New_York'),
  startHour: z.number().int().min(0).max(23).default(9),
  endHour: z.number().int().min(0).max(23).default(17),
  workDays: z.array(z.number().int().min(0).max(6)).min(1).max(7).default([1,2,3,4,5]),
  communicationStyle: z.enum(['direct', 'collaborative', 'supportive', 'analytical', 'executive-focused']).default('collaborative'),
  autonomyLevel: z.number().int().min(0).max(100).default(75),
  riskTolerance: z.number().int().min(0).max(100).default(50),
  
  // Behaviors validation
  creativity: z.number().int().min(0).max(100).default(75),
  precision: z.number().int().min(0).max(100).default(75),
  collaboration: z.number().int().min(0).max(100).default(75),
  responseSpeed: z.number().int().min(1).max(10).default(5),
  
  // Authority validation
  authorityLevel: z.enum(['member', 'senior', 'lead', 'executive']).default('member'),
  permissions: z.array(z.string().min(1).max(50)).optional(),
  escalationPath: z.array(z.string().min(1).max(50)).optional(),
  
  // Metrics validation
  tasksCompleted: z.number().int().min(0).default(0),
  averageCompletionTime: z.number().min(0).default(0),
  qualityScore: z.number().int().min(0).max(100).default(75),
  collaborationRating: z.number().min(0).max(5).default(4.0),
});

// Project Validation Schema
export const projectValidation = z.object({
  id: z.string().uuid('Invalid project ID format'),
  name: z.string().min(3, 'Project name too short').max(100, 'Project name too long'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  description: z.string().min(10, 'Description too short').max(1000, 'Description too long'),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']).default('active'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  
  // Date validation
  startDate: z.string().datetime('Invalid start date').optional(),
  endDate: z.string().datetime('Invalid end date').optional(),
  lastActivity: z.string().datetime('Invalid last activity date').optional(),
  
  // Progress validation
  progress: z.number().int().min(0).max(100).default(0),
  tasksTotal: z.number().int().min(0).default(0),
  tasksCompleted: z.number().int().min(0).default(0),
  
  // Metadata validation
  tags: z.array(z.string().min(1).max(30)).max(15, 'Too many tags').optional(),
  category: z.string().max(50, 'Category too long').optional(),
  repository: z.string().url('Invalid repository URL').optional(),
}).refine(data => {
  // Custom validation: end date after start date
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"]
}).refine(data => {
  // Custom validation: completed tasks <= total tasks
  return data.tasksCompleted <= data.tasksTotal;
}, {
  message: "Completed tasks cannot exceed total tasks",
  path: ["tasksCompleted"]
});

// Agent Session Validation Schema
export const agentSessionValidation = z.object({
  id: z.string().uuid('Invalid session ID format'),
  agentRole: z.enum(['architect-engineer', 'tester-reviewer', 'optimizer-watchdog', 'scrum-knowledge', 'morale-catalyst', 'technical-enablement', 'standup-facilitator']),
  memberId: z.string().uuid('Invalid member ID format').optional(),
  projectId: z.string().uuid('Invalid project ID format').optional(),
  
  // Session validation
  status: z.enum(['active', 'completed', 'failed', 'handoff']),
  startTime: z.string().datetime('Invalid start time'),
  endTime: z.string().datetime('Invalid end time').optional(),
  duration: z.number().int().min(0).optional(),
  
  // Workflow validation
  task: z.string().min(5, 'Task description too short').max(500, 'Task description too long').optional(),
  input: z.string().max(10000, 'Input too long').optional(),
  output: z.string().max(10000, 'Output too long').optional(),
  handoffTo: z.enum(['architect-engineer', 'tester-reviewer', 'optimizer-watchdog', 'scrum-knowledge', 'morale-catalyst', 'technical-enablement', 'standup-facilitator']).optional(),
  handoffReason: z.string().max(500, 'Handoff reason too long').optional(),
  loopCount: z.number().int().min(0).max(2, 'Too many loops detected').default(0),
  escalationLevel: z.number().int().min(0).max(3, 'Escalation level too high').default(0),
  
  // Performance validation
  tokensUsed: z.number().int().min(0).default(0),
  modelUsed: z.string().max(100, 'Model name too long').optional(),
  errorCount: z.number().int().min(0).default(0),
  successRate: z.number().min(0).max(100).default(100),
  responseTime: z.number().int().min(0).optional(),
  
  // Decision tracking validation
  decisionsMade: z.array(z.string().max(200)).max(20, 'Too many decisions').optional(),
  authoritiesExercised: z.array(z.string().max(100)).max(10, 'Too many authorities').optional(),
  frameworksApplied: z.array(z.string().max(100)).max(15, 'Too many frameworks').optional(),
}).refine(data => {
  // Custom validation: end time after start time
  if (data.startTime && data.endTime) {
    return new Date(data.endTime) >= new Date(data.startTime);
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

// Enterprise Metrics Validation Schema
export const enterpriseMetricsValidation = z.object({
  id: z.string().uuid('Invalid metric ID format'),
  projectId: z.string().uuid('Invalid project ID format').optional(),
  agentRole: z.enum(['architect-engineer', 'tester-reviewer', 'optimizer-watchdog', 'scrum-knowledge', 'morale-catalyst', 'technical-enablement', 'standup-facilitator']).optional(),
  
  // Metric validation
  metricType: z.enum(['roi', 'performance', 'quality', 'efficiency', 'satisfaction']),
  metricCategory: z.enum(['financial', 'operational', 'strategic', 'technical']),
  
  // Value validation
  baselineValue: z.number().optional(),
  currentValue: z.number().optional(),
  targetValue: z.number().optional(),
  improvementPercent: z.number().min(-100).max(1000).optional(),
  
  // Business context validation
  stakeholderImpact: z.string().max(1000, 'Stakeholder impact too long').optional(),
  businessJustification: z.string().max(1000, 'Business justification too long').optional(),
  riskMitigation: z.string().max(1000, 'Risk mitigation too long').optional(),
  
  // Timeline validation
  measurementPeriod: z.enum(['daily', 'weekly', 'monthly', 'quarterly']),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date').optional(),
}).refine(data => {
  // Custom validation: improvement percentage calculation
  if (data.baselineValue && data.currentValue && data.improvementPercent !== undefined) {
    const calculatedImprovement = ((data.currentValue - data.baselineValue) / data.baselineValue) * 100;
    return Math.abs(calculatedImprovement - data.improvementPercent) < 0.01; // Allow for rounding
  }
  return true;
}, {
  message: "Improvement percentage doesn't match calculated value",
  path: ["improvementPercent"]
});

// Audit Log Validation Schema
export const auditLogValidation = z.object({
  id: z.string().uuid('Invalid audit log ID format'),
  entityType: z.enum(['agent', 'project', 'member', 'system']),
  entityId: z.string().min(1, 'Entity ID required'),
  agentRole: z.enum(['architect-engineer', 'tester-reviewer', 'optimizer-watchdog', 'scrum-knowledge', 'morale-catalyst', 'technical-enablement', 'standup-facilitator']).optional(),
  memberId: z.string().uuid('Invalid member ID format').optional(),
  projectId: z.string().uuid('Invalid project ID format').optional(),
  
  // Event validation
  eventType: z.enum(['create', 'update', 'delete', 'decision', 'handoff', 'error']),
  action: z.string().min(3, 'Action too short').max(100, 'Action too long'),
  description: z.string().max(500, 'Description too long').optional(),
  
  // Security validation
  securityLevel: z.enum(['low', 'standard', 'high', 'critical']).default('standard'),
  complianceFlags: z.array(z.string().max(50)).max(10, 'Too many compliance flags').optional(),
  accessMethod: z.enum(['web', 'api', 'mcp', 'system']).optional(),
  ipAddress: z.string().ip('Invalid IP address').optional(),
  userAgent: z.string().max(500, 'User agent too long').optional(),
});

// Validation helper functions
export function validateTeamMember(data: unknown) {
  return teamMemberValidation.parse(data);
}

export function validateProject(data: unknown) {
  return projectValidation.parse(data);
}

export function validateAgentSession(data: unknown) {
  return agentSessionValidation.parse(data);
}

export function validateEnterpriseMetrics(data: unknown) {
  return enterpriseMetricsValidation.parse(data);
}

export function validateAuditLog(data: unknown) {
  return auditLogValidation.parse(data);
}

// Batch validation for arrays
export function validateTeamMembers(data: unknown[]) {
  return data.map(validateTeamMember);
}

export function validateProjects(data: unknown[]) {
  return data.map(validateProject);
}