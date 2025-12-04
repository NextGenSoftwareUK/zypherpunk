# Authentication & Wallet API Connection Guide

This guide explains how to authenticate with the OASIS API and access the Wallet API in the zypherpunk-wallet-ui.

## Overview

The authentication flow connects three main components:
1. **Avatar API** - Handles user authentication
2. **Wallet API** - Manages multi-chain wallets
3. **Keys API** - Links private/public keys to create wallets

## Authentication Flow

### Step 1: User Authentication

When a user logs in through `AvatarAuthScreen`, the following happens:

```typescript
// User enters credentials
await avatarAPI.login(username, password)

// Response includes:
{
  avatar: { avatarId, username, email, ... },
  jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: null,
  expiresIn: undefined
}
```

### Step 2: Token Management

The JWT token is automatically set for all API services:

```typescript
// In avatarStore.ts - applyAuthState()
oasisWalletAPI.setAuthToken(jwtToken);
keysAPI.setAuthToken(jwtToken);
```

### Step 3: Wallet API Access

Once authenticated, the Wallet API can be accessed:

```typescript
// Load wallets for authenticated avatar
const result = await oasisWalletAPI.loadWalletsById(avatarId);

// Response structure:
{
  isError: false,
  result: {
    SolanaOASIS: [/* wallets */],
    EthereumOASIS: [/* wallets */],
    // ... other providers
  }
}
```

## Using metabricks_admin for Testing

### Credentials
- **Username:** `metabricks_admin`
- **Password:** `Uppermall1!`

### Quick Test

1. Open the wallet UI at `http://localhost:3001/wallet`
2. Click "Sign in"
3. Enter credentials:
   - Username: `metabricks_admin`
   - Password: `Uppermall1!`
4. After successful login, wallets should automatically load

### Testing via Script

Run the test script:

```bash
cd zypherpunk-wallet-ui
npx tsx scripts/test-auth-wallet.ts
```

Or with custom API URL:

```bash
NEXT_PUBLIC_OASIS_API_URL=https://api.oasisweb4.one npx tsx scripts/test-auth-wallet.ts
```

## API Configuration

### Environment Variables

Set the OASIS API base URL:

```bash
# .env.local
NEXT_PUBLIC_OASIS_API_URL=https://api.oasisweb4.one
```

Or for local development:

```bash
NEXT_PUBLIC_OASIS_API_URL=http://localhost:5003
```

### Proxy Mode

In development, the UI uses proxy routes to avoid CORS issues:

- **Authentication:** `/api/authenticate` → OASIS API
- **Wallet API:** `/api/proxy/wallet/[...path]` → OASIS API
- **Keys API:** Direct calls (with CORS handling)

## Wallet API Endpoints

### Load Wallets

```typescript
// By Avatar ID
await oasisWalletAPI.loadWalletsById(avatarId, providerType?);

// By Username
await oasisWalletAPI.loadWalletsByUsername(username, providerType?);

// By Email
await oasisWalletAPI.loadWalletsByEmail(email, providerType?);
```

### Send Transaction

```typescript
await oasisWalletAPI.sendToken({
  fromAvatarId: avatarId,
  toAvatarId: recipientAvatarId,
  amount: "1.0",
  token: "SOL",
  providerType: ProviderType.SolanaOASIS,
  // ... other params
});
```

### Import Wallet

```typescript
await oasisWalletAPI.importWalletByPrivateKeyById(avatarId, {
  providerType: ProviderType.EthereumOASIS,
  privateKey: "0x...",
  // ... other params
});
```

## Keys API Integration

The Keys API is used to create wallets by linking keys:

### Link Private Key

```typescript
await keysAPI.linkPrivateKey(
  avatarId,
  ProviderType.SolanaOASIS,
  privateKey
);
```

### Link Public Key

```typescript
await keysAPI.linkPublicKey(
  avatarId,
  ProviderType.SolanaOASIS,
  publicKey,
  walletAddress
);
```

### Generate Keypair

```typescript
const result = await keysAPI.generateKeypair(
  avatarId,
  ProviderType.SolanaOASIS
);
// Returns: { privateKey, publicKey, walletAddress }
```

## Troubleshooting

### Authentication Fails

**Issue:** "Authentication failed" or "No token received"

**Solutions:**
1. Check API URL is correct: `NEXT_PUBLIC_OASIS_API_URL`
2. Verify credentials are correct
3. Check network connectivity to API
4. For localhost HTTPS, ensure proxy is working

### Wallet API Returns HTML

**Issue:** API returns HTML instead of JSON (bot protection)

**Solutions:**
1. Use proxy routes in development
2. Check API server is running
3. Verify JWT token is valid and not expired
4. Check Authorization header is being sent

### No Wallets Found

**Issue:** `loadWallets` returns empty or "Avatar Not Found"

**Solutions:**
1. This is normal for new avatars - create wallets first
2. Verify avatar ID is correct
3. Check if wallets exist in database
4. Use "Create Wallet" flow to generate wallets

### Token Expired

**Issue:** API calls return 401 Unauthorized

**Solutions:**
1. Tokens expire after ~15 minutes
2. Re-authenticate to get new token
3. Implement token refresh (future enhancement)

## Verification Checklist

- [ ] Authentication endpoint responds correctly
- [ ] JWT token is received and stored
- [ ] Token is set for Wallet API and Keys API
- [ ] Wallet API calls include Authorization header
- [ ] Wallets can be loaded for authenticated avatar
- [ ] Wallet creation flow works (Keys API integration)
- [ ] Transactions can be sent (if wallets exist)

## Next Steps

1. **Test Authentication:** Use the test script or UI login
2. **Create Wallets:** Use the "Create Wallet" screen
3. **Load Wallets:** Verify wallets appear after creation
4. **Send Transactions:** Test sending tokens (if wallets have balance)

## Related Files

- `lib/avatarApi.ts` - Avatar authentication
- `lib/api.ts` - Wallet API client
- `lib/keysApi.ts` - Keys API client
- `lib/avatarStore.ts` - Authentication state management
- `lib/store.ts` - Wallet state management
- `components/wallet/AvatarAuthScreen.tsx` - Login UI
- `app/api/authenticate/route.ts` - Authentication proxy
- `app/api/proxy/wallet/[...path]/route.ts` - Wallet API proxy


