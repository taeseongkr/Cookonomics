# Cookonomics Platform

## Agent Development Kit Hackathon with Google Cloud

## Project Overview

Cookonomics is a full-stack web application that helps users plan meals, discover recipes, and track nutrition. The platform consists of a FastAPI backend with Celery workers for background processing, and a React frontend with modern UI components.

## Project Structure

```text
├── backend/                    # FastAPI backend with Celery workers
│   └── Cookonomics-backend/   # Main backend application
├── frontend/                   # React frontend application
├── shared/                     # Shared code between frontend/backend
├── data/                       # Data storage and processing
├── docker/                     # Docker configurations
├── logs/                       # Application logs
└── docs/                       # Project documentation
```

## Getting Started

### Prerequisites

- **Node.js**: ≥20.0.0 (for frontend)
- **Python**: ≥3.8 (for backend)
- **Docker**: Latest version (for containerized deployment)
- **Yarn**: Latest version (recommended for frontend)

### Quick Start - Frontend Only

To start just the frontend dashboard:

```bash
cd frontend
yarn
yarn start
```

This will launch the frontend interface at [http://localhost:3000](http://localhost:3000).

**Note:** You'll need the backend running for full functionality.

### Quick Start - Backend Only

To start the backend API with Docker:

```bash
# First clone the backend repository if you haven't already
git clone https://github.com/nguyenhuy1209/Cookonomics-backend.git backend/Cookonomics-backend

cd backend/Cookonomics-backend
docker compose up
```

This will launch the backend API at [http://localhost:8000](http://localhost:8000).

### Full Development Setup

1. **Clone the repositories**

   ```bash
   # Clone the main project
   git clone https://github.com/taeseongkr/Cookonomics.git
   cd Cookonomics
   
   # Clone the backend repository
   git clone https://github.com/nguyenhuy1209/Cookonomics-backend.git backend/Cookonomics-backend
   ```

2. **Start Backend Services with Docker**

   ```bash
   cd backend/Cookonomics-backend
   
   # Start all backend services (API, database, Redis, etc.)
   docker compose up
   ```

3. **Start Frontend**

   ```bash
   cd frontend
   
   # Install dependencies
   yarn
   
   # Start the development server
   yarn start
   ```

4. **Configure Environment Variables**

   Make sure to check and update `frontend/.env` with the correct API URL:

   ```env
   REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

5. **Access the Applications**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

## Features

### Core Features

- **Meal Planning** - Create and manage weekly meal plans
- **Recipe Discovery** - Browse and search through curated recipes
- **Nutrition Tracking** - Detailed nutritional analysis and tracking
- **User Profiles** - Personalized user accounts and preferences
- **Google OAuth** - Secure authentication with Google accounts

### Technical Features

- **Real-time Updates** - WebSocket integration for live updates
- **Background Processing** - Celery workers for heavy computations
- **Cloud Storage** - Google Cloud integration for data and images
- **Responsive Design** - Mobile-friendly React interface
- **API Documentation** - Comprehensive OpenAPI/Swagger docs

## Architecture

### Backend (FastAPI + Celery)

- **FastAPI** - Modern Python web framework
- **Celery** - Distributed task queue for background jobs
- **SQLAlchemy** - Database ORM
- **Alembic** - Database migrations
- **Google Cloud** - BigQuery and Storage integration

### Frontend (React)

- **React 19.1.0** - Modern React with latest features
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **WebSocket** - Real-time communication
- **Google OAuth** - Authentication integration

## Deployment

### Docker Deployment

Both frontend and backend include Docker configurations for easy deployment:

```bash
# Frontend
cd frontend
docker build -t cookonomics-frontend .
docker run -p 3000:80 cookonomics-frontend

# Backend
cd backend/Cookonomics-backend
docker build -t cookonomics-backend .
docker run -p 8000:8000 cookonomics-backend
```



## Environment Configuration

### Frontend Environment Variables

Create `frontend/.env` (you can copy from `.env.example`):

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Important:** Make sure to check the `REACT_APP_API_BASE_URL` matches your backend setup.

### Backend Environment Variables

Configure your backend environment with:

- Database connection strings
- Google Cloud credentials
- Celery broker settings
- API keys and secrets

## Development Guidelines

### Frontend Development

See [frontend/README.md](./frontend/README.md) for detailed frontend setup and development guidelines.

### Backend Development

See [backend/README.md](https://github.com/nguyenhuy1209/Cookonomics-backend/blob/main/README.md) for detailed backend setup and API documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Cookonomics platform.


