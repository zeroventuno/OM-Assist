# OM Assistenza - Technical Support Ticket Management System

## Overview

OM Assistenza is a comprehensive ticket management system designed for bicycle component technical support and warranty processing. The application enables tracking of support tickets through multiple phases (Entrada, Enviado, Em processamento, Finalizado) with detailed history tracking, approval workflows, and shipping management.

The system is built as a full-stack web application with a React frontend and Express backend, using PostgreSQL for data persistence. It emphasizes clean information hierarchy, workflow efficiency, and professional presentation suitable for technical support operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, providing fast HMR and optimized production builds
- **Wouter** for lightweight client-side routing (single-page application)
- **TanStack Query (React Query)** for server state management, data fetching, and cache invalidation

**UI Component Library**
- **shadcn/ui** component system (New York style variant) built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Class Variance Authority (CVA)** for component variant management
- Comprehensive design system with custom color palettes, spacing primitives, and typography (Inter for UI, Space Grotesk for headings)

**Form Management**
- **React Hook Form** for performant form state management
- **Zod** for runtime schema validation integrated with form validation via `@hookform/resolvers`

**Component Structure**
- Modular component architecture with reusable UI primitives (`/components/ui`)
- Feature-specific components (`DashboardMetrics`, `TicketTable`, `TicketForm`, `TicketModal`)
- Clear separation between presentational and container components

### Backend Architecture

**Server Framework**
- **Express.js** running on Node.js with ES modules
- RESTful API design with resource-based endpoints (`/api/tickets`)
- TypeScript for type safety across the entire stack

**Data Access Pattern**
- Abstracted storage interface (`IStorage`) allowing for different implementations
- Current implementation uses **PostgreSQL database** via `DatabaseStorage`
- Database connection managed through Drizzle ORM with Neon serverless driver
- All data persists between server restarts

**API Endpoints**
- `GET /api/tickets` - Retrieve all tickets (sorted by creation date)
- `GET /api/tickets/:id` - Retrieve single ticket
- `POST /api/tickets` - Create new ticket
- `PATCH /api/tickets/:id` - Update existing ticket
- `DELETE /api/tickets/:id` - Delete ticket

**Validation & Schema**
- Shared schema definitions between client and server using Zod
- Schema located in `/shared/schema.ts` for type consistency
- Request validation at API boundary using `insertTicketSchema` and `updateTicketSchema`

### Data Model

**Core Entity: Ticket**
- Client information (name, email)
- Component details (type, brand, serial number)
- Problem description and protocol number
- Approval status workflow (Aprovado/Negado)
- Phase tracking (Entrada → Enviado → Em processamento → Finalizado)
- Shipping information (date, tracking number, company)
- Automatic history tracking with field-level audit trail
- Timestamps for creation and completion

**History Tracking**
- JSON-based history entries stored as array
- Each entry captures: field name, old value, new value, timestamp, action type
- Supports "created" and "updated" actions
- Enables full audit trail of ticket lifecycle

### Database Architecture

**ORM: Drizzle**
- Schema defined in `shared/schema.ts` using Drizzle's PostgreSQL schema builder
- Migration system configured via `drizzle.config.ts`
- PostgreSQL database with Neon serverless driver (`@neondatabase/serverless`)
- Database connection via `server/db.ts`

**Schema Design**
- Single `tickets` table with JSONB column for flexible history storage
- UUID primary keys (varchar) with automatic generation via `gen_random_uuid()`
- Timestamp columns with automatic `defaultNow()`
- Text fields for most data with optional values as nullable columns
- JSONB `history` column stores array of HistoryEntry objects for complete audit trail

**Migration Strategy**
- Push-based workflow via `db:push` script (no manual migrations)
- Environment-based database connection via `DATABASE_URL`
- All data persists across server restarts

### Development & Build Pipeline

**Development Environment**
- Vite dev server with middleware mode integrated into Express
- HMR (Hot Module Replacement) for rapid frontend iteration
- TypeScript compilation checking via `tsc --noEmit`
- Path aliases configured (`@/`, `@shared/`, `@assets/`)

**Production Build**
- Frontend: Vite production build to `dist/public`
- Backend: esbuild bundling with external packages, ESM output
- Single `dist/` directory for deployment
- Static asset serving from built frontend

**Code Quality**
- Strict TypeScript configuration with full type checking
- ESM module system throughout (no CommonJS)
- Skip lib check for faster compilation with third-party types

### State Management Strategy

**Server State (TanStack Query)**
- Query keys based on API endpoints (e.g., `["/api/tickets"]`)
- Automatic cache invalidation after mutations
- Optimistic updates not implemented (refetch on success pattern)
- Infinite stale time with manual refetching on mutations

**Local UI State**
- React's useState for component-level state (modals, search, expansion)
- Form state managed by React Hook Form
- No global state management library (Redux, Zustand, etc.)

**Design Decision Rationale**
- TanStack Query eliminates need for separate global state for server data
- Simple local state sufficient for current UI complexity
- May need global state if cross-component shared UI state increases

## External Dependencies

### Database & ORM
- **PostgreSQL** - Primary database (configured via Neon serverless)
- **Drizzle ORM** - Type-safe database toolkit with schema migrations
- **@neondatabase/serverless** - Serverless PostgreSQL driver for Neon

### UI Component Library
- **Radix UI** - Headless component primitives (20+ components including Dialog, Dropdown, Select, Toast, etc.)
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library (via Radix dependencies)

### Form & Validation
- **React Hook Form** - Performant form state management
- **Zod** - TypeScript-first schema validation
- **drizzle-zod** - Drizzle to Zod schema generation

### Date Management
- **date-fns** - Modern JavaScript date utility library with locale support (pt-BR)

### Development Tools
- **Vite** - Frontend build tool and dev server
- **esbuild** - Fast JavaScript bundler for backend
- **tsx** - TypeScript execution environment for Node.js

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal** - Enhanced error display
- **@replit/vite-plugin-cartographer** - Replit development features
- **@replit/vite-plugin-dev-banner** - Development mode indicator

### Font Resources
- **Google Fonts** - Inter, Space Grotesk, DM Sans, Fira Code, Geist Mono, Architects Daughter
- Fonts loaded via HTML link tags with preconnect optimization

### Session Management (Configured)
- **connect-pg-simple** - PostgreSQL session store for Express sessions (dependency present but not actively used in current implementation)