#!/bin/bash

# Test script to verify wallet addresses are valid and can receive tokens
# This script checks if addresses are properly formatted for each blockchain

echo "🔍 Testing Wallet Address Validity"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get API base URL
API_BASE="${NEXT_PUBLIC_OASIS_API_URL:-https://localhost:5004}"
TOKEN="${OASIS_TOKEN:-}"
TOKEN_FILE="${HOME}/.oasis_token"

# Try to load saved token first
if [ -z "$TOKEN" ] && [ -f "$TOKEN_FILE" ]; then
    TOKEN=$(cat "$TOKEN_FILE")
    export OASIS_TOKEN="$TOKEN"
    echo -e "${GREEN}✅ Loaded saved token from $TOKEN_FILE${NC}"
    echo ""
fi

# If no token, try to authenticate
if [ -z "$TOKEN" ]; then
    echo -e "${YELLOW}⚠️  No OASIS_TOKEN set. Attempting to authenticate...${NC}"
    echo ""
    read -p "Enter username: " USERNAME
    read -s -p "Enter password: " PASSWORD
    echo ""
    echo ""
    
    echo "🔐 Authenticating..."
    AUTH_RESPONSE=$(curl -s -k -X POST "$API_BASE/api/avatar/authenticate" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")
    
    TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.result.result.jwtToken // .result.jwtToken // .result.token // .jwtToken // .token // empty')
    
    if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
        echo -e "${RED}❌ Authentication failed${NC}"
        echo "Response: $AUTH_RESPONSE" | jq '.' 2>/dev/null || echo "$AUTH_RESPONSE"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Authentication successful${NC}"
    echo "Token: ${TOKEN:0:50}..."
    echo ""
    
    # Save token for future use
    echo "$TOKEN" > "$TOKEN_FILE"
    chmod 600 "$TOKEN_FILE"
    echo -e "${GREEN}💾 Token saved to $TOKEN_FILE${NC}"
    echo ""
    echo "💡 To reuse this token:"
    echo "   export OASIS_TOKEN=\"$TOKEN\""
    echo "   # or run: source ../load-oasis-token.sh"
    echo ""
fi

# Export token for use in script
export OASIS_TOKEN="$TOKEN"

echo "📡 Extracting avatar ID from token..."
# Extract avatar ID from JWT token (it's in the payload, second part)
JWT_PAYLOAD=$(echo $TOKEN | cut -d'.' -f2)

# Add padding if needed for base64 decoding
case $((${#JWT_PAYLOAD} % 4)) in
    2) JWT_PAYLOAD="${JWT_PAYLOAD}==" ;;
    3) JWT_PAYLOAD="${JWT_PAYLOAD}=" ;;
esac

# Decode and extract ID
AVATAR_ID=$(echo "$JWT_PAYLOAD" | base64 -d 2>/dev/null | jq -r '.id // empty' 2>/dev/null)

# If still not found, try API
if [ -z "$AVATAR_ID" ] || [ "$AVATAR_ID" = "null" ]; then
    echo "📡 Fetching avatar info from API..."
    AVATAR_RESPONSE=$(curl -s -k -X GET "$API_BASE/api/avatar" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json")
    
    AVATAR_ID=$(echo "$AVATAR_RESPONSE" | jq -r '.result.id // .result.avatarId // .id // .avatarId // empty')
fi

if [ -z "$AVATAR_ID" ] || [ "$AVATAR_ID" = "null" ]; then
    echo -e "${RED}❌ Could not determine avatar ID${NC}"
    echo "JWT Payload (decoded): $(echo "$JWT_PAYLOAD" | base64 -d 2>/dev/null | jq '.' 2>/dev/null || echo 'failed to decode')"
    if [ -n "$AVATAR_RESPONSE" ]; then
        echo "Avatar API response: $AVATAR_RESPONSE" | jq '.' 2>/dev/null || echo "$AVATAR_RESPONSE"
    fi
    exit 1
fi

echo -e "${GREEN}✅ Avatar ID: $AVATAR_ID${NC}"
echo ""
echo "📡 Fetching wallets from API..."
# Ensure we're using the token variable
if [ -z "$TOKEN" ] && [ -n "$OASIS_TOKEN" ]; then
    TOKEN="$OASIS_TOKEN"
fi
echo "Using token: ${TOKEN:0:30}..."
WALLETS=$(curl -s -k -X GET "$API_BASE/api/wallet/avatar/$AVATAR_ID/wallets" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json")

if [ $? -ne 0 ] || [ -z "$WALLETS" ]; then
    echo -e "${RED}❌ Failed to fetch wallets${NC}"
    echo "Response: $WALLETS" | jq '.' 2>/dev/null || echo "$WALLETS"
    exit 1
fi

# Check if response has error
ERROR=$(echo "$WALLETS" | jq -r '.isError // .error // empty')
if [ "$ERROR" = "true" ] || [ -n "$ERROR" ]; then
    echo -e "${RED}❌ Error fetching wallets: $(echo "$WALLETS" | jq -r '.message // .error // "Unknown error"')${NC}"
    echo "Full response: $WALLETS" | jq '.' 2>/dev/null || echo "$WALLETS"
    exit 1
fi

# Check if we have any wallets (result is a dictionary, so check if it has keys)
WALLET_COUNT=$(echo "$WALLETS" | jq -r '.result | keys | length // 0')
if [ "$WALLET_COUNT" = "0" ]; then
    echo -e "${YELLOW}⚠️  No wallets found for this avatar${NC}"
    echo "Response: $WALLETS" | jq '.' 2>/dev/null || echo "$WALLETS"
    exit 0
fi

echo -e "${GREEN}✅ Found wallets for $WALLET_COUNT provider(s)${NC}"

echo ""
echo "🔍 Validating Address Formats:"
echo ""

# Function to validate Zcash address
validate_zcash() {
    local addr=$1
    # Zcash addresses start with 't' (testnet) or 'z' (shielded) or 'zs' (shielded)
    if [[ $addr =~ ^t[1-9A-HJ-NP-Za-km-z]{34}$ ]] || [[ $addr =~ ^z[1-9A-HJ-NP-Za-km-z]{75}$ ]] || [[ $addr =~ ^zs1[a-z0-9]{74}$ ]]; then
        echo -e "${GREEN}✅ Valid Zcash address${NC}"
        return 0
    else
        echo -e "${RED}❌ Invalid Zcash address format${NC}"
        return 1
    fi
}

# Function to validate Starknet address
validate_starknet() {
    local addr=$1
    # Starknet addresses are hex strings starting with 0x, typically 66 chars
    if [[ $addr =~ ^0x[0-9a-fA-F]{63,64}$ ]]; then
        echo -e "${GREEN}✅ Valid Starknet address${NC}"
        return 0
    else
        echo -e "${RED}❌ Invalid Starknet address format${NC}"
        return 1
    fi
}

# Function to validate Ethereum-style address (Aztec, Miden might use similar)
validate_ethereum_style() {
    local addr=$1
    # Ethereum addresses are hex strings starting with 0x, 42 chars total
    if [[ $addr =~ ^0x[0-9a-fA-F]{40}$ ]]; then
        echo -e "${GREEN}✅ Valid Ethereum-style address${NC}"
        return 0
    else
        echo -e "${RED}❌ Invalid Ethereum-style address format${NC}"
        return 1
    fi
}

# Parse wallets and validate
echo "$WALLETS" | jq -r '.result | to_entries[] | "\(.key)|\(.value[0].walletAddress // "N/A")|\(.value[0].providerType // "N/A")"' | while IFS='|' read -r provider addr type; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Provider: $provider"
    echo "Address: $addr"
    echo "Type: $type"
    
    case $provider in
        *Zcash*)
            validate_zcash "$addr"
            ;;
        *Starknet*)
            validate_starknet "$addr"
            ;;
        *Aztec*|*Miden*)
            validate_ethereum_style "$addr"
            ;;
        *Solana*)
            # Solana addresses are base58 encoded, 32-44 characters
            if [[ $addr =~ ^[1-9A-HJ-NP-Za-km-z]{32,44}$ ]]; then
                echo -e "${GREEN}✅ Valid Solana address format${NC}"
            else
                echo -e "${RED}❌ Invalid Solana address format${NC}"
            fi
            ;;
        *Ethereum*|*Polygon*|*Arbitrum*)
            validate_ethereum_style "$addr"
            ;;
        *)
            echo -e "${YELLOW}⚠️  Unknown provider type - cannot validate${NC}"
            ;;
    esac
    echo ""
done

echo ""
echo "📝 Testnet Configuration Check:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Checking OASIS_DNA.json for testnet settings..."
if [ -f "../ONODE/NextGenSoftware.OASIS.API.ONODE.WebAPI/OASIS_DNA.json" ]; then
    echo "Zcash Network: $(jq -r '.StorageProviders.ZcashOASIS.Network // "not configured"' ../ONODE/NextGenSoftware.OASIS.API.ONODE.WebAPI/OASIS_DNA.json)"
    echo "Starknet Network: $(jq -r '.StorageProviders.StarknetOASIS.Network // "not configured"' ../ONODE/NextGenSoftware.OASIS.API.ONODE.WebAPI/OASIS_DNA.json)"
else
    echo -e "${YELLOW}⚠️  OASIS_DNA.json not found${NC}"
fi

echo ""
echo "✅ Address validation complete!"

