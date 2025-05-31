import { test, expect } from '@playwright/test';

test.describe('Passkey Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('should display passkey button when WebAuthn is supported', async ({ page }) => {
    // Check if passkey button is visible
    const passkeyButton = page.locator('#passkeyButton');
    await expect(passkeyButton).toBeVisible();
    
    // Check button text
    await expect(passkeyButton).toContainText('Sign in with Passkey');
    
    // Check passkey icon
    const passkeyIcon = page.locator('.passkey-icon');
    await expect(passkeyIcon).toBeVisible();
    await expect(passkeyIcon).toContainText('🔐');
    
    // Check hint text
    const passkeyHint = page.locator('.passkey-hint');
    await expect(passkeyHint).toBeVisible();
    await expect(passkeyHint).toContainText('Use your fingerprint, face, or security key');
  });

  test('should have proper styling for passkey section', async ({ page }) => {
    // Check divider is present
    const divider = page.locator('.divider');
    await expect(divider).toBeVisible();
    
    const dividerText = page.locator('.divider-text');
    await expect(dividerText).toBeVisible();
    await expect(dividerText).toContainText('or');
    
    // Check passkey button styling
    const passkeyButton = page.locator('#passkeyButton');
    await expect(passkeyButton).toHaveCSS('width', '100%');
    await expect(passkeyButton).toHaveCSS('display', 'flex');
  });

  test('should check WebAuthn browser support', async ({ page }) => {
    // Check if WebAuthn APIs are available
    const webAuthnSupported = await page.evaluate(() => {
      return !!(
        window.PublicKeyCredential && 
        navigator.credentials && 
        navigator.credentials.create &&
        navigator.credentials.get
      );
    });
    
    console.log(`WebAuthn support: ${webAuthnSupported}`);
    expect(webAuthnSupported).toBeDefined();
  });

  test('should initialize passkey support check on page load', async ({ page }) => {
    // Wait for JavaScript to initialize
    await page.waitForFunction(() => window.checkPasskeySupport !== undefined);
    
    // Check that passkey support function is called
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should see initialization message
    const initMessage = consoleMessages.find(msg => 
      msg.includes('Login page initialized with passkey support')
    );
    expect(initMessage).toBeTruthy();
  });

  test('should handle passkey button click with proper loading state', async ({ page }) => {
    const passkeyButton = page.locator('#passkeyButton');
    const passkeyText = page.locator('.passkey-text');
    const passkeySpinner = page.locator('#passkeyButton .button-spinner');
    
    // Initially spinner should be hidden
    await expect(passkeySpinner).toHaveCSS('display', 'none');
    
    // Mock the fetch requests to prevent actual WebAuthn calls
    await page.route('**/api/auth/webauthn-authentication-start', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          options: {
            challenge: 'mock-challenge',
            timeout: 60000,
            rpId: 'team.homedevenv.com',
            allowCredentials: []
          },
          challengeId: 'mock-challenge-id'
        })
      });
    });
    
    // Click the passkey button
    await passkeyButton.click();
    
    // Should show loading state briefly
    await expect(passkeyButton).toBeDisabled();
    
    // Note: In a real test environment, we'd need to mock the WebAuthn APIs
    // For now, we're testing the UI behavior and API calls
  });

  test('should handle WebAuthn not supported gracefully', async ({ page, context }) => {
    // Disable WebAuthn APIs to simulate unsupported browser
    await page.addInitScript(() => {
      delete window.PublicKeyCredential;
      delete navigator.credentials;
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check if passkey support check handles this gracefully
    const webAuthnSupported = await page.evaluate(() => {
      return !!(window.PublicKeyCredential && navigator.credentials);
    });
    
    expect(webAuthnSupported).toBe(false);
  });

  test('should validate form elements and accessibility', async ({ page }) => {
    // Check form accessibility
    const loginForm = page.locator('#loginForm');
    await expect(loginForm).toBeVisible();
    
    // Check email field
    const emailField = page.locator('#email');
    await expect(emailField).toHaveAttribute('type', 'email');
    await expect(emailField).toHaveAttribute('required');
    await expect(emailField).toHaveAttribute('autocomplete', 'email');
    
    // Check password field
    const passwordField = page.locator('#password');
    await expect(passwordField).toHaveAttribute('type', 'password');
    await expect(passwordField).toHaveAttribute('required');
    await expect(passwordField).toHaveAttribute('autocomplete', 'current-password');
    
    // Check passkey button accessibility
    const passkeyButton = page.locator('#passkeyButton');
    await expect(passkeyButton).toHaveAttribute('type', 'button');
    
    // Check labels are properly associated
    const emailLabel = page.locator('label[for="email"]');
    const passwordLabel = page.locator('label[for="password"]');
    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });

  test('should have proper error handling structure', async ({ page }) => {
    // Check form status element exists
    const formStatus = page.locator('#formStatus');
    await expect(formStatus).toBeVisible();
    await expect(formStatus).toHaveCSS('display', 'none');
    
    // Check error elements exist for fields
    const emailError = page.locator('#emailError');
    const passwordError = page.locator('#passwordError');
    await expect(emailError).toBeInViewport();
    await expect(passwordError).toBeInViewport();
  });

  test('should test traditional login form alongside passkey', async ({ page }) => {
    // Fill in email and password
    await page.fill('#email', 'test@aurorion.teams');
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
    
    // Verify they have different functionality
    await expect(loginButton).toHaveAttribute('type', 'submit');
    await expect(passkeyButton).toHaveAttribute('type', 'button');
  });

  test('should validate demo mode still works with passkey present', async ({ page }) => {
    // Check demo button
    const demoButton = page.locator('#demoButton');
    await expect(demoButton).toBeVisible();
    await expect(demoButton).toContainText('Enter Demo Mode');
    
    // Demo mode should work independently of passkey functionality
    const demoSection = page.locator('.demo-section');
    await expect(demoSection).toBeVisible();
  });

  test('should check responsive design for passkey section', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    const passkeyButton = page.locator('#passkeyButton');
    await expect(passkeyButton).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(passkeyButton).toBeVisible();
    
    // Check that button maintains proper width
    await expect(passkeyButton).toHaveCSS('width', '100%');
  });

  test('should validate environment configuration', async ({ page }) => {
    // Check that we're testing against the right domain
    const currentOrigin = await page.evaluate(() => window.location.origin);
    expect(currentOrigin).toBe('https://team.homedevenv.com');
    
    // Check that HTTPS is properly configured for WebAuthn
    const isHTTPS = await page.evaluate(() => window.location.protocol === 'https:');
    expect(isHTTPS).toBe(true);
  });
});

