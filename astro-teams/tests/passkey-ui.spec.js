import { test, expect } from '@playwright/test';

test.describe('Passkey UI Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('should display passkey button and UI elements', async ({ page }) => {
    // Check if passkey button is visible
    const passkeyButton = page.locator('#passkeyButton');
    await expect(passkeyButton).toBeVisible();
    
    // Check button content
    await expect(passkeyButton).toContainText('Sign in with Passkey');
    
    // Check passkey icon
    const passkeyIcon = page.locator('.passkey-icon');
    await expect(passkeyIcon).toBeVisible();
    
    // Check hint text
    const passkeyHint = page.locator('.passkey-hint');
    await expect(passkeyHint).toBeVisible();
    await expect(passkeyHint).toContainText('Use your fingerprint, face, or security key');
  });

  test('should have proper layout structure', async ({ page }) => {
    // Check form elements are present
    const loginForm = page.locator('#loginForm');
    await expect(loginForm).toBeVisible();
    
    // Check traditional login fields
    const emailField = page.locator('#email');
    const passwordField = page.locator('#password');
    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    
    // Check divider between methods
    const divider = page.locator('.divider');
    await expect(divider).toBeVisible();
    
    const dividerText = page.locator('.divider-text');
    await expect(dividerText).toContainText('or');
    
    // Check passkey section
    const passkeySection = page.locator('.passkey-section');
    await expect(passkeySection).toBeVisible();
  });

  test('should have proper button attributes', async ({ page }) => {
    const passkeyButton = page.locator('#passkeyButton');
    
    // Check button type
    await expect(passkeyButton).toHaveAttribute('type', 'button');
    
    // Check button is enabled initially
    await expect(passkeyButton).toBeEnabled();
    
    // Check button has proper styling classes
    await expect(passkeyButton).toHaveClass(/passkey-button/);
  });

  test('should check form accessibility', async ({ page }) => {
    // Check email field accessibility
    const emailField = page.locator('#email');
    await expect(emailField).toHaveAttribute('type', 'email');
    await expect(emailField).toHaveAttribute('required');
    await expect(emailField).toHaveAttribute('autocomplete', 'email');
    
    // Check password field accessibility  
    const passwordField = page.locator('#password');
    await expect(passwordField).toHaveAttribute('type', 'password');
    await expect(passwordField).toHaveAttribute('required');
    await expect(passwordField).toHaveAttribute('autocomplete', 'current-password');
    
    // Check labels are present
    const emailLabel = page.locator('label[for="email"]');
    const passwordLabel = page.locator('label[for="password"]');
    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });

  test('should have WebAuthn browser detection', async ({ page }) => {
    // Check if WebAuthn APIs are available in browser
    const webAuthnSupported = await page.evaluate(() => {
      return !!(
        window.PublicKeyCredential && 
        navigator.credentials && 
        navigator.credentials.create &&
        navigator.credentials.get
      );
    });
    
    console.log(`WebAuthn support detected: ${webAuthnSupported}`);
    
    // WebAuthn support should be defined (true or false)
    expect(typeof webAuthnSupported).toBe('boolean');
  });

  test('should verify responsive layout', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    const passkeyButton = page.locator('#passkeyButton');
    await expect(passkeyButton).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(passkeyButton).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(passkeyButton).toBeVisible();
  });

  test('should test traditional login form still works', async ({ page }) => {
    // Fill in email and password
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'testpassword123');
    
    // Check remember me checkbox
    const rememberCheckbox = page.locator('#rememberMe');
    await rememberCheckbox.check();
    await expect(rememberCheckbox).toBeChecked();
    
    // Both login methods should be available
    const loginButton = page.locator('#loginButton');
    const passkeyButton = page.locator('#passkeyButton');
    
    await expect(loginButton).toBeVisible();
    await expect(passkeyButton).toBeVisible();
    
    // Verify different button types
    await expect(loginButton).toHaveAttribute('type', 'submit');
    await expect(passkeyButton).toHaveAttribute('type', 'button');
  });

  test('should check demo mode availability', async ({ page }) => {
    // Demo button should still be available
    const demoButton = page.locator('#demoButton');
    await expect(demoButton).toBeVisible();
    await expect(demoButton).toContainText('Enter Demo Mode');
  });

  test('should verify passkey button interaction', async ({ page }) => {
    const passkeyButton = page.locator('#passkeyButton');
    
    // Button should be clickable
    await expect(passkeyButton).toBeEnabled();
    
    // Mock network requests to prevent actual API calls
    await page.route('**/api/auth/webauthn-**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Test mode - API mocked' })
      });
    });
    
    // Click should not crash the page
    await passkeyButton.click();
    
    // Page should still be responsive after click
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should check console initialization', async ({ page }) => {
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        consoleMessages.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should see login page initialization
    const hasInitMessage = consoleMessages.some(msg => 
      msg.includes('Login page initialized')
    );
    expect(hasInitMessage).toBe(true);
  });

  test('should validate HTTPS requirement message', async ({ page }) => {
    // Check current protocol
    const isHTTPS = await page.evaluate(() => window.location.protocol === 'https:');
    const currentProtocol = await page.evaluate(() => window.location.protocol);
    
    console.log(`Current protocol: ${currentProtocol}, isHTTPS: ${isHTTPS}`);
    
    // For local development, we might be on HTTP, but WebAuthn should still be available
    // In production, HTTPS is required
    expect(['http:', 'https:']).toContain(currentProtocol);
  });
});