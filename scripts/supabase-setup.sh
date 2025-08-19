#!/bin/bash

echo "🚀 Supabase Setup Script for Kids Fashion Store"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from env.example..."
    cp env.example .env
    print_success ".env file created from env.example"
fi

# Check if required packages are installed
print_status "Checking dependencies..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "Dependencies check passed!"

# Check if Supabase packages are installed
if ! npm list @supabase/supabase-js &> /dev/null; then
    print_status "Installing Supabase packages..."
    npm install @supabase/supabase-js
    print_success "Supabase packages installed"
fi

# Check if .env has required variables
print_status "Checking environment variables..."

if ! grep -q "DATABASE_URL" .env; then
    print_warning "DATABASE_URL not found in .env"
    echo "Please add your Supabase DATABASE_URL to .env file:"
    echo "DATABASE_URL=\"postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1&pool_timeout=20\""
fi

if ! grep -q "NEXT_PUBLIC_SUPABASE_URL" .env; then
    print_warning "NEXT_PUBLIC_SUPABASE_URL not found in .env"
    echo "Please add your Supabase URL to .env file:"
    echo "NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co"
fi

if ! grep -q "SUPABASE_SERVICE_ROLE_KEY" .env; then
    print_warning "SUPABASE_SERVICE_ROLE_KEY not found in .env"
    echo "Please add your Supabase service role key to .env file:"
    echo "SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
fi

if ! grep -q "UPLOAD_PROVIDER" .env; then
    print_status "Adding UPLOAD_PROVIDER to .env..."
    echo "UPLOAD_PROVIDER=supabase" >> .env
    print_success "UPLOAD_PROVIDER set to supabase"
fi

# Test database connection
print_status "Testing database connection..."
if npx prisma db pull &> /dev/null; then
    print_success "Database connection successful!"
else
    print_error "Database connection failed!"
    echo "Please check your DATABASE_URL in .env file"
    echo "Make sure your Supabase project is set up correctly"
fi

# Generate Prisma client
print_status "Generating Prisma client..."
if npx prisma generate; then
    print_success "Prisma client generated successfully!"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Push database schema
print_status "Pushing database schema to Supabase..."
if npx prisma db push; then
    print_success "Database schema pushed successfully!"
else
    print_error "Failed to push database schema"
    exit 1
fi

# Seed database
print_status "Seeding database..."
if npx prisma db seed; then
    print_success "Database seeded successfully!"
else
    print_warning "Database seeding failed or no seed data available"
fi

# Test build
print_status "Testing build..."
if npm run build; then
    print_success "Build successful!"
else
    print_error "Build failed!"
    exit 1
fi

echo ""
echo "🎉 Supabase setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Create a storage bucket named 'product-images' in Supabase dashboard"
echo "2. Set up storage policies for public read access"
echo "3. Test file uploads in your admin panel"
echo "4. Deploy to Vercel with environment variables"
echo ""
echo "📖 For detailed instructions, see SUPABASE_SETUP_GUIDE.md"
echo ""
echo "🔧 To test your setup:"
echo "   npm run dev"
echo "   # Then visit http://localhost:3000/admin"
