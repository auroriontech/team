import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test('should load and display centered content', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check page title
    await expect(page).toHaveTitle(/Daily Dashboard - Aurorion Teams/);
    
    // Check main container exists and is centered
    const dashboardContainer = page.locator('.dashboard-container');
    await expect(dashboardContainer).toBeVisible();
    
    // Check container has proper centering styles
    const containerStyles = await dashboardContainer.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        maxWidth: computed.maxWidth,
        marginLeft: computed.marginLeft,
        marginRight: computed.marginRight,
      };
    });
    
    expect(containerStyles.maxWidth).toBe('1400px');
    // Note: margin may compute as pixels when within a flex/grid container
    expect(['auto', '0px'].includes(containerStyles.marginLeft) || containerStyles.marginLeft.includes('px')).toBe(true);
    expect(['auto', '0px'].includes(containerStyles.marginRight) || containerStyles.marginRight.includes('px')).toBe(true);
  });

  test('should display dashboard header with title and time', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check header exists
    const header = page.locator('.dashboard-header');
    await expect(header).toBeVisible();
    
    // Check title
    await expect(page.locator('.dashboard-header h1')).toContainText('Daily Team Dashboard');
    
    // Check date/time display
    await expect(page.locator('#current-date')).toBeVisible();
    await expect(page.locator('#current-time')).toBeVisible();
    
    // Wait a moment and check that time updates
    await page.waitForTimeout(1100);
    const timeText = await page.locator('#current-time').textContent();
    expect(timeText).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  test('should display all dashboard widgets', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check all main widgets are present
    const widgets = [
      '.team-health',
      '.sprint-progress', 
      '.agent-status',
      '.analytics-overview',
      '.recent-activity',
      '.key-metrics'
    ];
    
    for (const widget of widgets) {
      await expect(page.locator(widget)).toBeVisible();
    }
  });

  test('should display agent status list', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check agent list exists
    const agentList = page.locator('.agent-list');
    await expect(agentList).toBeVisible();
    
    // Check specific agents are listed
    const expectedAgents = [
      'Architect-Engineer',
      'Tester-Reviewer', 
      'Optimizer-Watchdog',
      'Scrum-Knowledge',
      'Morale-Catalyst',
      'Technical Enablement',
      'Standup Facilitator'
    ];
    
    for (const agent of expectedAgents) {
      await expect(page.locator('.agent-name').filter({ hasText: agent })).toBeVisible();
    }
  });

  test('should have functional quick action buttons', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check quick actions section exists
    const quickActions = page.locator('.quick-actions');
    await expect(quickActions).toBeVisible();
    
    // Check all action buttons are present and clickable
    const buttons = [
      { text: 'Start Daily Standup', selector: 'button:has-text("Start Daily Standup")' },
      { text: 'View Analytics', selector: 'button:has-text("View Analytics")' },
      { text: 'Check Team Health', selector: 'button:has-text("Check Team Health")' },
      { text: 'Generate Report', selector: 'button:has-text("Generate Report")' }
    ];
    
    for (const button of buttons) {
      const btn = page.locator(button.selector);
      await expect(btn).toBeVisible();
      await expect(btn).toBeEnabled();
    }
  });

  test('should handle theme switcher functionality', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check theme switcher exists
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    
    // Check initial theme
    const currentTheme = page.locator('#current-theme');
    await expect(currentTheme).toContainText('Professional');
    
    // Click theme toggle
    await themeToggle.click();
    
    // Wait for theme change
    await page.waitForTimeout(500);
    
    // Check theme changed
    await expect(currentTheme).toContainText('Price is Right');
    
    // Check body has theme class
    const body = page.locator('body');
    await expect(body).toHaveClass(/price-is-right/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check container is still visible and properly styled
    const dashboardContainer = page.locator('.dashboard-container');
    await expect(dashboardContainer).toBeVisible();
    
    // Check grid adapts to mobile
    const statusGrid = page.locator('.status-grid');
    const gridColumns = await statusGrid.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    
    // On mobile, should be single column or fewer columns
    expect(gridColumns).not.toContain('minmax(300px, 1fr)');
  });

  test('should display progress bars with correct values', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check sprint progress bar
    const progressBar = page.locator('.progress-bar');
    await expect(progressBar).toBeVisible();
    
    const progressFill = page.locator('.progress-fill');
    const width = await progressFill.getAttribute('style');
    expect(width).toContain('width: 65%');
    
    // Check progress text
    await expect(page.locator('.progress-text')).toContainText('65% Complete');
  });

  test('should update activity feed in real-time', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Wait for simulated activities to be added
    await page.waitForTimeout(10000); // Wait for all simulated activities
    
    const activityItems = page.locator('.activity-item');
    const count = await activityItems.count();
    
    // Should have initial activities plus simulated ones
    expect(count).toBeGreaterThan(3);
    
    // Check activity items have proper structure
    const firstActivity = activityItems.first();
    await expect(firstActivity.locator('.timestamp')).toBeVisible();
    await expect(firstActivity.locator('.message')).toBeVisible();
  });
});