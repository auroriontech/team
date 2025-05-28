import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Founders Table - Human leadership team
export const founders = sqliteTable('founders', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  status: text('status').notNull().default('active'),
  joinDate: text('join_date').notNull(),
  email: text('email').notNull().unique(),
  linkedin: text('linkedin'),
  slack: text('slack'),
  
  // Leadership characteristics
  founderType: text('founder_type').notNull(), // 'ceo', 'cto', 'cmo', 'cfo', etc.
  expertise: text('expertise'), // JSON array
  responsibilities: text('responsibilities'), // JSON array
  
  // Contact and social
  phone: text('phone'),
  website: text('website'),
  twitter: text('twitter'),
  github: text('github'),
  
  // Preferences
  timezone: text('timezone').default('America/New_York'),
  communicationStyle: text('communication_style').default('executive'),
  decisionAuthority: text('decision_authority'), // JSON array of domains
  
  // Leadership metrics
  companiesLed: integer('companies_led').default(0),
  yearsExperience: integer('years_experience').default(0),
  teamSize: integer('team_size').default(0),
  
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Team Members Table (AI agents - previously called agents)
export const teamMembers = sqliteTable('team_members', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(), // AI agent role: architect-engineer, optimizer-watchdog, etc.
  avatar: text('avatar'),
  bio: text('bio'),
  status: text('status').notNull().default('active'),
  joinDate: text('join_date').notNull(),
  email: text('email').notNull().unique(),
  linkedin: text('linkedin'),
  slack: text('slack'),
  
  // Skills and specializations as JSON
  skills: text('skills'), // JSON array
  specializations: text('specializations'), // JSON array
  
  // Preferences
  timezone: text('timezone').default('America/New_York'),
  startHour: integer('start_hour').default(9),
  endHour: integer('end_hour').default(17),
  workDays: text('work_days').default('[1,2,3,4,5]'), // JSON array
  communicationStyle: text('communication_style').default('collaborative'),
  autonomyLevel: integer('autonomy_level').default(75),
  riskTolerance: integer('risk_tolerance').default(50),
  
  // Behaviors
  creativity: integer('creativity').default(75),
  precision: integer('precision').default(75),
  collaboration: integer('collaboration').default(75),
  responseSpeed: integer('response_speed').default(5),
  
  // Authority
  authorityLevel: text('authority_level').default('member'),
  permissions: text('permissions'), // JSON array
  escalationPath: text('escalation_path'), // JSON array
  
  // Metrics
  tasksCompleted: integer('tasks_completed').default(0),
  averageCompletionTime: real('average_completion_time').default(0),
  qualityScore: integer('quality_score').default(75),
  collaborationRating: real('collaboration_rating').default(4.0),
  
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Projects Table
export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  status: text('status').notNull().default('active'),
  priority: text('priority').notNull().default('medium'),
  
  // Dates
  startDate: text('start_date'),
  endDate: text('end_date'),
  lastActivity: text('last_activity'),
  
  // Progress tracking
  progress: integer('progress').default(0), // 0-100
  tasksTotal: integer('tasks_total').default(0),
  tasksCompleted: integer('tasks_completed').default(0),
  
  // Metadata
  tags: text('tags'), // JSON array
  category: text('category'),
  repository: text('repository'),
  
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Project Members (Many-to-Many relationship)
export const projectMembers = sqliteTable('project_members', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  memberId: text('member_id').notNull().references(() => teamMembers.id, { onDelete: 'cascade' }),
  contribution: integer('contribution').default(0), // 0-100
  specialization: text('specialization'),
  startDate: text('start_date'),
  status: text('status').default('active'),
  achievements: text('achievements'), // JSON array
  
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Activity Logs Table - for tracking all team activities
export const activityLogs = sqliteTable('activity_logs', {
  id: text('id').primaryKey(),
  type: text('type').notNull(), // 'task_completion', 'project_update', 'team_interaction', etc.
  memberId: text('member_id').references(() => teamMembers.id),
  projectId: text('project_id').references(() => projects.id),
  
  // Activity details
  action: text('action').notNull(),
  description: text('description'),
  metadata: text('metadata'), // JSON for additional data
  
  // Metrics
  duration: integer('duration'), // in minutes
  qualityScore: integer('quality_score'),
  impact: text('impact').default('medium'), // low, medium, high
  
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});

// Metrics Table - for dashboard analytics
export const metrics = sqliteTable('metrics', {
  id: text('id').primaryKey(),
  type: text('type').notNull(), // 'daily', 'weekly', 'monthly', 'sprint'
  memberId: text('member_id').references(() => teamMembers.id),
  projectId: text('project_id').references(() => projects.id),
  
  // Metric values
  tasksCompleted: integer('tasks_completed').default(0),
  hoursWorked: real('hours_worked').default(0),
  qualityAverage: real('quality_average').default(0),
  collaborationEvents: integer('collaboration_events').default(0),
  
  // Performance indicators
  velocity: real('velocity').default(0), // tasks per day/week
  efficiency: real('efficiency').default(0), // quality/time ratio
  satisfaction: integer('satisfaction').default(75), // 0-100
  
  // Date range
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Team Sessions Table - for MCP team member (AI agent) tracking  
export const teamSessions = sqliteTable('team_sessions', {
  id: text('id').primaryKey(),
  teamRole: text('team_role').notNull(), // architect-engineer, tester-reviewer, etc.
  memberId: text('member_id').references(() => teamMembers.id),
  projectId: text('project_id').references(() => projects.id),
  
  // Session details
  status: text('status').notNull(), // 'active', 'completed', 'failed', 'handoff'
  startTime: text('start_time').default(sql`CURRENT_TIMESTAMP`),
  endTime: text('end_time'),
  duration: integer('duration'), // in seconds
  
  // Workflow context
  task: text('task'),
  input: text('input'),
  output: text('output'),
  handoffTo: text('handoff_to'), // next team member in workflow
  handoffReason: text('handoff_reason'),
  loopCount: integer('loop_count').default(0),
  escalationLevel: integer('escalation_level').default(0),
  
  // Performance metrics
  tokensUsed: integer('tokens_used').default(0),
  modelUsed: text('model_used'),
  errorCount: integer('error_count').default(0),
  successRate: real('success_rate').default(100),
  responseTime: integer('response_time'), // milliseconds
  
  // Decision tracking
  decisionsMade: text('decisions_made'), // JSON array
  authoritiesExercised: text('authorities_exercised'), // JSON array
  frameworksApplied: text('frameworks_applied'), // JSON array
  
  metadata: text('metadata'), // JSON for additional data
  
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Team Decisions Table - for workflow decision tracking
export const teamDecisions = sqliteTable('team_decisions', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => teamSessions.id),
  teamRole: text('team_role').notNull(),
  
  // Decision details
  decisionType: text('decision_type').notNull(), // 'architecture', 'optimization', 'testing', etc.
  decision: text('decision').notNull(),
  rationale: text('rationale'),
  status: text('status').notNull(), // 'approved', 'rejected', 'pending'
  
  // Authority and framework
  authorityLevel: text('authority_level'), // 'owns', 'advises'
  frameworkUsed: text('framework_used'),
  impactLevel: text('impact_level').default('medium'), // 'low', 'medium', 'high'
  
  // Workflow
  nextTeamMember: text('next_team_member'),
  handoffComplete: integer('handoff_complete').default(0), // boolean
  
  // Audit trail
  reviewedBy: text('reviewed_by'),
  reviewedAt: text('reviewed_at'),
  
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Enterprise Value Metrics Table - for ROI and business impact tracking
export const enterpriseMetrics = sqliteTable('enterprise_metrics', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id),
  teamRole: text('team_role'),
  
  // Value measurement
  metricType: text('metric_type').notNull(), // 'roi', 'performance', 'quality', 'efficiency'
  metricCategory: text('metric_category').notNull(), // 'financial', 'operational', 'strategic'
  
  // Quantified values
  baselineValue: real('baseline_value'),
  currentValue: real('current_value'),
  targetValue: real('target_value'),
  improvementPercent: real('improvement_percent'),
  
  // Business context
  stakeholderImpact: text('stakeholder_impact'), // JSON
  businessJustification: text('business_justification'),
  riskMitigation: text('risk_mitigation'),
  
  // Timeline
  measurementPeriod: text('measurement_period'), // 'daily', 'weekly', 'monthly', 'quarterly'
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// System Performance Metrics Table - for technical optimization tracking
export const performanceMetrics = sqliteTable('performance_metrics', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').references(() => teamSessions.id),
  
  // Performance indicators
  responseTime: integer('response_time'), // milliseconds
  throughput: real('throughput'), // requests per second
  uptime: real('uptime'), // percentage
  errorRate: real('error_rate'), // percentage
  
  // Resource utilization
  cpuUsage: real('cpu_usage'), // percentage
  memoryUsage: real('memory_usage'), // percentage
  diskUsage: real('disk_usage'), // percentage
  networkLatency: integer('network_latency'), // milliseconds
  
  // Optimization metrics
  cacheHitRate: real('cache_hit_rate'), // percentage
  queryPerformance: real('query_performance'), // average ms
  bundleSize: integer('bundle_size'), // bytes
  loadTime: integer('load_time'), // milliseconds
  
  // Comparison data
  previousPeriodValue: real('previous_period_value'),
  benchmarkValue: real('benchmark_value'),
  improvementTarget: real('improvement_target'),
  
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});

// Audit Logs Table - for comprehensive activity tracking
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  
  // Context
  entityType: text('entity_type').notNull(), // 'team_member', 'project', 'founder', 'system'
  entityId: text('entity_id').notNull(),
  teamRole: text('team_role'),
  founderId: text('founder_id').references(() => founders.id),
  memberId: text('member_id').references(() => teamMembers.id),
  projectId: text('project_id').references(() => projects.id),
  
  // Event details
  eventType: text('event_type').notNull(), // 'create', 'update', 'delete', 'decision', 'handoff', 'founder_action'
  action: text('action').notNull(),
  description: text('description'),
  
  // Data changes
  previousState: text('previous_state'), // JSON
  newState: text('new_state'), // JSON
  changesDelta: text('changes_delta'), // JSON
  
  // Security and compliance
  securityLevel: text('security_level').default('standard'), // 'low', 'standard', 'high', 'critical'
  complianceFlags: text('compliance_flags'), // JSON array
  accessMethod: text('access_method'), // 'web', 'api', 'mcp', 'system'
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});