/**
 * Status & Priority Color Mapping Utility
 * 
 * Centralized color mappings using design tokens for status and priority indicators
 * across projects, documentation, and other components.
 * 
 * WCAG 2.1 AA compliant color mappings using design system tokens
 * 
 * @author Aurorion Teams Collective (Architect-Engineer Agent)
 * @version 1.0.0
 */

/**
 * Status color mapping using design tokens
 * Used for project status, documentation status, etc.
 */
export const statusColors = {
  active: 'var(--color-success-600)',      // #16a34a - WCAG AA compliant green
  completed: 'var(--color-primary-600)',   // #2563eb - WCAG AA compliant blue  
  paused: 'var(--color-warning-600)',      // #d97706 - WCAG AA compliant orange
  archived: 'var(--color-neutral-500)',    // #64748b - WCAG AA compliant gray
  planning: 'var(--color-primary-700)',    // #1d4ed8 - WCAG AA compliant dark blue
  draft: 'var(--color-warning-600)',       // #d97706 - WCAG AA compliant orange
  deprecated: 'var(--color-error-600)'     // #dc2626 - WCAG AA compliant red
} as const;

/**
 * Priority color mapping using design tokens
 * Used for task priority, documentation priority, etc.
 */
export const priorityColors = {
  critical: 'var(--color-error-600)',      // #dc2626 - WCAG AA compliant red
  high: 'var(--color-warning-600)',        // #d97706 - WCAG AA compliant orange
  medium: 'var(--color-primary-600)',      // #2563eb - WCAG AA compliant blue
  low: 'var(--color-neutral-500)'          // #64748b - WCAG AA compliant gray
} as const;

/**
 * Get status color with fallback
 * @param status - Status key
 * @returns CSS color value using design tokens
 */
export function getStatusColor(status: keyof typeof statusColors): string {
  return statusColors[status] || statusColors.active;
}

/**
 * Get priority color with fallback  
 * @param priority - Priority key
 * @returns CSS color value using design tokens
 */
export function getPriorityColor(priority: keyof typeof priorityColors): string {
  return priorityColors[priority] || priorityColors.medium;
}

/**
 * Get status badge CSS classes
 * @param status - Status key
 * @returns CSS class string for styled badges
 */
export function getStatusBadgeClass(status: keyof typeof statusColors): string {
  const baseClass = 'status-badge';
  const statusClass = `status-${status}`;
  return `${baseClass} ${statusClass}`;
}

/**
 * Get priority badge CSS classes
 * @param priority - Priority key  
 * @returns CSS class string for styled badges
 */
export function getPriorityBadgeClass(priority: keyof typeof priorityColors): string {
  const baseClass = 'priority-badge';
  const priorityClass = `priority-${priority}`;
  return `${baseClass} ${priorityClass}`;
}

/**
 * Type definitions for status and priority
 */
export type StatusType = keyof typeof statusColors;
export type PriorityType = keyof typeof priorityColors;