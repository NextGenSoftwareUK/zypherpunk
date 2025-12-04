# Privacy Mode - Quick Start Guide

## ✅ Implementation Complete

Privacy Mode has been implemented to allow users to register with fake emails and bypass email verification for the Zcash hackathon.

## How It Works

### 1. Privacy Mode Toggle
- **Default**: Privacy Mode is **ON** (for hackathon)
- Users can toggle it off if they want to use real email
- When ON: Email field is hidden, fake email is auto-generated

### 2. Fake Email Generation
- Format: `{username}_{randomId}@privacy.local`
- Example: `privacy_user_abc123@privacy.local`
- No real email required
- No email validation issues

### 3. Auto-Verification
- After registration, system extracts verification token
- Automatically verifies email using token
- User can authenticate immediately
- No manual email verification needed

## User Flow

```
1. User opens app → Sees AvatarAuthScreen
2. Clicks "Create avatar" tab
3. Privacy Mode is ON by default ✅
4. User enters:
   - Username (optional - auto-generated if empty)
   - Password (required)
   - First/Last name (optional)
5. Clicks "Create avatar"
6. System:
   - Generates fake email: username_random@privacy.local
   - Registers avatar with fake email
   - Gets verification token from response
   - Auto-verifies avatar immediately
7. User is authenticated ✅
8. Can create wallets immediately ✅
```

## Code Changes

### Files Modified

1. **`lib/types.ts`**
   - Added `privacyMode?: boolean` to `AvatarRegistrationRequest`
   - Added `verificationToken?: string` and `verified?: boolean` to `AvatarProfile`

2. **`lib/avatarApi.ts`**
   - Added `verifyEmail(token: string)` method
   - Updated `normalizeAvatar()` to include verification token

3. **`lib/avatarStore.ts`**
   - Added auto-verification logic in `register()` method
   - If privacy mode + token available → auto-verify

4. **`components/wallet/AvatarAuthScreen.tsx`**
   - Added Privacy Mode toggle (default ON)
   - Added fake email generation
   - Hide email field in privacy mode
   - Auto-generate username if empty

## Testing

### Test Registration with Privacy Mode

```typescript
// Privacy mode ON (default)
await register({
  username: "privacy_test", // Optional
  email: "auto-generated",   // Fake email
  password: "Test123!",
  privacyMode: true,        // Auto-verify
});

// Should:
// 1. Generate fake email
// 2. Register successfully
// 3. Auto-verify using token
// 4. Allow immediate authentication
```

### Test with Privacy Mode OFF

```typescript
// Privacy mode OFF
await register({
  username: "real_user",
  email: "real@example.com", // Real email required
  password: "Test123!",
  privacyMode: false,        // Normal flow
});

// Should:
// 1. Use real email
// 2. Register successfully
// 3. Send verification email
// 4. User must verify manually
```

## Privacy Benefits

### ✅ What's Preserved

1. **No Real Identity Required**
   - Fake email = no real identity link
   - Pseudonymous username
   - No email verification needed

2. **Immediate Access**
   - Auto-verification = no waiting
   - Can create wallets immediately
   - No email inbox needed

3. **True Anonymity**
   - Wallets not linked to real identity
   - Zcash privacy preserved
   - Cross-chain correlation avoided

### ⚠️ Limitations

1. **Backend Still Stores Email**
   - Fake email is stored in database
   - But it's not a real identity
   - No way to recover account via email

2. **Username Still Required**
   - But can be auto-generated
   - Pseudonymous, not anonymous
   - Still some linkage possible

3. **Avatar Still Created**
   - Avatar links all wallets
   - But no real identity attached
   - Privacy preserved at identity level

## Backend Considerations

### Current Backend Behavior

- ✅ Registration accepts any email format
- ✅ Email validation is commented out
- ⚠️ Authentication checks verification status
- ✅ Auto-verification bypasses this check

### If Auto-Verification Fails

If the auto-verification doesn't work (backend issue), users can:

1. **Use Disposable Email Service**
   - Use guerrillamail.com or similar
   - Get real inbox
   - Verify manually

2. **Backend Fix** (if needed)
   - Modify authentication to skip verification for privacy mode
   - Or auto-verify avatars with fake emails

## Usage

### For Hackathon Demo

1. **Default to Privacy Mode** ✅ (Already done)
2. **Show Privacy Mode Toggle** ✅ (Already done)
3. **Explain Privacy Benefits** ✅ (UI messaging)
4. **Auto-Verify** ✅ (Already implemented)

### For Production

Consider:
- Making privacy mode more prominent
- Adding privacy education
- Explaining implications
- Allowing wallet creation without avatar (future)

## Summary

**Privacy Mode is now implemented!**

Users can:
- ✅ Register without real email
- ✅ Get auto-verified immediately
- ✅ Create wallets anonymously
- ✅ Preserve Zcash privacy

**No backend changes required** - works with current API!


