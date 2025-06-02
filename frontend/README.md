# Frontend - Multi-Agent System Dashboard

This directory contains the frontend dashboard for monitoring and controlling the multi-agent system.

## Directory Structure

- **src/components/**: Reusable UI components
  - Agent status cards
  - Task visualization components
  - Real-time charts and graphs
  - Control panels

- **src/pages/**: Main application pages
  - Dashboard overview
  - Agent management
  - Task monitoring
  - System analytics

- **src/hooks/**: Custom React hooks
  - WebSocket connection hooks
  - Data fetching hooks
  - State management hooks

- **src/services/**: API service layers
  - Backend API calls
  - WebSocket service
  - Data transformation utilities

- **src/utils/**: Frontend utility functions
- **src/assets/**: Static assets (images, icons)
- **src/styles/**: CSS and styling files

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Features

### Dashboard
- Real-time agent status monitoring
- Task queue visualization
- System performance metrics
- Interactive agent controls

### Agent Management
- Create and configure agents
- Start/stop agent operations
- Monitor agent health and performance
- View agent communication logs

### Task Monitoring
- Submit new tasks to the system
- Track task progress and status
- View task execution history
- Analyze task performance metrics

## Technology Stack

- React 18+ with TypeScript
- WebSocket for real-time updates
- Chart.js for data visualization
- Tailwind CSS for styling
- React Router for navigation
