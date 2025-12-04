# Wallet Address Validation & Testing Guide

## Current Status

### ⚠️ Important Finding

The wallets created through the OASIS API may **not be generating actual blockchain addresses** for all providers. Here's what we know:

1. **KeyManager.GenerateKeyPair()** - Generates generic cryptographic keypairs (private/public keys)
2. **Wallet Address Generation** - The wallet addresses stored may be:
   - Generic addresses derived from public keys (not blockchain-specific)
   - Placeholder addresses
   - Actual blockchain addresses (needs verification)

## Testing Required

### 1. Verify Address Formats

Each blockchain has specific address formats:

#### Zcash
- **Testnet**: Addresses start with `t` (transparent) or `z`/`zs1` (shielded)
- **Mainnet**: Addresses start with `t` (transparent) or `z`/`zs1` (shielded)
- Example: `t1Hsc1LR1yFM6d3d6csVz5m4z2bKzK8yN1x` (testnet transparent)
- Example: `zs1test...` (shielded, 75 chars)

#### Starknet
- **Format**: Hex string starting with `0x`, typically 66 characters
- **Testnet**: Same format, different network
- Example: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

#### Aztec
- **Format**: May use Ethereum-style addresses (0x + 40 hex chars)
- **Testnet**: Uses Aztec testnet network
- Example: `0x1234567890123456789012345678901234567890`

#### Miden
- **Format**: May use Ethereum-style addresses or custom format
- **Testnet**: Uses Miden testnet network
- Example: `0x1234567890123456789012345678901234567890`

### 2. Testnet Configuration

Check `OASIS_DNA.json` for testnet settings:

```json
{
  "StorageProviders": {
    "ZcashOASIS": {
      "Network": "testnet",  // or "mainnet"
      "RpcUrl": "http://localhost:8232"
    },
    "StarknetOASIS": {
      "Network": "alpha-goerli",  // testnet
      "RpcUrl": "..."
    },
    "AztecOASIS": {
      "Network": "testnet",
      "NodeUrl": "https://aztec-testnet-fullnode.zkv.xyz"
    },
    "MidenOASIS": {
      "Network": "testnet",
      "ApiBaseUrl": "https://testnet.miden.xyz"
    }
  }
}
```

**Current Status**: 
- ✅ Ethereum: Sepolia testnet (ChainId: 11155111)
- ✅ Arbitrum: Sepolia testnet (ChainId: 421614)
- ✅ Solana: Devnet
- ❓ Zcash: Not configured in OASIS_DNA.json
- ❓ Starknet: Not configured in OASIS_DNA.json
- ❓ Aztec: Not configured in OASIS_DNA.json
- ❓ Miden: Not configured in OASIS_DNA.json

## How to Test

### Step 1: Check Address Format

Run the test script:
```bash
cd zypherpunk-wallet-ui
./test-wallet-addresses.sh
```

This will:
- Fetch all wallets for your avatar
- Validate address formats for each provider
- Check testnet configuration

### Step 2: Verify Addresses Can Receive Tokens

#### Zcash Testnet
1. Get testnet ZEC from a faucet (if available)
2. Send a small amount to your Zcash wallet address
3. Check if the transaction appears on Zcash testnet explorer

#### Starknet Testnet
1. Get testnet ETH from Starknet faucet
2. Send to your Starknet wallet address
3. Check on [Starknet testnet explorer](https://sepolia.starkscan.co/)

#### Aztec Testnet
1. Use Aztec testnet to send tokens
2. Verify transaction appears in Aztec testnet

#### Miden Testnet
1. Use Miden testnet to send tokens
2. Verify transaction appears in Miden testnet

### Step 3: Test Sending Tokens

Use the OASIS API to send tokens:

```bash
curl -X POST https://localhost:5004/api/wallet/send_token \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fromWalletAddress": "YOUR_WALLET_ADDRESS",
    "toWalletAddress": "RECIPIENT_ADDRESS",
    "amount": 0.001,
    "providerType": "ZcashOASIS"
  }'
```

## Potential Issues

### Issue 1: Addresses Not Blockchain-Specific
**Problem**: The `KeyManager.GenerateKeyPair()` method generates generic keypairs, not blockchain-specific addresses.

**Solution**: Each provider needs to implement address derivation:
- Zcash: Derive transparent or shielded addresses from public key
- Starknet: Derive contract address from public key
- Aztec: Derive account address from public key
- Miden: Derive account address from public key

### Issue 2: Testnet Not Configured
**Problem**: Providers may default to mainnet or not be configured.

**Solution**: Add testnet configuration to `OASIS_DNA.json` for each provider.

### Issue 3: Address Validation Missing
**Problem**: No validation that addresses are correct format before storing.

**Solution**: Add address validation in `WalletManager` when creating wallets.

## Next Steps

1. ✅ Create test script to validate addresses
2. ⏳ Run test script to check current wallet addresses
3. ⏳ Verify if addresses are valid blockchain addresses
4. ⏳ Test sending/receiving tokens on testnet
5. ⏳ Configure testnet for all providers
6. ⏳ Add address validation

## Resources

- [Zcash Testnet](https://zcash.readthedocs.io/en/latest/rtd_pages/testnet.html)
- [Starknet Testnet](https://docs.starknet.io/documentation/architecture_and_concepts/Network_Architecture/testnet/)
- [Aztec Testnet](https://docs.aztec.network/)
- [Miden Testnet](https://docs.polygon.technology/miden/)

