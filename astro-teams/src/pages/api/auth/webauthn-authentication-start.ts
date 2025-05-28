import type { APIRoute } from 'astro';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { db } from '../../../db/index.js';
import { webauthnChallenges, webauthnCredentials } from '../../../db/schema.js';
import { nanoid } from 'nanoid';

// WebAuthn configuration
const rpID = import.meta.env.WEBAUTHN_RP_ID || 'localhost';

export const POST: APIRoute = async ({ request }) => {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get all existing credentials to allow login from any registered device
    const existingCredentials = await db.select({
      id: webauthnCredentials.id,
      transports: webauthnCredentials.transports,
    }).from(webauthnCredentials);

    // Convert credential data for WebAuthn
    const allowCredentials = existingCredentials.map(cred => ({
      id: Buffer.from(cred.id, 'base64url'),
      type: 'public-key' as const,
      transports: cred.transports ? JSON.parse(cred.transports) : undefined,
    }));

    // Generate authentication options
    const options = await generateAuthenticationOptions({
      rpID,
      timeout: 60000,
      allowCredentials,
      userVerification: 'preferred',
    });

    // Store the challenge in the database
    const challengeId = nanoid();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    await db.insert(webauthnChallenges).values({
      id: challengeId,
      challenge: options.challenge,
      type: 'authentication',
      userId: null, // Will be determined after verification
      ipAddress: clientIP,
      userAgent,
      expiresAt,
    });

    return new Response(JSON.stringify({
      success: true,
      options,
      challengeId,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('WebAuthn authentication start error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to start authentication',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};