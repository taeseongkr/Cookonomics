#!/bin/bash

# Code formatting script for Cookonomics Backend

set -e

echo "🎨 Formatting Cookonomics Backend code..."

# Check if virtual environment is activated
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "⚠️  Virtual environment not activated. Activating..."
    if [ -d "venv" ]; then
        source venv/bin/activate
    else
        echo "❌ Virtual environment not found. Please run ./scripts/start.sh first."
        exit 1
    fi
fi

echo "📦 Sorting imports with isort..."
isort app tests --profile black --line-length 88 --diff --check-only --verbose || {
    echo "🔧 Fixing import order..."
    isort app tests --profile black --line-length 88
}

echo "🖤 Formatting code with Black..."
black app tests --line-length 88 --diff --check || {
    echo "🔧 Applying Black formatting..."
    black app tests --line-length 88
}

echo "🔍 Running flake8 linter..."
flake8 app tests --max-line-length=88 --extend-ignore=E203,W503

echo "✅ Code formatting complete!"
echo ""
echo "💡 To set up automatic formatting on commit:"
echo "   pre-commit install"
echo ""
echo "💡 To format code manually:"
echo "   black app tests"
echo "   isort app tests --profile black"
