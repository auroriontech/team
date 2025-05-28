import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export { schema };

// Database connection function
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

// Development/production database connection
export const db = globalThis.DB 
  ? drizzle(globalThis.DB, { schema })
  : createMockDb();

function createMockDb() {
  console.warn('Using mock database - run `npm run db:local` to set up local D1');
  // Mock database for development/testing when D1 is not available
  return {
    select: () => ({ 
      from: () => ({ 
        where: () => Promise.resolve([]),
        execute: () => Promise.resolve([])
      }) 
    }),
    insert: () => ({ 
      values: () => Promise.resolve({ success: true }),
      execute: () => Promise.resolve({ success: true })
    }),
    update: () => ({ 
      set: () => ({ 
        where: () => Promise.resolve({ success: true }),
        execute: () => Promise.resolve({ success: true })
      }) 
    }),
    delete: () => ({ 
      where: () => Promise.resolve({ success: true }),
      execute: () => Promise.resolve({ success: true })
    })
  };
}

// Types
export type Database = ReturnType<typeof getDb>;

export type TeamMember = typeof schema.teamMembers.$inferSelect;
export type NewTeamMember = typeof schema.teamMembers.$inferInsert;

export type Project = typeof schema.projects.$inferSelect;
export type NewProject = typeof schema.projects.$inferInsert;

export type ProjectMember = typeof schema.projectMembers.$inferSelect;
export type NewProjectMember = typeof schema.projectMembers.$inferInsert;

export type ActivityLog = typeof schema.activityLogs.$inferSelect;
export type NewActivityLog = typeof schema.activityLogs.$inferInsert;

export type Metric = typeof schema.metrics.$inferSelect;
export type NewMetric = typeof schema.metrics.$inferInsert;

export type Founder = typeof schema.founders.$inferSelect;
export type NewFounder = typeof schema.founders.$inferInsert;

export type TeamSession = typeof schema.teamSessions.$inferSelect;
export type NewTeamSession = typeof schema.teamSessions.$inferInsert;

export type TeamDecision = typeof schema.teamDecisions.$inferSelect;
export type NewTeamDecision = typeof schema.teamDecisions.$inferInsert;