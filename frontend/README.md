# Multi-Agent System Frontend

React-based dashboard for monitoring and controlling the multi-agent system. This frontend provides a beautiful and modern interface with real-time monitoring capabilities, agent controls, and comprehensive system analytics.

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

## Installation

### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install all dependencies
npm install
```

### 2. Handle Version Warnings (if any)

If you see engine compatibility warnings, ensure you're using Node.js ≥20.0.0. The application may still work with older versions but compatibility is not guaranteed.

### 3. Address Security Vulnerabilities (Optional)

Check for security issues:

```bash
npm audit
```

For development dependencies vulnerabilities that don't affect production:

```bash
npm audit --production
```

## Available Scripts

### Development

#### `npm start`

Starts the development server with hot reload:

- **URL**: [http://localhost:3000](http://localhost:3000)
- **Hot Reload**: Automatically refreshes on file changes
- **Error Display**: Shows lint errors and runtime errors in console/browser

```bash
npm start
```

#### `npm test`

Launches the interactive test runner:

- **Watch Mode**: Automatically re-runs tests on file changes
- **Coverage**: Add `-- --coverage` for test coverage report

```bash
npm test

# With coverage
npm test -- --coverage
```

### Production

#### `npm run build`

Creates an optimized production build in the `build` folder:

- **Optimization**: Minified and optimized for best performance
- **File Hashing**: Includes content hashes for cache busting
- **Bundle Analysis**: Use `npm run build -- --analyze` for bundle analysis

```bash
npm run build
```

#### Serve Production Build Locally

```bash
# Install serve globally (one time)
npm install -g serve

# Serve the build folder
serve -s build -l 3000
```

### Advanced

#### `npm run eject`

**⚠️ Warning: This is a one-way operation!**

Exposes all configuration files and dependencies for full customization. Only use if you need complete control over the build process.

```bash
npm run eject
```

## Features & Dependencies

### Core Technologies

- **React 19.1.0**: Latest React with concurrent features
- **React Router DOM 7.6.2**: Modern routing with data loading
- **Styled Components 6.1.18**: CSS-in-JS styling solution
- **React Icons 5.5.0**: Popular icon library

### UI Components

- **React Slick 0.30.3**: Carousel/slider components
- **Slick Carousel 1.8.1**: Carousel styling and functionality

### Development & Testing

- **React Scripts 3.0.1**: Build tooling and development server
- **Testing Library**: Comprehensive testing utilities
  - `@testing-library/react 16.3.0`
  - `@testing-library/jest-dom 6.6.3`
  - `@testing-library/user-event 13.5.0`
- **Web Vitals 2.1.4**: Performance monitoring

## Quick Start Guide

```bash
# 1. Ensure Node.js ≥20.0.0
node --version

# 2. Navigate to frontend
cd frontend

# 3. Install dependencies
npm install

# 4. Start development server
npm start

# 5. Open browser to http://localhost:3000
```

## Troubleshooting

### Common Issues

#### Node.js Version Compatibility

**Error**: `Unsupported engine` warnings for react-router packages

**Solution**: Upgrade to Node.js ≥20.0.0
```bash
nvm install --lts
nvm use --lts
npm install
```

#### Security Vulnerabilities

**Error**: npm audit shows vulnerabilities

**Solution**: Most vulnerabilities are in dev dependencies and don't affect production
```bash
# Check production-only vulnerabilities
npm audit --production

# If production vulnerabilities exist
npm audit fix
```

#### Port Already in Use

**Error**: Port 3000 already in use

**Solution**: Use a different port
```bash
# Option 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
PORT=3001 npm start
```

#### Memory Issues

**Error**: JavaScript heap out of memory

**Solution**: Increase Node.js memory limit
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm start
```

## Development Workflow

### Recommended Setup

1. **Code Editor**: VS Code with React extensions
2. **Browser**: Chrome with React Developer Tools
3. **Terminal**: Use integrated terminal in VS Code

### File Structure

```
src/
├── components/           # Reusable UI components
│   ├── BackgroundDecoration.js
│   ├── Floating3DElements.js
│   ├── NutritionSummaryCard.js
│   └── UserInputForm.js
├── App.js               # Main application component
├── App.css              # Global styles
├── index.js             # Application entry point
└── index.css            # Base CSS styles
```

## Performance Tips

- Use React.memo() for expensive components
- Implement proper key props for lists
- Use React DevTools Profiler for performance analysis
- Consider code splitting for large components

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Static Hosting

The `build` folder can be deployed to any static hosting service:

- **Netlify**: Drag and drop the build folder
- **Vercel**: Connect your repository
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload build folder contents

## Learn More

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Create React App Documentation](https://create-react-app.dev/)
- [Styled Components Documentation](https://styled-components.com/)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