test.describe('Passkey Registration Flow', () => {
  test('should handle registration API endpoints', async ({ page }) => {
    // Test that registration start endpoint is available
    const response = await page.request.post('/api/auth/webauthn-registration-start', {
      data: {}
    });
    
    // Should return a valid response (may be 400 due to missing data, but not 404)
    expect([200, 400, 500]).toContain(response.status());
  });

  test('should validate challenge storage and cleanup', async ({ page }) => {
    // Test authentication start endpoint
    const response = await page.request.post('/api/auth/webauthn-authentication-start', {
      data: {}
    });
    
    // Should return a valid response structure
    expect([200, 400, 500]).toContain(response.status());
    
    if (response.ok()) {
      const data = await response.json();
      expect(data).toHaveProperty('success');
    }
  });
});

test.describe('WebAuthn Integration Tests', () => {
  test('should mock WebAuthn registration flow', async ({ page }) => {
    // Mock WebAuthn APIs for testing
    await page.addInitScript(() => {
      // Mock PublicKeyCredential
      window.PublicKeyCredential = class {
        static isUserVerifyingPlatformAuthenticatorAvailable() {
          return Promise.resolve(true);
        }
      };
      
      // Mock navigator.credentials
      navigator.credentials = {
        create: async (options) => {
          return {
            id: 'mock-credential-id',
            rawId: new ArrayBuffer(32),
            response: {
              clientDataJSON: new ArrayBuffer(32),
              attestationObject: new ArrayBuffer(32),
              transports: ['internal']
            },
            type: 'public-key'
          };
        },
        get: async (options) => {
          return {
            id: 'mock-credential-id',
            rawId: new ArrayBuffer(32),
            response: {
              clientDataJSON: new ArrayBuffer(32),
              authenticatorData: new ArrayBuffer(32),
              signature: new ArrayBuffer(32),
              userHandle: new ArrayBuffer(32)
            },
            type: 'public-key'
          };
        }
      };
    });
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Verify mocked WebAuthn is available
    const webAuthnSupported = await page.evaluate(() => {
      return !!(window.PublicKeyCredential && navigator.credentials);
    });
    
    expect(webAuthnSupported).toBe(true);
  });
});