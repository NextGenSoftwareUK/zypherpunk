# Testing Guide - UI to API Flow

## Quick Start

### 1. Start API Server
```bash
cd /Volumes/Storage/OASIS_CLEAN/ONODE/NextGenSoftware.OASIS.API.ONODE.WebAPI
dotnet run
```
API runs on: `https://localhost:5004`

### 2. Start UI Server
```bash
cd /Volumes/Storage/OASIS_CLEAN/zypherpunk-wallet-ui
npm run dev
```
UI runs on: `http://localhost:3001`

### 3. Open Browser
Navigate to: `http://localhost:3001/wallet`

## Test Flow

### Test 1: Privacy Mode Registration

1. **Open UI**: `http://localhost:3001/wallet`
2. **Click "Create avatar" tab**
3. **Privacy Mode should be ON by default** ✅
4. **Enter**:
   - Username: `privacy_test` (or leave empty for auto-generation)
   - Password: `Test123!`
5. **Click "Create avatar"**
6. **Expected**:
   - Fake email generated automatically
   - Registration succeeds
   - Auto-verification happens
   - User authenticated immediately
   - Redirected to wallet home

### Test 2: Wallet Creation

1. **After authentication**, click "Create Wallet"
2. **Choose**: "Create Unified Wallet" (recommended)
3. **Click**: "Generate Recovery Phrase"
4. **Confirm**: Check "I have saved my recovery phrase"
5. **Click**: "Create Unified Wallet"
6. **Expected**:
   - Wallets created for all chains
   - Success message shown
   - Wallets appear in wallet list

### Test 3: Single Chain Wallet

1. **Click**: "Create Wallet"
2. **Choose**: "Generate Single Chain Wallet"
3. **Select**: Solana (or any chain)
4. **Click**: "Generate Keypair"
5. **Review keys**, then click "Create Wallet"
6. **Expected**:
   - Keypair generated
   - Keys linked
   - Wallet created
   - Appears in wallet list

## API Endpoints Being Tested

### Registration
- `POST /api/avatar/register`
- Body: `{ username, email (fake), password, confirmPassword, acceptTerms }`

### Email Verification
- `GET /api/avatar/verify-email?token={token}`
- Called automatically in privacy mode

### Authentication
- `POST /api/avatar/authenticate`
- Body: `{ username, password }`

### Generate Keypair
- `POST /api/keys/generate_keypair_for_provider/{providerType}`
- Returns: `{ privateKey, publicKey }`

### Link Private Key
- `POST /api/keys/link_provider_private_key_to_avatar_by_id`
- Body: `{ AvatarID, ProviderType, ProviderKey (private key) }`
- Creates wallet, returns wallet ID

### Link Public Key
- `POST /api/keys/link_provider_public_key_to_avatar_by_id`
- Body: `{ WalletId, AvatarID, ProviderType, ProviderKey (public key), WalletAddress }`
- Completes wallet setup

## Troubleshooting

### UI Not Starting
- Check if port 3001 is available: `lsof -i :3001`
- Check logs: `tail -f /tmp/zypherpunk-ui.log`
- Try: `npm install` if dependencies missing

### API Not Responding
- Check if API is running: `lsof -i :5004`
- Check API logs in terminal
- Verify HTTPS certificate (self-signed, use `-k` flag in curl)

### Registration Fails
- Check if email format is accepted (fake emails should work)
- Check backend logs for errors
- Verify `acceptTerms: true` is sent

### Authentication Fails
- Check if avatar was verified (auto-verification should handle this)
- Check if verification token was extracted
- Check backend logs for verification errors

### Wallet Creation Fails
- Check if avatar is authenticated (JWT token present)
- Check if keys API endpoints are correct
- Check browser console for errors
- Check network tab for API responses

## Expected Console Output

### Successful Registration
```
✅ Registration successful!
   Avatar ID: bfbce7c2-708e-40ae-af79-1d2421037eaa
   Username: privacy_test
   Email: privacy_test_xyz789@privacy.local
   Verification Token: 76425A6EEDB885063DEA013FBCF6F504...
```

### Successful Auto-Verification
```
Privacy mode: Avatar auto-verified
```

### Successful Wallet Creation
```
✅ Keys linked successfully
✅ Wallet created successfully!
```

## Browser Testing

### Open Browser DevTools
- **F12** or **Right-click → Inspect**
- **Console tab**: Check for errors
- **Network tab**: Monitor API calls
- **Application tab**: Check localStorage for auth token

### Check Network Requests
1. Filter by "api" to see API calls
2. Check request/response for each call
3. Verify JWT token in Authorization header
4. Check response status codes (200 = success)

### Check Console Logs
- Look for: "Making Keys API request to: ..."
- Look for: "Keys API response status: ..."
- Look for: "Privacy mode: Avatar auto-verified"
- Look for any error messages

## Manual API Testing (cURL)

### Test Registration
```bash
curl -k -X POST "https://localhost:5004/api/avatar/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@privacy.local",
    "password": "Test123!",
    "confirmPassword": "Test123!",
    "acceptTerms": true
  }'
```

### Test Authentication
```bash
curl -k -X POST "https://localhost:5004/api/avatar/authenticate" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "password": "Test123!"
  }'
```

### Test Keypair Generation
```bash
curl -k -X POST "https://localhost:5004/api/keys/generate_keypair_for_provider/SolanaOASIS" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Success Criteria

✅ **Registration**: User can register with fake email
✅ **Auto-Verification**: Avatar auto-verified immediately
✅ **Authentication**: User can authenticate without email verification
✅ **Wallet Creation**: User can create wallets (single or unified)
✅ **Privacy Preserved**: No real identity linked to wallets

## Next Steps After Testing

1. Verify wallets appear in UI
2. Test wallet operations (send, receive)
3. Test privacy features (shielded transactions)
4. Test bridge functionality
5. Test unified wallet across chains


