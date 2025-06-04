# Cookonomics Backend

A modern FastAPI backend application with PostgreSQL integration, built following best practices for scalability, security, and maintainability.

## Features

- **FastAPI Framework**: High-performance, easy-to-use, and well-documented
- **PostgreSQL Database**: Robust relational database with SQLAlchemy ORM
- **JWT Authentication**: Secure token-based authentication
- **Structured Logging**: JSON-formatted logs with structlog
- **Docker Support**: Containerized application for easy deployment
- **Comprehensive Testing**: Unit tests with pytest
- **Code Quality**: Black, isort, flake8, and pre-commit hooks
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py          # Authentication endpoints
│   │       │   ├── users.py         # User management
│   │       │   └── items.py         # Sample CRUD endpoints
│   │       └── api.py               # API router
│   ├── core/
│   │   ├── config.py                # Configuration management
│   │   ├── database.py              # Database configuration
│   │   └── security.py              # Security utilities
│   ├── models/
│   │   ├── user.py                  # User data models
│   │   └── item.py                  # Item data models
│   ├── services/
│   │   ├── user_service.py          # User business logic
│   │   └── item_service.py          # Item business logic
│   ├── deps.py                      # Dependency injection
│   └── main.py                      # Application entry point
├── scripts/
│   ├── start.sh                     # Development server startup
│   ├── format.sh                    # Code formatting script
│   └── init.sql                     # Database initialization
├── tests/
│   └── test_main.py                 # Basic tests
├── requirements.txt                 # Python dependencies
├── Dockerfile                       # Docker configuration
├── docker-compose.yml              # Docker Compose setup
├── Makefile                         # Development commands
├── .pre-commit-config.yaml          # Pre-commit hooks configuration
├── pyproject.toml                   # Python project configuration
├── env.example                      # Environment variables example
└── README.md                        # This file
```

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 15+ (or Docker for containerized setup)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies and setup development environment
make setup
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL with Docker Compose
docker-compose up postgres -d

# The database will be automatically initialized with the init.sql script
```

#### Option B: Local PostgreSQL Installation
```bash
# Install PostgreSQL and create database
createdb cookonomics
psql cookonomics < scripts/init.sql
```

### 3. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env file with your configuration
# Update database settings if using local PostgreSQL
```

### 4. Run the Application

```bash
# Using the startup script
./scripts/start.sh

# Or using Make
make run

# Or manually
uvicorn app.main:app --reload

# Or using Docker
make docker-run
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/

## Development Workflow

### Code Formatting and Quality

```bash
# Format code
make format

# Check code quality
make lint

# Run all quality checks
make check
```

### Database Operations

The application uses PostgreSQL with SQLAlchemy ORM:
- `users` - User accounts and profiles
- `items` - Sample items (can be replaced with your entities)

Database tables are automatically created when the application starts.

### Testing

```bash
# Run tests
make test

# Run with coverage
make test-cov

# Run specific test file
pytest tests/test_main.py -v
```

### Code Quality Standards

- **Line Length**: 88 characters (Black default)
- **Import Sorting**: isort with Black profile
- **Linting**: flake8 with E203, W503 ignored (Black compatibility)
- **Type Hints**: Encouraged for all functions
- **Docstrings**: Required for all public functions and classes

## Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
make docker-run

# Or build and run manually
make docker-build
docker run -p 8000:8000 cookonomics-backend
```

### Environment Variables

Key environment variables for production:

```env
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-super-secure-secret-key
POSTGRES_HOST=your-postgres-host
POSTGRES_USER=your-postgres-user
POSTGRES_PASSWORD=your-postgres-password
POSTGRES_DB_NAME=cookonomics
BACKEND_CORS_ORIGINS=https://yourdomain.com
```

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `full_name`
- `hashed_password`
- `is_active`
- `created_at`
- `updated_at`

### Items Table
- `id` (Primary Key)
- `name`
- `description`
- `price`
- `status` (Enum: active, inactive, archived)
- `user_id` (Foreign Key to users.id)
- `created_at`
- `updated_at`

## Security Considerations

- Change the `SECRET_KEY` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Configure CORS origins appropriately
- Regularly update dependencies
- Use strong database passwords

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the code quality standards
4. Run `make check` to ensure all quality checks pass
5. Add tests for new functionality
6. Submit a pull request

### Code Style

This project follows these formatting standards:
- **Black** for code formatting
- **isort** for import sorting
- **flake8** for linting
- Pre-commit hooks ensure consistency

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue in the repository or contact the development team.
