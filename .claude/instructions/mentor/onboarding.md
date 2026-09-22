# Onboarding Guide

Welcome to the ApnaNest project! This guide will help you get your environment set up and understand the project quickly.

## Prerequisites

- **Node.js**: v20 or later.
- **.NET SDK**: v8.0 or later.
- **Docker**: For running PostgreSQL and Redis locally.
- **PostgreSQL**: v16.
- **Git**: For version control.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd apnanest
   ```

2. **Set up the Database**:
   - Start the infrastructure using Docker:
     ```bash
     docker-compose up -d
     ```
   - Run the SQL scripts in `backend/` to seed the database if needed.

3. **Backend Setup**:
   - Navigate to `backend/`:
     ```bash
     cd backend
     dotnet restore
     dotnet run --project src/ApnaNest.API
     ```

4. **Frontend Setup**:
   - Navigate to `frontend/`:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```

## Key Documentation to Read

1. **`CLAUDE.md`**: High-level rules and project overview.
2. **`PRD.md`**: Product requirements and goals.
3. **`ARCHITECTURE.md`**: System design and tech stack details.
4. **`.claude/instructions/vibe-coding.md`**: How to work with the AI effectively.

## Common Tasks

- **Adding a new feature**: Follow the [Git Standards](git-standards.md) and [Coding Standards](coding-standards.md).
- **Running tests**: 
  - Backend: `dotnet test`
  - Frontend: `npm test`
- **Linting**: `npm run lint` (frontend).
