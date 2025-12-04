# User Flow: Avatar Creation to Wallet Creation

## Overview

Yes, **users must create and authenticate an avatar before they can create wallets**. This document explains the complete user journey.

## Complete User Flow

### Step 1: Avatar Registration/Creation

**Location**: `AvatarAuthScreen` component (`components/wallet/AvatarAuthScreen.tsx`)

**Options**:
1. **Create New Avatar** (Register)
   - Click "Create avatar" tab
   - Fill in:
     - Username (required)
     - Email (required)
     - Password (required)
     - First Name (optional)
     - Last Name (optional)
   - Click "Create avatar"
   - **Important**: User will receive a verification email
   - **Must verify email before authentication will work**

2. **Sign In** (Login)
   - Click "Sign in" tab
   - Enter username/email and password
   - Click "Sign in"
   - **Note**: If avatar is not verified, login will fail with "Avatar has not been verified"

3. **Skip for now** (Demo Mode)
   - Uses demo avatar (no real authentication)
   - Limited functionality

### Step 2: Email Verification (Required for New Avatars)

**After Registration**:
- User receives verification email
- Email contains verification token
- User must click verification link or use token
- **Until verified, user cannot authenticate**

**Verification Endpoint**: `GET /api/avatar/verify-email?token={token}`

**Current Status**: 
- ✅ Registration works
- ⚠️ Email verification UI not yet implemented in frontend
- ⚠️ Users need to verify email manually (via email link or API call)

### Step 3: Authentication

**After Email Verification**:
- User can now sign in with username/email and password
- JWT token is received and stored
- Avatar profile is loaded
- User is redirected to wallet home screen

**What Happens**:
- `avatarAPI.login()` is called
- JWT token is stored in `avatarStore`
- Token is set for `oasisWalletAPI` and `keysAPI`
- Avatar profile is mapped to User object
- User can now access wallet features

### Step 4: Wallet Creation

**Location**: `CreateWalletScreen` component (`components/wallet/CreateWalletScreen.tsx`)

**Prerequisites Check**:
```typescript
const avatarId = avatar?.avatarId || avatar?.id;

if (!avatarId) {
  // Shows error: "Avatar Required - Please authenticate your avatar first"
  return <ErrorScreen />;
}
```

**Wallet Creation Options**:

1. **Unified Wallet** (Recommended)
   - Creates wallets for all chains from one mnemonic
   - Chains: Solana, Ethereum, Polygon, Arbitrum, Zcash, Aztec, Miden, Starknet
   - User generates and confirms 12-word recovery phrase
   - All wallets created automatically

2. **Single Chain Wallet**
   - Generate keypair for one blockchain
   - Link keys to create wallet
   - User can choose which chain

3. **Import Existing Keys**
   - User provides private/public keys
   - Keys are linked to avatar
   - Wallet is created

## Flow Diagram

```
┌─────────────────────────────────────┐
│  1. User Opens App                  │
│     → Sees AvatarAuthScreen         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. User Chooses:                   │
│     a) Create avatar (register)     │
│     b) Sign in (login)              │
│     c) Skip for now (demo)          │
└──────────────┬──────────────────────┘
               │
               ▼ (if register)
┌─────────────────────────────────────┐
│  3. Registration                    │
│     → Avatar created                │
│     → Verification email sent       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. Email Verification (REQUIRED)   │
│     → User clicks email link        │
│     → Avatar verified               │
│     ⚠️ UI not implemented yet       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  5. Authentication                  │
│     → User signs in                 │
│     → JWT token received            │
│     → Avatar profile loaded         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  6. Wallet Home Screen              │
│     → User can now create wallets   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  7. Create Wallet                   │
│     → User clicks "Create Wallet"   │
│     → CreateWalletScreen opens      │
│     → Avatar ID checked (required)  │
│     → Wallet creation proceeds      │
└─────────────────────────────────────┘
```

## Current Implementation Status

### ✅ Implemented

1. **Avatar Registration UI**
   - Registration form with all fields
   - Validation
   - Error handling

2. **Avatar Authentication UI**
   - Login form
   - Token storage
   - Avatar profile loading

3. **Wallet Creation UI**
   - All three wallet creation methods
   - Keypair generation
   - Key linking
   - Unified wallet creation

4. **Avatar ID Check**
   - CreateWalletScreen checks for avatarId
   - Shows error if avatar not authenticated

### ⚠️ Missing/Incomplete

1. **Email Verification UI**
   - No UI component for email verification
   - Users must verify via email link or API call
   - Should add verification screen/flow

2. **Registration Success Flow**
   - After registration, should show "Check your email" message
   - Should provide verification token input option
   - Should handle verification status

3. **Error Messages**
   - Should show clearer message if avatar not verified
   - Should guide user to verification step

## Required Fields for Registration

From `AvatarRegistrationRequest`:
- `username` (required)
- `email` (required)
- `password` (required)
- `confirmPassword` (required - handled by backend)
- `firstName` (optional)
- `lastName` (optional)
- `title` (optional - defaults to "Mr")
- `acceptTerms` (required - must be true)

## Security Flow

1. **Registration** → Creates avatar, sends verification email
2. **Email Verification** → Activates avatar account
3. **Authentication** → Receives JWT token
4. **Wallet Creation** → Requires authenticated avatar (avatarId)

## Recommendations

### Immediate Improvements

1. **Add Email Verification UI**
   - Create `EmailVerificationScreen` component
   - Allow user to enter verification token
   - Show verification status
   - Auto-redirect after successful verification

2. **Improve Registration Flow**
   - Show "Check your email" message after registration
   - Provide option to enter verification token
   - Handle verification errors gracefully

3. **Better Error Messages**
   - "Avatar not verified" → Show verification screen
   - "Avatar required" → Redirect to authentication
   - Clear guidance on next steps

### Future Enhancements

1. **Auto-verification**
   - Check verification status automatically
   - Show verification prompt if needed

2. **Resend Verification Email**
   - Add "Resend email" button
   - Show cooldown timer

3. **Skip Verification (Development)**
   - Option to skip verification in dev mode
   - For testing purposes

## Testing Checklist

- [ ] User can register new avatar
- [ ] Verification email is received
- [ ] User can verify email (via link or token)
- [ ] User can authenticate after verification
- [ ] User cannot authenticate before verification
- [ ] User can create wallet after authentication
- [ ] User cannot create wallet without avatar
- [ ] Error messages are clear and helpful

## Related Files

- `components/wallet/AvatarAuthScreen.tsx` - Registration/Login UI
- `lib/avatarApi.ts` - Avatar API client
- `lib/avatarStore.ts` - Avatar state management
- `components/wallet/CreateWalletScreen.tsx` - Wallet creation UI
- `lib/keysApi.ts` - Keys API client

## Summary

**Yes, users must create an avatar first.** The flow is:

1. **Register** → Create avatar account
2. **Verify Email** → Activate account (currently manual)
3. **Authenticate** → Sign in and get JWT token
4. **Create Wallet** → Link keys to avatar

The UI already handles steps 1, 3, and 4. Step 2 (email verification) needs UI implementation for a complete user experience.


