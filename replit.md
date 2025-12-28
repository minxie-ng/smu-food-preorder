# Campus Food Pre-Order App

## Overview

Campus Food is a mobile-first food pre-ordering application built for university campuses. The app allows students to browse food vendors, view menus, add items to cart, select pickup times, and place orders. It's built using Expo/React Native for cross-platform mobile and web support, with an Express.js backend API.

The application follows a vendor → menu → pickup time → confirmation flow, with a bottom tab navigation separating the ordering flow from order history viewing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Expo (React Native) with React 19
- **Navigation**: React Navigation with a nested navigator structure
  - Root Stack Navigator → Main Tab Navigator → Order Stack + History Stack
  - Stack-based navigation for the order flow (VendorList → VendorMenu → PickupTime → Confirmation)
  - Bottom tabs for switching between Order and History sections
- **State Management**: React Context (AppContext) for global app state including cart, selected vendor, and orders
- **Data Fetching**: TanStack React Query for server state management
- **Styling**: StyleSheet API with a centralized theme system (Colors, Spacing, Typography constants)
- **Animations**: React Native Reanimated for fluid UI animations

### Backend Architecture
- **Framework**: Express.js running on Node.js
- **API Pattern**: RESTful API with `/api` prefix for all routes
- **CORS**: Dynamic origin-based CORS handling for Replit deployment domains
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Storage Layer**: Abstracted through IStorage interface with in-memory implementation (MemStorage) as default

### Data Layer
- **Schema Definition**: Shared schema in `shared/schema.ts` using Drizzle ORM
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Current Entities**: Users table with id, username, password fields
- **Mock Data**: Client-side mock data for vendors, menu items, and orders in `client/data/mockData.ts`

### Code Organization
```
client/          # React Native/Expo frontend
  ├── components/    # Reusable UI components
  ├── screens/       # Screen components
  ├── navigation/    # Navigation configuration
  ├── context/       # React Context providers
  ├── hooks/         # Custom React hooks
  ├── constants/     # Theme and configuration
  ├── data/          # Mock data
  └── lib/           # Utilities (query client, API helpers)

server/          # Express.js backend
  ├── index.ts       # Server entry point
  ├── routes.ts      # API route definitions
  └── storage.ts     # Data storage abstraction

shared/          # Shared code between client/server
  └── schema.ts      # Drizzle database schema
```

### Path Aliases
- `@/` → `./client/`
- `@shared/` → `./shared/`

### Design Decisions
- **No Authentication Required**: App assumes user is already logged in (mock profile data)
- **Theming**: Automatic light/dark mode support using system preferences
- **Platform Support**: iOS, Android, and Web via Expo
- **Blur Effects**: Platform-specific blur effects for navigation elements on iOS

## External Dependencies

### Database
- **PostgreSQL**: Primary database via Drizzle ORM
- **Connection**: Requires `DATABASE_URL` environment variable

### Key Third-Party Libraries
- **Expo SDK 54**: Core mobile development platform
- **React Navigation 7.x**: Navigation framework
- **TanStack React Query 5.x**: Server state management
- **Drizzle ORM**: Type-safe database operations
- **Zod**: Runtime type validation

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required for database operations)
- `EXPO_PUBLIC_DOMAIN`: API server domain for client requests
- `REPLIT_DEV_DOMAIN`: Development domain (Replit-specific)
- `REPLIT_DOMAINS`: Allowed CORS origins (Replit-specific)

### Build & Development
- **Development**: `npm run server:dev` (backend) + `npm run expo:dev` (frontend)
- **Database Migrations**: `npm run db:push` (Drizzle Kit)
- **Production Build**: `npm run expo:static:build` + `npm run server:build`