import type { APIRoute } from 'astro';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { db } from '../../../db/index.js';
import { webauthnChallenges, webauthnCredentials, userProfiles, auditLogs } from '../../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// WebAuthn configuration
const rpName = import.meta.env.WEBAUTHN_RP_NAME || 'Aurorion Teams';
const rpID = import.meta.env.WEBAUTHN_RP_ID || 'localhost';
const origin = import.meta.env.WEBAUTHN_ORIGIN || `https://${rpID}`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { credential, challengeId, userInfo } = await request.json();
    
    if (!credential || !challengeId || !userInfo) {
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
      .from(webauthnChallenges)
      .where(and(
        eq(webauthnChallenges.id, challengeId),
        eq(webauthnChallenges.type, 'registration')
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
      await db.delete(webauthnChallenges)
        .where(eq(webauthnChallenges.id, challengeId));
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Challenge expired',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify the registration response
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challenge.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    });

    if (!verification.verified || !verification.registrationInfo) {
      // Clean up challenge
      await db.delete(webauthnChallenges)
        .where(eq(webauthnChallenges.id, challengeId));
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Verification failed',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { credentialPublicKey, credentialID, counter, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    // Create user profile
    const userId = nanoid();
    const now = new Date().toISOString();

    // Create user profile
    await db.insert(userProfiles).values({
      userId,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email || null,
      phoneNumber: userInfo.phoneNumber || null,
      displayName: `${userInfo.firstName} ${userInfo.lastName}`.trim(),
      enablePasskeys: 1,
      lastPasskeyLogin: now,
      createdAt: now,
      updatedAt: now,
    });

    // Store the credential
    await db.insert(webauthnCredentials).values({
      id: Buffer.from(credentialID).toString('base64url'),
      userId,
      credentialPublicKey: Buffer.from(credentialPublicKey).toString('base64'),
      counter,
      credentialDeviceType,
      credentialBackedUp: credentialBackedUp ? 1 : 0,
      friendlyName: getUserAgentDeviceName(request.headers.get('user-agent') || 'unknown'),
      userAgent: request.headers.get('user-agent') || 'unknown',
      lastUsed: now,
      signCount: 0,
      transports: JSON.stringify(credential.response.transports || []),
      createdAt: now,
      updatedAt: now,
    });

    // Clean up the challenge
    await db.delete(webauthnChallenges)
      .where(eq(webauthnChallenges.id, challengeId));

    // Log the registration
    await db.insert(auditLogs).values({
      id: nanoid(),
      entityType: 'user_profile',
      entityId: userId,
      userId,
      eventType: 'auth',
      action: 'webauthn_registration',
      description: 'User registered with WebAuthn passkey',
      securityLevel: 'high',
      accessMethod: 'webauthn',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return new Response(JSON.stringify({
      success: true,
      userId,
      message: 'Registration successful',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('WebAuthn registration verify error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Verification failed',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

function getUserAgentDeviceName(userAgent: string): string {
  if (userAgent.includes('iPhone')) return 'iPhone';
  if (userAgent.includes('iPad')) return 'iPad';
  if (userAgent.includes('Macintosh')) return 'Mac';
  if (userAgent.includes('Windows NT')) return 'Windows PC';
  if (userAgent.includes('Android')) return 'Android Device';
  if (userAgent.includes('Linux')) return 'Linux Device';
  return 'Unknown Device';
}