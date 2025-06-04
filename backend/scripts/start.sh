#!/bin/bash

# Cookonomics Backend Startup Script

set -e

echo "🚀 Starting Cookonomics Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "📚 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from env.example..."
    cp env.example .env
    echo "📝 Please edit .env file with your configuration before running the server."
    exit 1
fi

# Check if PostgreSQL is running (optional check)
echo "🔍 Checking database connection..."
echo "📝 Make sure PostgreSQL is running and accessible."
echo "   You can start it with Docker Compose: docker-compose up postgres"

# Run the development server
echo "🌟 Starting development server..."
echo "📖 API Documentation will be available at: http://localhost:8000/docs"
echo "🔍 Health check available at: http://localhost:8000/"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
