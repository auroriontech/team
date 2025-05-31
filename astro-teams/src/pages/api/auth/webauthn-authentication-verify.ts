import type { APIRoute } from 'astro';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { db, WebAuthnChallenges, WebAuthnCredentials, UserProfiles, ActivityLogs } from 'astro:db';
import { eq, and } from 'astro:db';
import { nanoid } from 'nanoid';

// WebAuthn configuration
const rpID = import.meta.env.WEBAUTHN_RP_ID || 'localhost';
const origin = import.meta.env.WEBAUTHN_ORIGIN || `https://${rpID}`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { credential, challengeId } = await request.json();
    
    if (!credential || !challengeId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required data',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Retrieve the challenge from database
    const challenges = await db.select()
      .from(WebAuthnChallenges)
      .where(and(
        eq(WebAuthnChallenges.id, challengeId),
        eq(WebAuthnChallenges.type, 'authentication')
      ));

    if (challenges.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid challenge',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const challenge = challenges[0];

    // Check if challenge has expired
    if (new Date() > new Date(challenge.expiresAt)) {
      // Clean up expired challenge
      await db.delete(WebAuthnChallenges)
        .where(eq(WebAuthnChallenges.id, challengeId));
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Challenge expired',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the credential from database
    const credentialId = Buffer.from(credential.id, 'base64url').toString('base64url');
    const storedCredentials = await db.select()
      .from(WebAuthnCredentials)
      .where(eq(WebAuthnCredentials.id, credentialId));

    if (storedCredentials.length === 0) {
      // Clean up challenge
      await db.delete(WebAuthnChallenges)
        .where(eq(WebAuthnChallenges.id, challengeId));
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Credential not found',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const storedCredential = storedCredentials[0];

    // Get user profile
    const userProfiles_result = await db.select()
      .from(UserProfiles)
      .where(eq(UserProfiles.userId, storedCredential.userId));

    if (userProfiles_result.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = userProfiles_result[0];

    // Verify the authentication response
    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: challenge.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: Buffer.from(storedCredential.id, 'base64url'),
        credentialPublicKey: Buffer.from(storedCredential.credentialPublicKey, 'base64'),
        counter: storedCredential.counter,
        transports: storedCredential.transports ? JSON.parse(storedCredential.transports) : [],
      },
      requireUserVerification: true,
    });

    if (!verification.verified) {
      // Clean up challenge
      await db.delete(WebAuthnChallenges)
        .where(eq(WebAuthnChallenges.id, challengeId));
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Authentication failed',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const now = new Date().toISOString();

    // Update credential counter and last used
    await db.update(WebAuthnCredentials)
      .set({
        counter: verification.authenticationInfo.newCounter,
        signCount: storedCredential.signCount + 1,
        lastUsed: now,
        updatedAt: now,
      })
      .where(eq(WebAuthnCredentials.id, credentialId));

    // Update user's last passkey login
    await db.update(UserProfiles)
      .set({
        lastPasskeyLogin: now,
        updatedAt: now,
      })
      .where(eq(UserProfiles.userId, user.userId));

    // Clean up the challenge
    await db.delete(webauthnChallenges)
      .where(eq(webauthnChallenges.id, challengeId));

    // Log the authentication
    await db.insert(ActivityLogs).values({
      id: nanoid(),
      entityType: 'user_profile',
      entityId: user.userId,
      userId: user.userId,
      eventType: 'auth',
      action: 'webauthn_authentication',
      description: 'User authenticated with WebAuthn passkey',
      securityLevel: 'high',
      accessMethod: 'webauthn',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    // Create session data (compatible with existing auth system)
    const sessionData = {
      userId: user.userId,
      email: user.email || `${user.firstName}@aurorion.teams`,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      loginTime: now,
      rememberMe: true, // Passkeys are inherently "remember me"
      permissions: ['read', 'write'],
      roles: ['user'],
      authMethod: 'webauthn',
    };

    return new Response(JSON.stringify({
      success: true,
      user: sessionData,
      message: 'Authentication successful',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('WebAuthn authentication verify error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Authentication failed',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};