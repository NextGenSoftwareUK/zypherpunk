# 🚀 Zypherpunk Wallet - Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- OASIS API running (or use demo mode)

## Installation

```bash
cd zypherpunk-wallet-ui
npm install
```

## Configuration

Create a `.env.local` file in the project root:

```env
# OASIS API Configuration
NEXT_PUBLIC_OASIS_API_URL=http://localhost:5000
NEXT_PUBLIC_OASIS_API_VERSION=v1

# Bridge API (optional)
NEXT_PUBLIC_BRIDGE_API_URL=https://api.qstreetrwa.com/api/v1
```

## Running the Wallet

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The wallet will be available at **http://localhost:3001**

## Supported Providers

The wallet now supports these privacy-focused providers:

1. **Zcash (ZEC)** 🛡️ - Privacy-first Layer 1 with shielded transactions
2. **Aztec (AZTEC)** 🔐 - Privacy-first Layer 2 with private smart contracts
3. **Miden (MIDEN)** ✨ - Zero-knowledge VM for privacy-preserving applications
4. **Starknet (STRK)** ⚡ - ZK-powered Layer 2 for Starknet-native apps

## Features

- ✅ Multi-chain wallet management
- ✅ Privacy bridge (Zcash ↔ Aztec ↔ Miden ↔ Starknet)
- ✅ Shielded transactions
- ✅ Viewing key management
- ✅ Privacy dashboard
- ✅ Atomic swap support
- ✅ Transaction history

## First Steps

1. **Authenticate**: Login with your OASIS avatar credentials
2. **Create Wallets**: Create wallets for each provider you want to use
3. **Fund Wallets**: Add testnet funds to your wallets
4. **Try Bridge**: Test atomic swaps between chains
5. **Explore Privacy**: Check out the privacy dashboard

## Troubleshooting

### Wallet not loading?
- Check that OASIS API is running
- Verify API URL in `.env.local`
- Check browser console for errors

### Bridge not working?
- Ensure backend Starknet provider is activated
- Verify network connectivity
- Check API logs for errors

### Provider not showing?
- Clear browser cache
- Restart dev server
- Check that provider is registered in OASIS_DNA.json

## Next Steps

- Read `STARKNET_INTEGRATION.md` for Starknet-specific details
- Check `SETUP.md` for detailed setup instructions
- Review `README.md` for full documentation

---

**Status**: ✅ Ready to use with Zcash, Aztec, Miden, and **Starknet** support!



