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
npm audit fix --force
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
