# Local D1 Database Setup for Testing

This guide shows how to run Cloudflare D1 database locally for development and testing of the passkey authentication system.

## Quick Setup

1. **Initialize local D1 database:**
   ```bash
   npm run db:local
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Run passkey tests:**
   ```bash
   npm run test:passkey
   ```

## Database Commands

- `npm run db:local` - Create and migrate local D1 database
- `npm run db:studio` - Open Drizzle Studio to inspect database
- `wrangler d1 execute aurorion-teams --local --command="SELECT * FROM user_profiles"` - Query database directly

## Available Tables

After running `npm run db:local`, these tables are available:

### Core Tables (from first migration)
- `team_members` - AI agent team members
- `projects` - Project management
- `project_members` - Many-to-many project assignments
- `activity_logs` - Activity tracking
- `metrics` - Performance metrics

### WebAuthn Tables (from second migration)
- `user_profiles` - User account information
- `webauthn_credentials` - Stored passkey credentials
- `webauthn_challenges` - Temporary authentication challenges

## Testing Passkey Flow

1. **Start the dev server:** `npm run dev`
2. **Navigate to:** http://localhost:4322/login
3. **Test UI elements:** The passkey button should be visible
4. **Run automated tests:** `npm run test -- tests/passkey-ui.spec.js`

## Environment Variables

Create `.dev.vars` file with:
```
WEBAUTHN_RP_NAME="Aurorion Teams"
WEBAUTHN_RP_ID="localhost"  
WEBAUTHN_ORIGIN="http://localhost:4322"
NODE_ENV="development"
```

## Database Connection

The app automatically detects if D1 is available:
- **With D1:** Uses real local SQLite database via Wrangler
- **Without D1:** Falls back to mock database for basic testing

## Production vs Development

- **Development:** Uses local SQLite file in `.wrangler/state/`
- **Production:** Uses Cloudflare D1 remote database
- **Testing:** Can use either local D1 or mocks depending on setup

## Troubleshooting

If you get database connection errors:
1. Run `npm run db:local` to ensure tables exist
2. Check that Wrangler is properly configured in `wrangler.toml`
3. Verify `.dev.vars` has correct environment variables
4. The app will fall back to mocks if D1 is unavailable

## Passkey Testing Notes

- **HTTPS Required:** Passkeys work on localhost (HTTP) for development
- **Browser Support:** All modern browsers support WebAuthn/passkeys
- **Device Support:** Works with TouchID, FaceID, Windows Hello, security keys
- **Fallback:** Traditional email/password login remains available