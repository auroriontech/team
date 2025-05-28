/**
 * Authentication Manager
 * 
 * Handles user authentication, session management, and authentication state
 * Supports organizationId, userId, agentId for multi-tenant architecture
 * 
 * @author Aurorion Teams Collective
 * @version 1.0.0
 */

export interface UserSession {
  userId: string;
  email: string;
  organizationId?: string;
  agentId?: string;
  loginTime: string;
  rememberMe: boolean;
  isDemo?: boolean;
  permissions?: string[];
  roles?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserSession | null;
  loading: boolean;
  error: string | null;
}

const SESSION_KEYS = {
  PERSISTENT: 'aurorion-user-session',
  TEMPORARY: 'aurorion-user-session-temp',
  AUTH_STATE: 'aurorion-auth-state'
} as const;

const SESSION_DURATION = {
  TEMPORARY: 1000 * 60 * 60 * 24, // 24 hours
  PERSISTENT: 1000 * 60 * 60 * 24 * 30 // 30 days
} as const;

/**
 * Authentication Manager Class
 */
export class AuthManager {
  private static instance: AuthManager;
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  };
  private listeners: Set<(state: AuthState) => void> = new Set();

  private constructor() {
    this.loadStoredSession();
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  /**
   * Load stored session from localStorage
   */
  private loadStoredSession(): void {
    try {
      const persistentSession = localStorage.getItem(SESSION_KEYS.PERSISTENT);
      const temporarySession = localStorage.getItem(SESSION_KEYS.TEMPORARY);
      
      const sessionData = persistentSession || temporarySession;
      
      if (sessionData) {
        const session: UserSession = JSON.parse(sessionData);
        
        // Check if session is expired
        if (this.isSessionValid(session)) {
          this.setUser(session);
        } else {
          this.clearStoredSessions();
        }
      }
    } catch (error) {
      console.error('Failed to load stored session:', error);
      this.clearStoredSessions();
    }
  }

  /**
   * Check if a session is still valid
   */
  private isSessionValid(session: UserSession): boolean {
    const loginTime = new Date(session.loginTime).getTime();
    const now = Date.now();
    const maxAge = session.rememberMe ? SESSION_DURATION.PERSISTENT : SESSION_DURATION.TEMPORARY;
    
    return (now - loginTime) < maxAge;
  }

  /**
   * Store session data
   */
  private storeSession(session: UserSession): void {
    const sessionKey = session.rememberMe ? SESSION_KEYS.PERSISTENT : SESSION_KEYS.TEMPORARY;
    
    try {
      localStorage.setItem(sessionKey, JSON.stringify(session));
      
      // Clear the other session type
      const otherKey = session.rememberMe ? SESSION_KEYS.TEMPORARY : SESSION_KEYS.PERSISTENT;
      localStorage.removeItem(otherKey);
    } catch (error) {
      console.error('Failed to store session:', error);
      throw new Error('Failed to save session data');
    }
  }

  /**
   * Clear all stored sessions
   */
  private clearStoredSessions(): void {
    localStorage.removeItem(SESSION_KEYS.PERSISTENT);
    localStorage.removeItem(SESSION_KEYS.TEMPORARY);
    localStorage.removeItem(SESSION_KEYS.AUTH_STATE);
  }

  /**
   * Update auth state and notify listeners
   */
  private updateAuthState(updates: Partial<AuthState>): void {
    this.authState = { ...this.authState, ...updates };
    this.notifyListeners();
  }

  /**
   * Set authenticated user
   */
  private setUser(user: UserSession): void {
    this.updateAuthState({
      isAuthenticated: true,
      user,
      error: null
    });
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.authState);
      } catch (error) {
        console.error('Auth state listener error:', error);
      }
    });
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    
    // Immediately call with current state
    listener(this.authState);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Login user with credentials
   */
  async login(credentials: {
    email: string;
    password: string;
    organizationId?: string;
    rememberMe?: boolean;
  }): Promise<UserSession> {
    this.updateAuthState({ loading: true, error: null });

    try {
      // TODO: Replace with actual API call
      await this.simulateApiCall();

      // Create user session
      const userSession: UserSession = {
        userId: this.generateUserId(),
        email: credentials.email,
        organizationId: credentials.organizationId,
        loginTime: new Date().toISOString(),
        rememberMe: credentials.rememberMe || false,
        permissions: ['read', 'write'], // Default permissions
        roles: ['user'] // Default role
      };

      // Store session
      this.storeSession(userSession);
      this.setUser(userSession);

      this.updateAuthState({ loading: false });
      return userSession;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      this.updateAuthState({ 
        loading: false, 
        error: errorMessage 
      });
      throw error;
    }
  }

  /**
   * Login as demo user
   */
  async loginDemo(): Promise<UserSession> {
    this.updateAuthState({ loading: true, error: null });

    try {
      const demoSession: UserSession = {
        userId: 'demo-user-' + Date.now(),
        email: 'demo@aurorion.teams',
        organizationId: 'demo-org',
        loginTime: new Date().toISOString(),
        rememberMe: false,
        isDemo: true,
        permissions: ['read'], // Limited permissions for demo
        roles: ['demo']
      };

      // Store as temporary session
      localStorage.setItem(SESSION_KEYS.TEMPORARY, JSON.stringify(demoSession));
      this.setUser(demoSession);

      this.updateAuthState({ loading: false });
      return demoSession;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Demo login failed';
      this.updateAuthState({ 
        loading: false, 
        error: errorMessage 
      });
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearStoredSessions();
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
  }

  /**
   * Get current auth state
   */
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  /**
   * Get current user
   */
  getCurrentUser(): UserSession | null {
    return this.authState.user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated && this.authState.user !== null;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    return this.authState.user?.permissions?.includes(permission) || false;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return this.authState.user?.roles?.includes(role) || false;
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<Pick<UserSession, 'email' | 'organizationId'>>): Promise<void> {
    if (!this.authState.user) {
      throw new Error('No authenticated user');
    }

    this.updateAuthState({ loading: true, error: null });

    try {
      // TODO: Replace with actual API call
      await this.simulateApiCall();

      const updatedUser = { ...this.authState.user, ...updates };
      this.storeSession(updatedUser);
      this.setUser(updatedUser);

      this.updateAuthState({ loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      this.updateAuthState({ 
        loading: false, 
        error: errorMessage 
      });
      throw error;
    }
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<void> {
    if (!this.authState.user) {
      throw new Error('No authenticated user');
    }

    this.updateAuthState({ loading: true });

    try {
      // TODO: Replace with actual API call to validate session
      await this.simulateApiCall();

      // Update login time to extend session
      const refreshedUser = {
        ...this.authState.user,
        loginTime: new Date().toISOString()
      };

      this.storeSession(refreshedUser);
      this.setUser(refreshedUser);

      this.updateAuthState({ loading: false });
    } catch (error) {
      // Session invalid, logout user
      this.logout();
      throw error;
    }
  }

  /**
   * Generate unique user ID
   */
  private generateUserId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Simulate API call for demo purposes
   */
  private async simulateApiCall(delay: number = 1000): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate occasional failures for demo
        if (Math.random() < 0.05) {
          reject(new Error('Network error'));
        } else {
          resolve();
        }
      }, delay);
    });
  }
}

