# Zypherpunk Wallet - OASIS Submission

> A privacy-first, cross-chain wallet solution addressing 7 tracks of the Zypherpunk Hackathon

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![.NET](https://img.shields.io/badge/.NET-8-purple)](https://dotnet.microsoft.com/)

## Overview

The **Zypherpunk Wallet** is a privacy-first wallet solution built on the OASIS platform. 
It provides a unified interface for managing assets across multiple privacy-focused blockchains, with built-in support for private bridges, stablecoin minting, and advanced privacy features.

**Built for:** [Zypherpunk Hackathon](https://zypherpunk.xyz/) (Nov 12 - Dec 1, 2025)

## Why This Solution Matters


### 1. Solving Provider Ecosystem Fragmentation

**The Problem:**
- Every blockchain ecosystem lives in isolation
- Users need multiple wallets, remember different seed phrases, learn different UIs
- Privacy chains can't easily communicate with each other or with public chains
- Liquidity is fragmented across isolated ecosystems

**Our Solution:**
- Single wallet for 6 chains (Zcash, Aztec, Miden, Starknet, Solana, Ethereum)
- One keypair works across all chains via unified address derivation
- Cross-chain bridges with privacy preserved
- OASIS provider abstraction connects ecosystems without breaking them

**Impact:**
- Increased adoption for each chain through unified interface
- More liquidity as assets flow between chains
- Interoperability while preserving each chain's unique features
- Easier onboarding for new users

### 2. Making Privacy-First DeFi Accessible

**The Problem:**
- Privacy chains have amazing technology but difficult UX
- Learning curve is steep: shielded addresses, viewing keys, notes, etc.
- Most users avoid privacy features because they're too complicated
- No easy way to use private assets in DeFi protocols

**Our Solution:**
- Wallet UI that makes privacy chains as easy to use as MetaMask
- zUSD stablecoin: First truly private stablecoin backed by ZEC
- Privacy dashboard that explains privacy levels in plain language
- Viewing keys enable compliance without breaking privacy
- Auto-calculations remove complexity (e.g., zUSD minting)
- Mobile-first design that works like modern apps

**Impact:**
- Privacy becomes default, not optional
- Regular users can access advanced privacy features
- Financial privacy is accessible to everyone, not just crypto natives
- Sets new standard for privacy-first wallet UX

### Technical Innovation: OASIS Web4 as Integration Layer

We leverage our own back-end, OASIS, to integrate all providers - allowing chains with totally different architectures to exist in a single place, without compromising on their USPs.

**What Makes This Special:**
- Provider abstraction layer that unifies chains with completely different architectures
- Holonic architecture enables privacy-preserving data structures
- Universal Asset Bridge works across all chains
- Single keypair derivation for all supported chains

**Why This Technical Approach Matters:**
- Each chain keeps its unique features (Zcash's shielded pools, Aztec's private notes, Miden's STARK proofs)
- OASIS enables interoperability without breaking what makes each chain special
- Provider pattern makes it easy to add new chains
- Privacy features (viewing keys, shielded transactions) work across ecosystems
- Foundation for future cross-chain privacy innovations

## Tracks Addressed

| Track | Sponsor |
|-------|---------|
| **Track 1** | Aztec Labs - Private Bridge |
| **Track 2** | Aztec Labs - Zcash <> Aztec Wallet |
| **Track 3** | Aztec Labs - Zcash Backed Stablecoin |
| **Track 4** | Miden - Private Bridge |
| **Track 5** | pump.fun - Solana ↔ Zcash |
| **Track 6** | Helius - Solana ↔ Zcash |
| **Track 7** | Self-Custody & Wallet Innovation |

## Key Features

### Unified Multi-Chain Wallet
- **Single Keypair** for Zcash, Aztec, Miden, Starknet, Solana, Ethereum
- **Unified Balance View** across all chains
- **Cross-Chain Transactions** with privacy preservation
- **Real-time Price Data** from CoinGecko
- **Transaction History** with privacy indicators

### Private Bridge
- **Bi-directional Bridge** between Zcash ↔ Aztec
- **Privacy Options**: Partial notes, viewing keys
- **Bridge History** tracking and status monitoring
- **Atomic Swaps** with automatic rollback

### Zcash-Backed Stablecoin (zUSD)
- **Mint zUSD** with ZEC collateral (150% minimum ratio)
- **Redeem zUSD** to unlock ZEC
- **Position Health Monitoring** (safe/warning/danger/liquidated)
- **Liquidation System** for undercollateralized positions
- **Yield Generation** (5% APY)
- **Risk Management** with automated health checks

### Privacy Features
- **Privacy Dashboard** with metrics and scoring
- **Viewing Key Management** for auditability
- **Shielded Transaction Support**
- **Privacy Recommendations** based on activity
- **Privacy Score Calculation**

## Screenshots

### Authentication & Wallet Overview

![Sign-in using Private Avatar](docs/screenshots/Sign-in%20using%20Private%20Avatar.png)

**Avatar Authentication**: The wallet uses OASIS avatar authentication to securely connect your identity. When you sign in with your avatar credentials, the system automatically links to the Keys/Wallet API and generates wallet addresses for all supported providers (Zcash, Aztec, Miden, Starknet, Solana, Ethereum) from a single keypair. This unified approach eliminates the need for multiple seed phrases while maintaining full self-custody.

![Wallet Home Screen](docs/screenshots/Wallet%20home-screen.png)

**Wallet Home Screen**: The main dashboard displays your total balance across all chains, along with quick access to all wallet functions including sending, receiving, swapping, privacy features, and stablecoin operations.

### Privacy Features

| Send Screen | Shielded Transaction | Privacy Drop | Claim Privacy Drop |
|-------------|----------------------|-------------|-------------------|
| ![Send Screen](docs/screenshots/Send%20screen.png) | ![Shielded Transaction](docs/screenshots/Shielded%20transaction.png) | ![Privacy Drop](docs/screenshots/Privacy%20Drop.png) | ![Claim Privacy Drop](docs/screenshots/Claim%20privacy%20Drop.png) |

**Send Screen**: Initiate transactions across any supported chain with a unified interface. The send screen supports both transparent and shielded transactions depending on the chain.

**Shielded Transaction**: Execute private transactions that hide sender, receiver, and amount details. The wallet automatically uses shielded pools for Zcash and private notes for Aztec when available.

**Privacy Drop**: Create anonymous airdrops where recipients can claim tokens without revealing their identity. Perfect for privacy-preserving token distribution.

**Claim Privacy Drop**: Users can claim privacy drops using viewing keys, maintaining anonymity while enabling verifiable claims. The system validates claims without exposing recipient addresses.

### Asset Management

![View Available Assets](View%20available%20assets.png)

**Asset Overview:** View all available assets across your multi-chain wallets. The interface shows balances for each chain (including SOL and Zcash as shown), with real-time price data and quick access to detailed views for each asset.

![Token Details with Price History](Token%20history%20(coingecko).png)

**Token Details:** Detailed view of individual tokens showing current balance, price history from CoinGecko, transaction history, and asset-specific actions. The price charts provide historical context for informed decision-making.

### Cross-Chain Swapping

<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="docs/screenshots/Swap%20asset%20screen.png" alt="Swap Asset Screen" width="300"/>
  <img src="docs/screenshots/Swap%20asset%20-%20choose%20asset.png" alt="Swap Asset - Choose Asset" width="300"/>
</div>

**Swap Interface**: The atomic swap interface supports cross-chain exchanges between all supported assets. Users can swap Zcash for Solana, Aztec for Ethereum, or any other supported pair. The interface shows available liquidity, exchange rates, and estimated fees. The bridge ensures atomic execution—either the entire swap completes or it rolls back, protecting users from partial failures.

## Addressing Specific Ecosystem Needs

### For Zcash Ecosystem
- ZEC sitting idle—now can be used as stablecoin collateral
- Limited DeFi options—bridge to Aztec opens private DeFi
- Complex shielded transaction UX—simplified in unified wallet
- **Value Delivered:** New use cases for ZEC holders, access to private DeFi, easier onboarding

### For Aztec Ecosystem
- Need for reliable collateral for stablecoins—ZEC is proven, private, valuable
- User acquisition—bridge from Zcash brings established privacy coin users
- Wallet fragmentation—unified wallet removes friction
- **Value Delivered:** Better stablecoin design with ZEC backing, access to Zcash user base, improved UX

### For Miden Ecosystem
- Isolation from other privacy chains—integrated into broader ecosystem
- Proof of interoperability—demonstrates STARK-based privacy can work with other systems
- User onboarding—unified wallet makes Miden more accessible
- **Value Delivered:** Integration into privacy-first cross-chain ecosystem, proof of concept for STARK-based privacy interoperability

### For Solana Ecosystem
- Limited privacy options—access to privacy chains via bridges
- User wants privacy—can access Zcash/Aztec without leaving Solana tools
- Fragmentation—unified wallet experience
- **Value Delivered:** Privacy features through cross-chain bridges, access to private chains without ecosystem lock-in

## Production-Ready Implementation

**What We Actually Built:**
- **15,000+ lines** of production code
- **30+ React components** for frontend
- **20+ API endpoints** for backend
- **6 blockchain providers** integrated
- **Complete error handling**, loading states, user feedback
- **Documentation** and guides

**Real Features:**
- Working wallet creation and management
- Functional stablecoin mint/redeem
- Bridge interface with order tracking
- Privacy dashboard with metrics
- Price charts and transaction history
- QR code generation

This is not just a hackathon proof-of-concept—it's real infrastructure ready for real users.

## Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **.NET 8 SDK** ([Download](https://dotnet.microsoft.com/download))
- **MongoDB** (optional - can use LocalFile provider)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NextGenSoftwareUK/zypherpunk.git
   cd zypherpunk
   ```

2. **Run setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Start OASIS API**
   
   The wallet requires the OASIS API backend. You have two options:

   **Option A: Use Existing OASIS API**
   ```bash
   # If you have access to OASIS API repository
   git clone <oasis-api-repo>
   cd oasis-api/ONODE/NextGenSoftware.OASIS.API.ONODE.WebAPI
   dotnet run
   ```

   **Option B: Use Public API**
   ```bash
   # Update frontend/.env.local
   NEXT_PUBLIC_OASIS_API_URL=https://api.oasisplatform.world
   ```

4. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open Browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
zypherpunk/
├── frontend/                    # Next.js wallet UI
│   ├── app/                    # Next.js app router
│   │   ├── wallet/            # Wallet pages
│   │   └── api/               # API proxy routes
│   ├── components/            # React components
│   │   ├── wallet/           # Wallet components
│   │   ├── bridge/           # Bridge components
│   │   ├── stablecoin/       # Stablecoin dashboard
│   │   └── privacy/          # Privacy features
│   ├── lib/                   # Utilities and API clients
│   │   ├── api/              # API clients
│   │   └── privacy/         # Privacy utilities
│   └── public/               # Static assets
├── backend/                   # API controllers and managers
│   ├── Controllers/          # API endpoints
│   │   ├── StablecoinController.cs
│   │   └── BridgeController.cs
│   ├── Services/            # Business logic
│   │   └── BridgeService.cs
│   └── Managers/            # Core managers
│       └── Stablecoin/     # Stablecoin system
├── docs/                     # Documentation
│   ├── ZYPherPUNK_SUBMISSION_RECAP.md
│   └── ZYPherPUNK_TRACK_SPECIFIC_BRIEFS.md
└── scripts/                  # Setup scripts
    └── setup.sh
```

## Testing

### Test Wallet Creation

1. Navigate to wallet page
2. Click "Create Wallet"
3. Wallets are automatically created for all supported chains

### Test Bridge

1. Ensure you have testnet tokens (ZEC and SOL)
2. Navigate to Bridge screen
3. Select direction (Zcash → Solana)
4. Enter amount and destination address
5. Click "Bridge" and monitor status

### Test Stablecoin

1. Navigate to Stablecoin dashboard
2. Ensure you have ZEC for collateral
3. Go to "Mint" tab
4. Enter ZEC amount and zUSD amount
5. Click "Mint" and monitor position

## Documentation

- **[Submission Recap](docs/ZYPherPUNK_SUBMISSION_RECAP.md)** - Comprehensive overview
- **[Track Implementation](docs/ZYPherPUNK_TRACK_SPECIFIC_BRIEFS.md)** - Detailed track breakdown
- **[Stablecoin Implementation](docs/STABLECOIN_IMPLEMENTATION_COMPLETE.md)** - Stablecoin system details

## Architecture

### Frontend Stack
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Charts:** Recharts
- **QR Codes:** qrcode.react

### Backend Stack
- **Framework:** .NET Core 8
- **Architecture:** OASIS Provider System
- **Storage:** MongoDB / LocalFile
- **Providers:** ZcashOASIS, AztecOASIS, MidenOASIS, StarknetOASIS, SolanaOASIS, EthereumOASIS

### Key Technologies
- **Address Derivation:** Blockchain-specific (Keccak-256, Ed25519, Pedersen Hash, Bech32)
- **Price Oracle:** CoinGecko API
- **Bridge:** Atomic swaps with technical accounts
- **Privacy:** Viewing keys, shielded transactions, partial notes

## Configuration

### Environment Variables

Create `frontend/.env.local`:

```env
# OASIS API URL
NEXT_PUBLIC_OASIS_API_URL=https://localhost:5004

# Use API proxy (for self-signed certificates)
NEXT_PUBLIC_USE_API_PROXY=true
```

### API Configuration

The wallet connects to OASIS API endpoints:

- **Authentication:** `/api/avatar/authenticate`
- **Wallet:** `/api/wallet/*`
- **Bridge:** `/api/v1/orders`
- **Stablecoin:** `/api/v1/stablecoin/*`

## Privacy as Default, Not Afterthought

**Our Approach:**
- Privacy built into the foundation, not bolted on
- Viewing keys enable compliance without breaking privacy
- Privacy metrics help users understand their exposure
- Cross-chain privacy that works seamlessly

**Compliance Without Compromise:**
- Viewing keys allow selective disclosure for auditors/regulators
- Privacy preserved by default, transparency when needed
- Proof that privacy and compliance can coexist

**User Education:**
- Privacy dashboard explains privacy levels
- Recommendations help users improve their privacy
- Makes complex concepts (viewing keys, shielded transactions) accessible

## Impact Summary

| Stakeholder | Problem Solved | Value Delivered |
|------------|---------------|-----------------|
| **Users** | Complex privacy UX, fragmented wallets | Simple, unified, privacy-first experience |
| **Zcash** | Limited use cases, isolated ecosystem | Access to private DeFi, stablecoin collateral |
| **Aztec** | User acquisition, collateral sourcing | ZEC-backed stablecoin, bridge from Zcash |
| **Miden** | Ecosystem isolation | Integration into privacy-first ecosystem |
| **Solana** | Limited privacy options | Privacy via cross-chain bridges |
| **Industry** | Fragmented privacy solutions | Unified infrastructure for privacy-first DeFi |

## Contributing

This is a hackathon submission. For questions or feedback:

- **Issues:** Open an issue on GitHub
- **Repository:** https://github.com/NextGenSoftwareUK/zypherpunk

## License

MIT License

## Acknowledgments

- **OASIS Platform** - Infrastructure and provider system
- **Zcash Foundation** - Privacy technology
- **Aztec Labs** - Private smart contracts
- **Miden** - Zero-knowledge VM
- **All Hackathon Sponsors** - For the opportunity

## Implementation Statistics

- **Frontend Components:** 30+ React components
- **Backend Controllers:** 3 major controllers
- **API Endpoints:** 20+ REST endpoints
- **Blockchain Providers:** 6 providers
- **Lines of Code:** ~15,000+
- **Tracks Addressed:** 7/7 (100%)

## Links

- **Repository:** https://github.com/NextGenSoftwareUK/zypherpunk
- **OASIS Platform:** https://oasisplatform.world
- **Hackathon:** https://zypherpunk.xyz/

---

**Built for the Zypherpunk Hackathon 2025**

*Privacy-first. Cross-chain. Unified.*

### Frontend Stack
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Charts:** Recharts
- **QR Codes:** qrcode.react

### Backend Stack
- **Framework:** .NET Core 8
- **Architecture:** OASIS Provider System
- **Storage:** MongoDB / LocalFile
- **Providers:** ZcashOASIS, AztecOASIS, MidenOASIS, StarknetOASIS, SolanaOASIS, EthereumOASIS

### Key Technologies
- **Address Derivation:** Blockchain-specific (Keccak-256, Ed25519, Pedersen Hash, Bech32)
- **Price Oracle:** CoinGecko API
- **Bridge:** Atomic swaps with technical accounts
- **Privacy:** Viewing keys, shielded transactions, partial notes

## Configuration

### Environment Variables

Create `frontend/.env.local`:

```env
# OASIS API URL
NEXT_PUBLIC_OASIS_API_URL=https://localhost:5004

# Use API proxy (for self-signed certificates)
NEXT_PUBLIC_USE_API_PROXY=true
```

### API Configuration

The wallet connects to OASIS API endpoints:

- **Authentication:** `/api/avatar/authenticate`
- **Wallet:** `/api/wallet/*`
- **Bridge:** `/api/v1/orders`
- **Stablecoin:** `/api/v1/stablecoin/*`

## Privacy as Default, Not Afterthought

**Our Approach:**
- Privacy built into the foundation, not bolted on
- Viewing keys enable compliance without breaking privacy
- Privacy metrics help users understand their exposure
- Cross-chain privacy that works seamlessly

**Compliance Without Compromise:**
- Viewing keys allow selective disclosure for auditors/regulators
- Privacy preserved by default, transparency when needed
- Proof that privacy and compliance can coexist

**User Education:**
- Privacy dashboard explains privacy levels
- Recommendations help users improve their privacy
- Makes complex concepts (viewing keys, shielded transactions) accessible

## Impact Summary

| Stakeholder | Problem Solved | Value Delivered |
|------------|---------------|-----------------|
| **Users** | Complex privacy UX, fragmented wallets | Simple, unified, privacy-first experience |
| **Zcash** | Limited use cases, isolated ecosystem | Access to private DeFi, stablecoin collateral |
| **Aztec** | User acquisition, collateral sourcing | ZEC-backed stablecoin, bridge from Zcash |
| **Miden** | Ecosystem isolation | Integration into privacy-first ecosystem |
| **Solana** | Limited privacy options | Privacy via cross-chain bridges |
| **Industry** | Fragmented privacy solutions | Unified infrastructure for privacy-first DeFi |

## Contributing

This is a hackathon submission. For questions or feedback:

- **Issues:** Open an issue on GitHub
- **Repository:** https://github.com/NextGenSoftwareUK/zypherpunk

## License

MIT License

## Acknowledgments

- **OASIS Platform** - Infrastructure and provider system
- **Zcash Foundation** - Privacy technology
- **Aztec Labs** - Private smart contracts
- **Miden** - Zero-knowledge VM
- **All Hackathon Sponsors** - For the opportunity

## Implementation Statistics

- **Frontend Components:** 30+ React components
- **Backend Controllers:** 3 major controllers
- **API Endpoints:** 20+ REST endpoints
- **Blockchain Providers:** 6 providers
- **Lines of Code:** ~15,000+
- **Tracks Addressed:** 7/7 (100%)

## Links

- **Repository:** https://github.com/NextGenSoftwareUK/zypherpunk
- **OASIS Platform:** https://oasisplatform.world
- **Hackathon:** https://zypherpunk.xyz/

---

**Built for the Zypherpunk Hackathon 2025**

*Privacy-first. Cross-chain. Unified.*
