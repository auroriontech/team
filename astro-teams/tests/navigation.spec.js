import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('should navigate between main pages', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check navigation exists
    const nav = page.locator('.nav-header');
    await expect(nav).toBeVisible();
    
    // Test navigation links
    const navLinks = [
      { text: 'Agents', url: '/agents' },
      { text: 'Models', url: '/models' },
      { text: 'Documentation', url: '/docs' }
    ];
    
    for (const link of navLinks) {
      const navLink = page.locator(`.nav-link:has-text("${link.text}")`);
      await expect(navLink).toBeVisible();
      
      // Click and verify navigation
      await navLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(new RegExp(link.url));
      
      // Go back to home
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    }
  });

  test('should display correct navigation based on auth state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that guest menu is shown initially
    const guestMenu = page.locator('#guestMenu');
    await expect(guestMenu).toBeVisible();
    
    // Check that auth menu is hidden
    const authMenu = page.locator('#authUserMenu');
    await expect(authMenu).toBeHidden();
  });

  test('should have responsive navigation', async ({ page }) => {
    // Test mobile navigation
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check navigation adapts to mobile
    const navContainer = page.locator('.nav-container');
    await expect(navContainer).toBeVisible();
    
    // Check navigation links are still accessible
    const navLinks = page.locator('.nav-links');
    await expect(navLinks).toBeVisible();
  });

  test('should handle brand logo navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Click brand logo to go home
    const brandLink = page.locator('.brand-link');
    await expect(brandLink).toBeVisible();
    
    await brandLink.click();
    await page.waitForLoadState('networkidle');
    
    // Should navigate to home page
    await expect(page).toHaveURL('/');
  });

  test('should maintain navigation state across pages', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Change theme
    const themeToggle = page.locator('#theme-toggle');
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Theme should persist
    const body = page.locator('body');
    await expect(body).toHaveClass(/price-is-right/);
  });
});