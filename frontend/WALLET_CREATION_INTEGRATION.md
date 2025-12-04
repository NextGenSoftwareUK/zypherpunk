# Wallet Creation Integration - zypherpunk-wallet-ui

## Overview

This document explains how wallet creation is integrated into the zypherpunk-wallet-ui frontend, connecting the UI components to the OASIS Keys API backend.

## Architecture

### Components

1. **CreateWalletScreen** (`components/wallet/CreateWalletScreen.tsx`)
   - Main UI component for wallet creation
   - Supports three methods:
     - **Unified Wallet**: Create wallets for all chains from one mnemonic
     - **Generate Single Chain**: Generate keypair and create wallet for one chain
     - **Import Existing Keys**: Link existing private/public keys

2. **keysApi** (`lib/keysApi.ts`)
   - API client for the OASIS Keys API
   - Handles authentication, keypair generation, and key linking

3. **unifiedWallet** (`lib/unifiedWallet.ts`)
   - Logic for creating unified wallets across multiple chains
   - Generates wallets for: Solana, Ethereum, Polygon, Arbitrum, Zcash, Aztec, Miden, Starknet

### Flow

#### Single Chain Wallet Creation

1. User selects "Generate Single Chain Wallet"
2. User selects blockchain (Solana, Ethereum, etc.)
3. User clicks "Generate Keypair"
4. Frontend calls `keysAPI.generateKeypair(avatarId, providerType)`
5. Backend generates keypair and returns `{ privateKey, publicKey }`
6. Keys are displayed to user (private key hidden by default)
7. User clicks "Create Wallet"
8. Frontend calls `keysAPI.linkKeys({ avatarId, providerType, privateKey, publicKey, walletAddress })`
9. **Internal flow in `linkKeys`**:
   - First calls `linkPrivateKey()` - creates wallet, returns wallet ID
   - Then calls `linkPublicKey(walletId, ...)` - links public key to the wallet
10. Wallet is created and user is redirected to home screen

#### Unified Wallet Creation

1. User selects "Create Unified Wallet"
2. User clicks "Generate Recovery Phrase"
3. Frontend generates 12-word mnemonic
4. User confirms they've saved the phrase
5. User clicks "Create Unified Wallet"
6. Frontend calls `createUnifiedWallet(avatarId, mnemonic)`
7. **Internal flow**:
   - For each supported provider:
     - Generate keypair via `keysAPI.generateKeypair()`
     - Link keys via `keysAPI.linkKeys()`
     - Load created wallet
8. All wallets are created and user sees success message

## API Integration Details

### Endpoints Used

1. **Generate Keypair**
   - `POST /api/keys/generate_keypair_for_provider/{providerType}`
   - Returns: `{ privateKey, publicKey }`

2. **Link Private Key**
   - `POST /api/keys/link_provider_private_key_to_avatar_by_id`
   - Body: `{ AvatarID, ProviderType, ProviderKey (private key) }`
   - **Omits WalletId to create new wallet**
   - Returns: `{ walletId, id, ... }` (wallet object)

3. **Link Public Key**
   - `POST /api/keys/link_provider_public_key_to_avatar_by_id`
   - Body: `{ WalletId, AvatarID, ProviderType, ProviderKey (public key), WalletAddress }`
   - **Requires WalletId from private key linking step**
   - Returns: `{ walletId, id, ... }` (wallet object)

### Security Flow

The Keys API requires a two-step process for security:

1. **Private Key First**: Link private key → Creates wallet → Returns wallet ID
2. **Public Key Second**: Link public key using wallet ID → Completes wallet setup

This ensures:
- Private keys are handled securely
- Wallet is created before public key is linked
- Wallet ID is required for public key linking (prevents orphaned keys)

## Recent Fixes

### Fixed Issues

1. **API Endpoint Path**
   - Changed from `/api/key/` to `/api/keys/` (correct plural)

2. **Generate Keypair Method**
   - Changed from POST with body to POST with provider type in URL path
   - `POST /api/keys/generate_keypair_for_provider/{providerType}`

3. **Link Keys Flow**
   - Updated to properly handle two-step process:
     - Link private key first (omits WalletId to create new wallet)
     - Extract wallet ID from response
     - Link public key second (uses wallet ID from step 1)

4. **Response Handling**
   - Added handling for nested result structure
   - Properly extracts wallet ID from private key linking response

5. **Proxy Support**
   - Added proxy support for development (avoids CORS issues)
   - Uses `/api/proxy/keys/...` in development mode

## Testing

### Manual Testing Steps

1. **Authenticate**:
   - Login with `OASIS_ADMIN` / `Uppermall1!`
   - Verify JWT token is set

2. **Create Single Chain Wallet**:
   - Navigate to wallet page
   - Click "Create Wallet"
   - Select "Generate Single Chain Wallet"
   - Select blockchain (e.g., Solana)
   - Click "Generate Keypair"
   - Verify keys are displayed
   - Click "Create Wallet"
   - Verify wallet appears in wallet list

3. **Create Unified Wallet**:
   - Navigate to wallet page
   - Click "Create Wallet"
   - Select "Create Unified Wallet"
   - Click "Generate Recovery Phrase"
   - Verify mnemonic is displayed
   - Check confirmation checkbox
   - Click "Create Unified Wallet"
   - Verify all wallets are created

## Known Issues

1. **Storage Provider Error**
   - Wallet creation succeeds but shows error about `LocalFileOASIS` provider not registered
   - This is a backend configuration issue, not a frontend problem
   - Wallets are still created successfully

2. **Mnemonic Generation**
   - Current implementation uses a simple word list
   - Should use proper BIP39 library for production
   - See `unifiedWallet.ts` for TODO

## Next Steps

1. ✅ Fix API endpoint paths
2. ✅ Fix keypair generation method
3. ✅ Fix two-step key linking flow
4. ⚠️ Test with actual backend
5. ⚠️ Add proper BIP39 mnemonic generation
6. ⚠️ Add error handling for edge cases
7. ⚠️ Add loading states during wallet creation
8. ⚠️ Add success animations/feedback

## Files Modified

- `lib/keysApi.ts` - Fixed API endpoints and two-step linking flow
- `components/wallet/CreateWalletScreen.tsx` - Already has UI (no changes needed)
- `lib/unifiedWallet.ts` - Already has logic (no changes needed)

## Related Documentation

- `WALLET_CREATION_FLOW.md` - Backend API flow documentation
- `UNIFIED_WALLET_FEATURE.md` - Unified wallet feature details
- `WALLET_CREATION_IMPLEMENTATION.md` - Original implementation notes


