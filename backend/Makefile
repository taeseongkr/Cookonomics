.PHONY: help install format lint test clean run docker-build docker-run

# Default target
help:
	@echo "🚀 Cookonomics Backend Development Commands"
	@echo ""
	@echo "Setup:"
	@echo "  install     Install dependencies and setup environment"
	@echo "  setup-hooks Install pre-commit hooks"
	@echo ""
	@echo "Development:"
	@echo "  run         Start development server"
	@echo "  format      Format code with Black and isort"
	@echo "  lint        Run linting with flake8"
	@echo "  test        Run tests with pytest"
	@echo "  test-cov    Run tests with coverage report"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build Build Docker image"
	@echo "  docker-run   Run with Docker Compose"
	@echo ""
	@echo "Cleanup:"
	@echo "  clean       Remove cache files and build artifacts"

# Installation and setup
install:
	@echo "📦 Installing dependencies..."
	python -m pip install --upgrade pip
	pip install -r requirements.txt

setup-hooks:
	@echo "🪝 Installing pre-commit hooks..."
	pre-commit install
	@echo "✅ Pre-commit hooks installed!"

# Development
run:
	@echo "🚀 Starting development server..."
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

format:
	@echo "🎨 Formatting code..."
	isort app tests --profile black --line-length 88
	black app tests --line-length 88
	@echo "✅ Code formatted!"

lint:
	@echo "🔍 Running linter..."
	flake8 app tests --max-line-length=88 --extend-ignore=E203,W503
	@echo "✅ Linting complete!"

format-check:
	@echo "🔍 Checking code formatting..."
	isort app tests --profile black --line-length 88 --check-only --diff
	black app tests --line-length 88 --check --diff
	@echo "✅ Code formatting check complete!"

# Testing
test:
	@echo "🧪 Running tests..."
	pytest tests/ -v

test-cov:
	@echo "🧪 Running tests with coverage..."
	pytest tests/ -v --cov=app --cov-report=html --cov-report=term-missing

# Docker
docker-build:
	@echo "🐳 Building Docker image..."
	docker build -t cookonomics-backend .

docker-run:
	@echo "🐳 Starting with Docker Compose..."
	docker-compose up --build

docker-down:
	@echo "🐳 Stopping Docker Compose..."
	docker-compose down

# Cleanup
clean:
	@echo "🧹 Cleaning up..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".coverage" -delete
	find . -type d -name "htmlcov" -exec rm -rf {} +
	@echo "✅ Cleanup complete!"

# Quality checks (run all checks)
check: format-check lint test
	@echo "✅ All quality checks passed!"

# Development setup (install + hooks)
setup: install setup-hooks
	@echo "✅ Development environment setup complete!"
