# ChessVerse

ChessVerse is a modern chess platform built with **TypeScript** and **React**, organized as a **Turborepo monorepo**.  
It offers three exciting game modes — **Rapid**, **Blitz**, and **Normal** — and also lets you **play against AI** or challenge real opponents in real-time.

## Features

- Play chess online with real opponents
- Challenge an AI opponent
- Multiple time controls: Rapid, Blitz, Normal
- Real-time multiplayer with WebSocket
- Modern UI built with React and TailwindCSS
- Monorepo structure with Turborepo for scalability
- Shared UI components and database utilities

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

This monorepo uses **Turborepo** to manage apps and shared packages.

## Getting Started

### Prerequisites

- Node.js 16.x or higher  
- pnpm (recommended) or npm  

### Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/Jayesh-Prajapati9/ChessVerse.git
cd ChessVerse
pnpm install
```

## Development

Run all apps in development mode:

```sh
pnpm dev
```

Run a specific app only:

```sh
# Start frontend only
pnpm dev --filter=web

# Start backend only
pnpm dev --filter=api
```

## Building

Build everything:

```sh
pnpm build
```

Build individual apps:

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
  - ESLint for linting  
  - TypeScript for type safety  
  - Prettier for formatting  

## Remote Caching with Turborepo

This repository supports **remote caching** via Turborepo. To enable:

1. Login to Vercel:

```sh
pnpm turbo login
```

2. Link your repository:

```sh
pnpm turbo link
```

## Available Scripts

- `pnpm dev` – Start development environment  
- `pnpm build` – Build all applications  
- `pnpm lint` – Run ESLint across all projects  
- `pnpm format` – Format code with Prettier  
- `pnpm test` – Run tests across projects  

## Contributing

1. Create a new branch  
2. Make your changes  
3. Submit a pull request  
