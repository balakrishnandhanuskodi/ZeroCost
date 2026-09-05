#!/bin/bash

# ZeroCost Authentication Setup Script
# This script helps you create .env.local with Supabase credentials

echo "🚀 ZeroCost Authentication Setup"
echo "=================================="
echo ""
echo "This script will help you set up environment variables for Supabase."
echo ""
echo "To get your Supabase credentials:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Select your 'zerocost' project"
echo "3. Click Settings → API"
echo "4. Copy 'Project URL' and 'Anon Key'"
echo ""
echo "=================================="
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 1
    fi
fi

# Prompt for Supabase URL
echo ""
read -p "📍 Enter your Supabase Project URL (https://xxxxx.supabase.co): " SUPABASE_URL

if [ -z "$SUPABASE_URL" ]; then
    echo "❌ Error: Project URL cannot be empty"
    exit 1
fi

# Prompt for Anon Key
echo ""
read -p "🔑 Enter your Supabase Anon Key (public key): " SUPABASE_KEY

if [ -z "$SUPABASE_KEY" ]; then
    echo "❌ Error: Anon Key cannot be empty"
    exit 1
fi

# Create .env.local
cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_KEY
EOF

echo ""
echo "✅ Created .env.local successfully!"
echo ""
echo "Next steps:"
echo "1. Restart your dev server: pnpm run dev"
echo "2. Go to https://supabase.com/dashboard → zerocost → SQL Editor"
echo "3. Run the SQL from COMPLETE_AUTH_NOW.md (Step 3)"
echo "4. Test registration at http://localhost:8443/register"
echo ""
echo "Happy building! 🚀"
