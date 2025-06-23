# Cookonomics Frontend

A React-based frontend application for the Cookonomics platform, providing an intuitive interface for meal planning, recipe management, and nutritional analysis.

## Project Overview

This is a modern React application built with:

- **React 19.1.0** - Latest React framework
- **React Router 7.6.2** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Google OAuth** - Authentication integration
- **Docker** - Containerized deployment

## System Requirements

### Prerequisites

- **Node.js**: ≥20.0.0 (LTS recommended)
- **npm**: ≥9.0.0 (comes with Node.js)

### Version Compatibility

- **React**: 19.1.0
- **React Router**: 7.6.2 (requires Node.js ≥20.0.0)
- **React Scripts**: 3.0.1

### Check Your Environment

```bash
node --version    # Should be ≥20.0.0
npm --version     # Should be ≥9.0.0
```

If you need to update Node.js, we recommend using [nvm](https://github.com/nvm-sh/nvm):

```bash
# Install latest LTS Node.js
nvm install --lts
nvm use --lts
```

## Quick Start - Running Locally

### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install all dependencies using yarn
yarn install
```

### 2. Set Up Environment Variables

Create a `.env` file in the frontend directory:

```env
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration (adjust based on your backend setup)
REACT_APP_API_URL=http://localhost:8000/api/v1
```

### 3. Start Development Server

```bash
# Start the development server
yarn start
```

The application will open automatically in your browser at [http://localhost:3000](http://localhost:3000).

## Installation

### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install all dependencies using yarn (recommended)
yarn install

# Or using npm
npm install
```

### 2. Handle Version Warnings (if any)

If you see engine compatibility warnings, ensure you're using Node.js ≥20.0.0. The application may still work with older versions but compatibility is not guaranteed.

### 3. Address Security Vulnerabilities (Optional)

Check for security issues:

```bash
# Using yarn
yarn audit

# Using npm
npm audit
```

For development dependencies vulnerabilities that don't affect production:

```bash
# Using yarn
yarn audit --fix

# Using npm
npm audit fix --force
```

## Available Scripts

### Development

#### `yarn start` / `yarn dev`

Starts the development server with hot reload:

- **URL**: [http://localhost:3000](http://localhost:3000)
- **Hot Reload**: Automatically refreshes on file changes
- **Error Display**: Shows lint errors and runtime errors in console/browser

```bash
yarn start
# or
yarn dev
# or using npm
npm start
```

#### `yarn test`

Runs the test suite in interactive watch mode:

```bash
yarn test
# or using npm
npm test
```

#### `yarn build`

Builds the app for production to the `build` folder:

- Optimizes the build for best performance
- Bundles React in production mode
- Minifies files and optimizes assets
- Build is ready for deployment

```bash
yarn build
# or using npm
npm run build
```

#### `yarn serve`

Serves the production build locally for testing:

```bash
yarn serve
# or using npm
npm run serve
```

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the frontend directory with:

```env
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration
REACT_APP_API_URL=http://localhost:8000/api/v1
```

### Environment Variables for Production

For production deployment, ensure these variables are properly set:

- `REACT_APP_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `REACT_APP_API_URL` - Backend API URL

## Docker Deployment

### Building the Docker Image

The application uses a multi-stage Docker build:

```bash
# Build with environment variables
docker build \
  --build-arg REACT_APP_API_URL_ARG="https://your-api-url.com/api/v1" \
  --build-arg REACT_APP_GOOGLE_CLIENT_ID_ARG="your_google_client_id" \
  -t cookonomics-frontend .
```

### Running the Container

```bash
# Run the container
docker run -p 80:80 cookonomics-frontend
```

The application will be available at `http://localhost`.

### Multi-Platform Build

For production deployment on different architectures:

```bash
# Build for linux/amd64 (Cloud Run, most cloud platforms)
docker buildx build \
  --platform linux/amd64 \
  --build-arg REACT_APP_API_URL_ARG="https://your-api-url.com/api/v1" \
  --build-arg REACT_APP_GOOGLE_CLIENT_ID_ARG="your_google_client_id" \
  -t cookonomics-frontend . \
  --load
```

## Automated Deployment

### Google Cloud Run Deployment

Use the provided deployment script:

```bash
# Make the script executable
chmod +x deploy-frontend.sh

# Deploy to Google Cloud Run
./deploy-frontend.sh
```

The deployment script will:

1. Build the Docker image with proper build arguments
2. Push to Google Container Registry
3. Deploy to Cloud Run in the configured region
4. Configure the service with appropriate settings

### Manual Cloud Run Deployment

```bash
# 1. Build and tag the image
docker build \
  --build-arg REACT_APP_API_URL_ARG="https://your-backend-url.com/api/v1" \
  --build-arg REACT_APP_GOOGLE_CLIENT_ID_ARG="your_google_client_id" \
  -t gcr.io/your-project/cookonomics-frontend .

# 2. Push to Google Container Registry
docker push gcr.io/your-project/cookonomics-frontend

# 3. Deploy to Cloud Run
gcloud run deploy cookonomics-frontend \
  --image gcr.io/your-project/cookonomics-frontend \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --port 80
```

## Production Features

### Nginx Configuration

The production build uses Nginx with:

- **Gzip Compression** - Reduced bundle sizes
- **Static Asset Caching** - 1-year cache for immutable assets
- **Security Headers** - XSS protection, content type sniffing protection
- **SPA Routing** - Proper fallback to index.html for client-side routing
- **Health Check Endpoint** - `/health` endpoint for monitoring

### Performance Optimizations

- **Code Splitting** - Automatic code splitting with React.lazy()
- **Bundle Optimization** - Webpack optimizations for production
- **Asset Optimization** - Minified CSS, JS, and optimized images
- **Caching Strategy** - Aggressive caching for static assets, no-cache for HTML

## Troubleshooting

### Common Issues

#### Node.js Version Issues

```bash
# Check Node.js version
node --version

# Should be ≥20.0.0 for React Router 7.6.2
# Use nvm to manage Node.js versions
nvm install 20
nvm use 20
```

#### OpenSSL Legacy Provider Issues

The project uses `NODE_OPTIONS='--openssl-legacy-provider'` to handle OpenSSL compatibility issues with older React Scripts versions.

#### Build Failures

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear React Scripts cache
npm start -- --reset-cache
```

#### Docker Build Issues

```bash
# Clear Docker build cache
docker builder prune

# Build without cache
docker build --no-cache -t cookonomics-frontend .
```

## Development Guidelines

### Code Structure

```text
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── styles/             # Global styles and animations
├── constants/          # Application constants
└── data/               # Mock data and static content
```

### Styling

- **Styled Components** - Primary styling solution
- **CSS Modules** - For component-specific styles
- **Global Styles** - Base styles and CSS variables

### State Management

- **React Hooks** - useState, useEffect, useContext
- **Custom Hooks** - Reusable stateful logic
- **Context API** - Global state management

## Contributing

1. Ensure Node.js ≥20.0.0 is installed
2. Run `npm install` to install dependencies
3. Create a `.env` file with required environment variables
4. Start development server with `npm start`
5. Make your changes and test thoroughly
6. Build for production with `npm run build`
7. Test the production build with `npm run serve`

## License

This project is part of the Cookonomics platform.
