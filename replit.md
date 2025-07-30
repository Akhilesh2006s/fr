# Learning Platform - AI-Powered Educational System

## Overview

This is a full-stack educational platform built with React, Express, and PostgreSQL, featuring AI-powered tutoring capabilities. The application provides personalized learning experiences through video lectures, practice tests, and intelligent AI assistance tailored to individual student needs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Middleware**: Express middleware for request logging and error handling
- **Development**: Hot reloading with Vite integration

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Serverless-compatible database connections

## Key Components

### Authentication System
- User registration and login with email/password
- User profile management with educational preferences
- Age-based content filtering and recommendations

### Content Management
- **Video Lectures**: Structured by subjects, topics, and difficulty levels
- **Practice Tests**: Exam-specific tests with question banks
- **AI Features**: Integrated AI capabilities for enhanced learning

### AI Integration
- **OpenAI Integration**: GPT-4o for intelligent tutoring
- **Contextual Responses**: AI responses based on user progress and current content
- **Test Analysis**: Automated performance analysis with recommendations
- **Chat System**: Real-time AI tutoring with conversation history

### User Experience
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Progressive Enhancement**: Works across different device capabilities
- **Accessibility**: ARIA labels and keyboard navigation support

## Data Flow

### Client-Server Communication
1. Frontend makes API requests using TanStack Query
2. Express server handles requests with middleware processing
3. Database operations through Drizzle ORM
4. JSON responses with error handling

### AI Processing Flow
1. User interactions trigger AI context gathering
2. OpenAI API integration processes requests
3. Responses stored in chat sessions
4. Performance analysis generates insights

### Content Delivery
1. Video content served with metadata
2. Test questions dynamically loaded
3. Progress tracking across sessions
4. Personalized recommendations based on performance

## External Dependencies

### Core Technologies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Components**: Radix UI primitives, Lucide React icons
- **Database**: Neon PostgreSQL, Drizzle ORM
- **AI Services**: OpenAI API for GPT-4o integration
- **Development**: Vite, TypeScript, Tailwind CSS

### Third-Party Services
- **OpenAI API**: For AI tutoring and content analysis
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit Integration**: Development environment support

### Key Libraries
- **Data Fetching**: TanStack Query for server state
- **Validation**: Zod for runtime type checking
- **Styling**: Tailwind CSS with CSS variables
- **Date Handling**: date-fns for date utilities
- **Session Management**: connect-pg-simple for PostgreSQL sessions

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reloading
- **Database**: Environment-based DATABASE_URL configuration
- **AI Services**: OpenAI API key configuration
- **Asset Handling**: Vite asset pipeline with path resolution

### Production Build
- **Frontend**: Static asset generation via Vite build
- **Backend**: ESBuild bundling for Node.js deployment  
- **Database**: Production PostgreSQL with migration support
- **Environment**: NODE_ENV-based configuration switching

### Configuration Management
- Environment variables for database and API keys
- TypeScript path mapping for clean imports
- Tailwind configuration for design system consistency
- PostCSS pipeline for CSS processing

### Deployment Considerations
- Serverless-compatible database connections
- Static asset serving from dist/public
- API routes prefixed with /api
- Error boundary implementation for graceful failures