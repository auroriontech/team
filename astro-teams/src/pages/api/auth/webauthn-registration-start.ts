import type { APIRoute } from 'astro';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { db } from '../../../db/index.js';
import { webauthnChallenges } from '../../../db/schema.js';
import { nanoid } from 'nanoid';

// WebAuthn configuration
const rpName = import.meta.env.WEBAUTHN_RP_NAME || 'Aurorion Teams';
const rpID = import.meta.env.WEBAUTHN_RP_ID || 'localhost';
const origin = import.meta.env.WEBAUTHN_ORIGIN || `https://${rpID}`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Generate registration options
    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new Uint8Array(32), // Will be updated with actual user ID later
      userName: 'user@aurorion.teams', // Placeholder, will be updated during onboarding
      userDisplayName: 'Aurorion User',
      timeout: 60000,
      attestationType: 'none',
      excludeCredentials: [], // TODO: Exclude existing credentials for the user
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform', // Prefer platform authenticators (TouchID, FaceID, Windows Hello)
      },
      supportedAlgorithmIDs: [-7, -257], // ES256 and RS256
    });

    // Store the challenge in the database
    const challengeId = nanoid();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    await db.insert(webauthnChallenges).values({
      id: challengeId,
      challenge: options.challenge,
      type: 'registration',
      userId: null, // Will be set during onboarding
      ipAddress: clientIP,
      userAgent,
      expiresAt,
    });

    // Return the challenge ID along with the options
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
    console.error('WebAuthn registration start error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to start registration',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};