import { getDb, type Database, type NewTeamMember, type NewProject, type NewActivityLog, type NewMetric } from '../db';
import { teamMembers, projects, projectMembers, activityLogs, metrics, agentSessions } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';

export class DatabaseService {
  constructor(private db: Database) {}

  // Team Members
  async createTeamMember(member: NewTeamMember) {
    return await this.db.insert(teamMembers).values(member).returning();
  }

  async getTeamMembers() {
    return await this.db.select().from(teamMembers).orderBy(teamMembers.name);
  }

  async getTeamMember(id: string) {
    return await this.db.select().from(teamMembers).where(eq(teamMembers.id, id)).get();
  }

  async updateTeamMember(id: string, updates: Partial<NewTeamMember>) {
    return await this.db
      .update(teamMembers)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(teamMembers.id, id))
      .returning();
  }

  // Projects
  async createProject(project: NewProject) {
    return await this.db.insert(projects).values(project).returning();
  }

  async getProjects() {
    return await this.db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: string) {
    return await this.db.select().from(projects).where(eq(projects.id, id)).get();
  }

  async updateProject(id: string, updates: Partial<NewProject>) {
    return await this.db
      .update(projects)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(projects.id, id))
      .returning();
  }

  // Activity Logging
  async logActivity(activity: NewActivityLog) {
    return await this.db.insert(activityLogs).values(activity).returning();
  }

  async getRecentActivity(limit = 20) {
    return await this.db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.timestamp))
      .limit(limit);
  }

  async getMemberActivity(memberId: string, limit = 10) {
    return await this.db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.memberId, memberId))
      .orderBy(desc(activityLogs.timestamp))
      .limit(limit);
  }

  // Metrics
  async recordMetric(metric: NewMetric) {
    return await this.db.insert(metrics).values(metric).returning();
  }

  async getMetrics(type: string, memberId?: string, projectId?: string) {
    let query = this.db.select().from(metrics).where(eq(metrics.type, type));
    
    if (memberId) {
      query = query.where(and(eq(metrics.type, type), eq(metrics.memberId, memberId)));
    }
    
    if (projectId) {
      query = query.where(and(eq(metrics.type, type), eq(metrics.projectId, projectId)));
    }
    
    return await query.orderBy(desc(metrics.createdAt));
  }

  // Dashboard Analytics
  async getDashboardStats() {
    const totalMembers = await this.db.select().from(teamMembers).where(eq(teamMembers.status, 'active'));
    const totalProjects = await this.db.select().from(projects).where(eq(projects.status, 'active'));
    const recentActivity = await this.getRecentActivity(5);
    
    return {
      totalMembers: totalMembers.length,
      totalProjects: totalProjects.length,
      recentActivity,
    };
  }

  // Agent Session Tracking
  async startAgentSession(session: {
    agentRole: string;
    memberId?: string;
    task: string;
    input: string;
    modelUsed?: string;
  }) {
    const sessionData = {
      id: crypto.randomUUID(),
      agentRole: session.agentRole,
      memberId: session.memberId,
      status: 'active' as const,
      task: session.task,
      input: session.input,
      modelUsed: session.modelUsed,
      startTime: new Date().toISOString(),
    };
    
    return await this.db.insert(agentSessions).values(sessionData).returning();
  }

  async endAgentSession(sessionId: string, output: string, handoffTo?: string) {
    const endTime = new Date().toISOString();
    const session = await this.db.select().from(agentSessions).where(eq(agentSessions.id, sessionId)).get();
    
    if (!session) throw new Error('Session not found');
    
    const duration = Math.floor((new Date(endTime).getTime() - new Date(session.startTime).getTime()) / 1000);
    
    return await this.db
      .update(agentSessions)
      .set({
        status: 'completed',
        endTime,
        duration,
        output,
        handoffTo,
      })
      .where(eq(agentSessions.id, sessionId))
      .returning();
  }
}

// Helper to get database instance
export function createDatabaseService(d1: D1Database): DatabaseService {
  const db = getDb(d1);
  return new DatabaseService(db);
}