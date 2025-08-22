#!/bin/bash

# FedPackTrack Deployment Script
echo "🚀 Preparing FedPackTrack for deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Your FedPackTrack app is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Go to render.com and create a new web service"
    echo "3. Connect your GitHub repository"
    echo "4. Add a PostgreSQL database"
    echo "5. Set environment variables (see DEPLOYMENT.md)"
    echo "6. Deploy!"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
