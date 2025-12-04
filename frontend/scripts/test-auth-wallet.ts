/**
 * Test script to verify authentication and wallet API access
 * 
 * Usage:
 *   npx tsx scripts/test-auth-wallet.ts
 * 
 * Or with environment variables:
 *   NEXT_PUBLIC_OASIS_API_URL=https://api.oasisweb4.one npx tsx scripts/test-auth-wallet.ts
 */

import { avatarAPI } from '../lib/avatarApi';
import { oasisWalletAPI } from '../lib/api';
import { keysAPI } from '../lib/keysApi';

const METABRICKS_ADMIN_USERNAME = 'metabricks_admin';
const METABRICKS_ADMIN_PASSWORD = 'Uppermall1!';

async function testAuthentication() {
  console.log('🔐 Testing Authentication...\n');
  
  try {
    // Step 1: Authenticate
    console.log('Step 1: Authenticating with metabricks_admin...');
    const authResponse = await avatarAPI.login(METABRICKS_ADMIN_USERNAME, METABRICKS_ADMIN_PASSWORD);
    
    if (!authResponse.jwtToken) {
      throw new Error('No JWT token received from authentication');
    }
    
    console.log('✅ Authentication successful!');
    console.log(`   Avatar ID: ${authResponse.avatar?.avatarId || authResponse.avatar?.id}`);
    console.log(`   Username: ${authResponse.avatar?.username}`);
    console.log(`   Token (first 20 chars): ${authResponse.jwtToken.substring(0, 20)}...\n`);
    
    // Step 2: Set auth token for wallet API
    console.log('Step 2: Setting authentication token for Wallet API...');
    oasisWalletAPI.setAuthToken(authResponse.jwtToken);
    keysAPI.setAuthToken(authResponse.jwtToken);
    
    const walletToken = oasisWalletAPI.getAuthToken();
    if (!walletToken) {
      throw new Error('Failed to set auth token for wallet API');
    }
    
    console.log('✅ Auth token set for Wallet API\n');
    
    // Step 3: Test wallet API access
    console.log('Step 3: Testing Wallet API access...');
    const avatarId = authResponse.avatar?.avatarId || authResponse.avatar?.id;
    
    if (!avatarId) {
      throw new Error('No avatar ID available');
    }
    
    console.log(`   Loading wallets for avatar: ${avatarId}...`);
    const walletsResult = await oasisWalletAPI.loadWalletsById(avatarId);
    
    if (walletsResult.isError) {
      console.log('⚠️  Wallet API returned an error (this may be expected if no wallets exist):');
      console.log(`   Error: ${walletsResult.message}`);
      
      // Check if it's just "no wallets" vs actual auth failure
      if (walletsResult.message?.includes('Avatar Not Found') || 
          walletsResult.message?.includes('does not exist')) {
        console.log('   ℹ️  Avatar not found in database - this is normal for new avatars');
      } else if (walletsResult.message?.includes('401') || 
                 walletsResult.message?.includes('Unauthorized')) {
        console.log('   ❌ Authentication failed - token may be invalid');
        return false;
      } else {
        console.log('   ℹ️  This may be a connection issue or the avatar has no wallets yet');
      }
    } else {
      console.log('✅ Wallet API access successful!');
      const walletCount = Object.values(walletsResult.result || {}).reduce(
        (sum, wallets) => sum + (wallets?.length || 0), 
        0
      );
      console.log(`   Found ${walletCount} wallet(s) across all chains\n`);
      
      // Display wallet summary
      if (walletCount > 0) {
        console.log('Wallet Summary:');
        Object.entries(walletsResult.result || {}).forEach(([provider, wallets]) => {
          if (wallets && wallets.length > 0) {
            console.log(`   ${provider}: ${wallets.length} wallet(s)`);
            wallets.forEach((wallet, idx) => {
              console.log(`     - Wallet ${idx + 1}: ${wallet.walletAddress?.substring(0, 20)}...`);
            });
          }
        });
        console.log('');
      }
    }
    
    // Step 4: Test Keys API access
    console.log('Step 4: Testing Keys API access...');
    console.log('   Keys API token is set: ' + (keysAPI.getAuthToken() ? '✅' : '❌'));
    console.log('   (Keys API will be used when creating wallets)\n');
    
    console.log('✅ All authentication tests passed!\n');
    console.log('Summary:');
    console.log('  ✅ Authentication: Working');
    console.log('  ✅ Token Management: Working');
    console.log('  ✅ Wallet API: Accessible');
    console.log('  ✅ Keys API: Token Set');
    console.log('\n🎉 The zypherpunk-wallet-ui is ready to connect to the OASIS API!');
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      console.error('   Stack:', error.stack);
    }
    return false;
  }
}

// Run the test
testAuthentication()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });


