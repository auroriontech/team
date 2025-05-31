/**
 * Centralized Navigation Configuration
 * Single source of truth for all navigation links across the application
 */

export interface NavLink {
  href: string;
  label: string;
  icon: string;
  badge?: string;
  status?: 'active' | 'inactive';
  description?: string;
}

export interface NavigationConfig {
  main: NavLink[];
  team: NavLink[];
  footer: NavLink[];
}

export const navigation: NavigationConfig = {
  // Main navigation links (used in header, mobile nav, bottom nav)
  main: [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: 'lucide:bar-chart-3',
      description: 'Overview and analytics'
    },
    {
      href: '/team',
      label: 'Team',
      icon: 'lucide:users',
      badge: '7',
      description: 'AI agent management'
    },
    {
      href: '/models',
      label: 'Models',
      icon: 'lucide:brain',
      status: 'active',
      description: 'AI model configuration'
    },
    {
      href: '/docs',
      label: 'Docs',
      icon: 'lucide:book-open',
      description: 'Documentation and guides'
    },
    {
      href: '/projects',
      label: 'Projects',
      icon: 'lucide:folder',
      description: 'Project management'
    }
  ],

  // Team-specific navigation (used in mobile nav secondary section)
  team: [
    {
      href: '/team-builder',
      label: 'Team Builder',
      icon: 'lucide:settings',
      description: 'Configure team composition'
    },
    {
      href: '/team-members',
      label: 'Team Members',
      icon: 'lucide:user-check',
      description: 'Manage team members'
    }
  ],

  // Footer navigation links
  footer: [
    {
      href: '/docs',
      label: 'Documentation',
      icon: 'lucide:book-open'
    },
    {
      href: '/team',
      label: 'View All Agents',
      icon: 'lucide:users'
    },
    {
      href: '/about',
      label: 'About the Project',
      icon: 'lucide:info'
    }
  ]
};

// Helper functions for specific navigation needs
export const getMainNavigation = () => navigation.main;
export const getTeamNavigation = () => navigation.team;
export const getFooterNavigation = () => navigation.footer;

// Get navigation item by href
export const getNavItemByHref = (href: string): NavLink | undefined => {
  return [...navigation.main, ...navigation.team, ...navigation.footer]
    .find(item => item.href === href);
};

// Check if a path is active (supports nested routes)
export const isNavItemActive = (itemHref: string, currentPath: string): boolean => {
  if (itemHref === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(itemHref);
};