// Export singleton instance
export const authManager = AuthManager.getInstance();

/**
 * Utility functions for common auth operations
 */

/**
 * Check if user is authenticated (convenience function)
 */
export function isAuthenticated(): boolean {
  return authManager.isAuthenticated();
}

/**
 * Get current user (convenience function)
 */
export function getCurrentUser(): UserSession | null {
  return authManager.getCurrentUser();
}

/**
 * Get user's organization ID
 */
export function getCurrentOrganizationId(): string | null {
  return authManager.getCurrentUser()?.organizationId || null;
}

/**
 * Get user's ID
 */
export function getCurrentUserId(): string | null {
  return authManager.getCurrentUser()?.userId || null;
}

/**
 * Check permissions (convenience function)
 */
export function hasPermission(permission: string): boolean {
  return authManager.hasPermission(permission);
}

/**
 * Check roles (convenience function)
 */
export function hasRole(role: string): boolean {
  return authManager.hasRole(role);
}

/**
 * Require authentication (throws if not authenticated)
 */
export function requireAuth(): UserSession {
  const user = authManager.getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Require specific permission (throws if not authorized)
 */
export function requirePermission(permission: string): void {
  if (!hasPermission(permission)) {
    throw new Error(`Permission required: ${permission}`);
  }
}

/**
 * Require specific role (throws if not authorized)
 */
export function requireRole(role: string): void {
  if (!hasRole(role)) {
    throw new Error(`Role required: ${role}`);
  }
}

/**
 * Navigation guards for protecting routes
 */
export function createAuthGuard(requiredPermissions?: string[], requiredRoles?: string[]) {
  return (): boolean => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return false;
    }

    if (requiredPermissions) {
      for (const permission of requiredPermissions) {
        if (!hasPermission(permission)) {
          window.location.href = '/unauthorized';
          return false;
        }
      }
    }

    if (requiredRoles) {
      for (const role of requiredRoles) {
        if (!hasRole(role)) {
          window.location.href = '/unauthorized';
          return false;
        }
      }
    }

    return true;
  };
}

// Initialize auth manager
if (typeof window !== 'undefined') {
  // Client-side initialization
  console.log('Auth Manager initialized');
}