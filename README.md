# ChessVerse

A modern chess platform built with TypeScript and React.

## Project Structure

```
ChessVerse/
├── apps/
│   ├── api/        # Backend API server
│   ├── web/        # Frontend React application
│   └── ws/         # WebSocket server
├── packages/
│   ├── db/         # Database schemas and utilities
│   ├── eslint-config/
│   ├── typescript-config/
│   └── ui/         # Shared UI component library
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```sh
git clone https://github.com/Jayesh-Prajapati9/ChessVerse.git
cd ChessVerse
```

2. Install dependencies:

```sh
pnpm install
```

## Development

Start all applications in development mode:

```sh
pnpm dev
```

Or start specific apps:

```sh
# Start frontend only
pnpm dev --filter=web

# Start backend only
pnpm dev --filter=api
```

## Building

Build all applications:

```sh
pnpm build
```

Build specific apps:

```sh
pnpm build --filter=web
pnpm build --filter=api
```

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + TypeScript
- **Database**: PostgreSQL
- **Real-time**: WebSocket
- **Tooling**:
  - Turborepo for monorepo management
  - ESLint for code linting
  - TypeScript for type safety
  - Prettier for code formatting

## Remote Caching

This project uses Turborepo's remote caching feature. To enable it:

1. Login to Vercel:

```sh
pnpm turbo login
```

2. Link your repository:

```sh
pnpm turbo link
```

## Available Scripts

- `pnpm dev` - Start development environment
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all projects
- `pnpm format` - Format code using Prettier
- `pnpm test` - Run tests across projects

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request
