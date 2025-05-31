import type { APIRoute } from 'astro';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { db, WebAuthnChallenges, WebAuthnCredentials } from 'astro:db';
import { nanoid } from 'nanoid';

// WebAuthn configuration
const rpID = import.meta.env.WEBAUTHN_RP_ID || 'localhost';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Extract request metadata
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Fetch existing credentials (optimized query)
    const credentials = await db.select({
      id: WebAuthnCredentials.id,
      transports: WebAuthnCredentials.transports,
    }).from(WebAuthnCredentials);

    // Generate authentication options with optimized config
    const options = await generateAuthenticationOptions({
      rpID,
      timeout: 60000,
      allowCredentials: credentials.map(cred => ({
        id: Buffer.from(cred.id, 'base64url'),
        type: 'public-key' as const,
        transports: cred.transports ? JSON.parse(cred.transports) : undefined,
      })),
      userVerification: 'preferred',
    });

    // Store challenge with 5-minute expiry
    const challengeId = nanoid();
    await db.insert(WebAuthnChallenges).values({
      id: challengeId,
      challenge: options.challenge,
      type: 'authentication',
      userId: null,
      ipAddress: clientIP,
      userAgent,
      expiresAt: new Date(Date.now() + 300000).toISOString(),
    });

    return new Response(JSON.stringify({
      success: true,
      options,
      challengeId,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('WebAuthn start error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Authentication start failed',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};