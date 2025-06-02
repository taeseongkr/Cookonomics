# Backend - Multi-Agent System

This directory contains the backend implementation of the multi-agent system.

## Directory Structure

- **src/agents/**: Core agent implementations
  - `agent_types/`: Different specialized agent classes
  - `communication/`: Inter-agent communication protocols
  - `coordination/`: Agent coordination and consensus mechanisms
  - `task_manager/`: Task distribution and management

- **src/core/**: Core system components
  - `messaging/`: Message passing and routing system
  - `orchestrator/`: Main system orchestrator
  - `scheduler/`: Task and resource scheduling

- **src/services/**: External services and integrations
  - `websocket/`: Real-time communication service
  - `queue/`: Message queue management
  - `monitoring/`: System health and performance monitoring

- **src/api/**: REST API endpoints
- **src/models/**: Data models and schemas
- **src/database/**: Database connection and operations
- **src/middleware/**: Express middleware functions
- **src/utils/**: Utility functions and helpers
- **src/config/**: Configuration management

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get agent details
- `POST /api/tasks` - Submit new task
- `GET /api/tasks/:id/status` - Get task status
- `WebSocket /ws` - Real-time updates

## Agent Types

- **Worker Agents**: Execute specific tasks
- **Coordinator Agents**: Manage task distribution
- **Monitor Agents**: System health monitoring
- **Gateway Agents**: External communication
