#!/bin/bash

echo "🚀 Setting up Zypherpunk Wallet..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Setup frontend
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create .env.local if it doesn't exist
if [ ! -f frontend/.env.local ]; then
    echo "📝 Creating .env.local..."
    cat > frontend/.env.local << ENVEOF
NEXT_PUBLIC_OASIS_API_URL=https://localhost:5004
NEXT_PUBLIC_USE_API_PROXY=true
ENVEOF
    echo "✅ Created frontend/.env.local"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start OASIS API (see README.md)"
echo "2. Run 'cd frontend && npm run dev'"
echo "3. Open http://localhost:3000"
