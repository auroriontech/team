import { defineDb, defineTable, column } from 'astro:db';

// User Profiles Table
const UserProfiles = defineTable({
  columns: {
    userId: column.text({ primaryKey: true }),
    displayName: column.text({ optional: true }),
    email: column.text({ unique: true, optional: true }),
    subscriptionLevel: column.text({ default: 'free' }),
    expiresAt: column.text({ optional: true }),
    subscriptionUpdatedAt: column.text({ optional: true }),
    selectedGuideId: column.text({ optional: true }),
    preferredLanguage: column.text({ default: 'en' }),
    firstName: column.text({ optional: true }),
    lastName: column.text({ optional: true }),
    phoneNumber: column.text({ optional: true }),
    enablePasskeys: column.boolean({ default: true }),
    lastPasskeyLogin: column.text({ optional: true }),
    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
  }
});

// WebAuthn Credentials Table
const WebAuthnCredentials = defineTable({
  columns: {
    id: column.text({ primaryKey: true }), // credential ID from WebAuthn
    userId: column.text({ references: () => UserProfiles.columns.userId }),
    credentialPublicKey: column.text(), // base64 encoded public key
    counter: column.number({ default: 0 }),
    credentialDeviceType: column.text(), // 'singleDevice' | 'multiDevice'
    credentialBackedUp: column.boolean({ default: false }),
    friendlyName: column.text({ optional: true }), // e.g., "iPhone 15 Pro"
    userAgent: column.text({ optional: true }),
    lastUsed: column.text({ optional: true }),
    signCount: column.number({ default: 0 }),
    transports: column.text({ optional: true }), // JSON array
    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
  }
});

// WebAuthn Challenges Table - for temporary challenge storage
const WebAuthnChallenges = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    challenge: column.text({ unique: true }),
    type: column.text(), // 'registration' | 'authentication'
    userId: column.text({ optional: true }), // null for initial registration
    ipAddress: column.text({ optional: true }),
    userAgent: column.text({ optional: true }),
    expiresAt: column.text(), // ISO string
    createdAt: column.date({ default: new Date() }),
  }
});

// Team Members Table (AI agents)
const TeamMembers = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    role: column.text(), // AI agent role
    avatar: column.text({ optional: true }),
    bio: column.text({ optional: true }),
    status: column.text({ default: 'active' }),
    joinDate: column.text(),
    email: column.text({ unique: true }),
    skills: column.text({ optional: true }), // JSON array
    specializations: column.text({ optional: true }), // JSON array
    timezone: column.text({ default: 'America/New_York' }),
    startHour: column.number({ default: 9 }),
    endHour: column.number({ default: 17 }),
    workDays: column.text({ default: '[1,2,3,4,5]' }), // JSON array
    communicationStyle: column.text({ default: 'collaborative' }),
    autonomyLevel: column.number({ default: 75 }),
    riskTolerance: column.number({ default: 50 }),
    creativity: column.number({ default: 75 }),
    precision: column.number({ default: 75 }),
    collaboration: column.number({ default: 75 }),
    responseSpeed: column.number({ default: 5 }),
    authorityLevel: column.text({ default: 'member' }),
    permissions: column.text({ optional: true }), // JSON array
    escalationPath: column.text({ optional: true }), // JSON array
    tasksCompleted: column.number({ default: 0 }),
    averageCompletionTime: column.number({ default: 0 }),
    qualityScore: column.number({ default: 75 }),
    collaborationRating: column.number({ default: 4.0 }),
    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
  }
});

// Projects Table
const Projects = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    slug: column.text({ unique: true }),
    description: column.text(),
    status: column.text({ default: 'active' }),
    priority: column.text({ default: 'medium' }),
    startDate: column.text({ optional: true }),
    endDate: column.text({ optional: true }),
    lastActivity: column.text({ optional: true }),
    progress: column.number({ default: 0 }), // 0-100
    tasksTotal: column.number({ default: 0 }),
    tasksCompleted: column.number({ default: 0 }),
    tags: column.text({ optional: true }), // JSON array
    category: column.text({ optional: true }),
    repository: column.text({ optional: true }),
    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
  }
});

// Activity Logs Table
const ActivityLogs = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    type: column.text(), // 'task_completion', 'project_update', etc.
    memberId: column.text({ optional: true, references: () => TeamMembers.columns.id }),
    projectId: column.text({ optional: true, references: () => Projects.columns.id }),
    userId: column.text({ optional: true, references: () => UserProfiles.columns.userId }),
    action: column.text(),
    description: column.text({ optional: true }),
    metadata: column.text({ optional: true }), // JSON
    duration: column.number({ optional: true }), // in minutes
    qualityScore: column.number({ optional: true }),
    impact: column.text({ default: 'medium' }), // low, medium, high
    timestamp: column.date({ default: new Date() }),
  }
});

export default defineDb({
  tables: {
    UserProfiles,
    WebAuthnCredentials,
    WebAuthnChallenges,
    TeamMembers,
    Projects,
    ActivityLogs,
  }
});