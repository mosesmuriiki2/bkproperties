# GlobalHub System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│                    http://localhost:5173                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Login      │  │  Register    │  │  Dashboards  │           │
│  │   Page       │  │   Page       │  │  (3 types)   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Marketplace │  │  Navigation  │  │  Protected   │           │
│  │  Pages       │  │  Layout      │  │  Routes      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              AuthContext (State Management)              │   │
│  │  - User info, tokens, authentication state              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              API Client (apiClient.js)                   │   │
│  │  - JWT token handling                                    │   │
│  │  - Authorization headers                                 │   │
│  │  - Error handling (401 redirect)                         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP/REST API Calls
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  API Gateway (Spring Cloud)                      │
│                    http://localhost:7071                         │
├─────────────────────────────────────────────────────────────────┤
│  - Request routing to microservices                              │
│  - CORS configuration                                            │
│  - Authentication token validation                               │
│  - Load balancing                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Auth Service    │  │  User Service    │  │  Vendor Service  │
│  Port: 7072      │  │  Port: 7073      │  │  Port: 7074      │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ - Register       │  │ - Get Profile    │  │ - Register       │
│ - Login          │  │ - Update Profile │  │ - Get Vendors    │
│ - Refresh Token  │  │ - Get Addresses  │  │ - Get Products   │
│ - Validate Token │  │ - Add Address    │  │ - Analytics      │
│                  │  │ - Get Orders     │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        ↓                     ↓                     ↓
        └─────────────────────┼─────────────────────┘
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Product Service  │  │  Hotel Service   │  │ Property Service │
│  Port: 7075      │  │  Port: 7076      │  │  Port: 7077      │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ - Get Products   │  │ - Get Hotels     │  │ - Get Properties │
│ - Create Product │  │ - Get Rooms      │  │ - Search         │
│ - Update Product │  │ - Book Hotel     │  │ - Get Details    │
│ - Delete Product │  │ - Check Avail.   │  │                  │
│ - Search         │  │ - Get Bookings   │  │                  │
│ - Categories     │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        ↓                     ↓                     ↓
        └─────────────────────┼─────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL Database                                │
│                    Port: 3306                                    │
├─────────────────────────────────────────────────────────────────┤
│  Tables:                                                          │
│  - users (with role support)                                     │
│  - vendors                                                        │
│  - products                                                       │
│  - hotels                                                         │
│  - rooms                                                          │
│  - hotel_bookings                                                 │
│  - orders                                                         │
│  - payments                                                       │
│  - addresses                                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Service Discovery Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  Eureka Service Registry                         │
│                    Port: 7070                                    │
├─────────────────────────────────────────────────────────────────┤
│  Registered Services:                                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Service Name          │ Port │ Status                    │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ globalhub-gateway     │ 7071 │ UP                        │   │
│  │ globalhub-auth        │ 7072 │ UP                        │   │
│  │ globalhub-user        │ 7073 │ UP                        │   │
│  │ globalhub-vendor      │ 7074 │ UP                        │   │
│  │ globalhub-product     │ 7075 │ UP                        │   │
│  │ globalhub-hotel       │ 7076 │ UP                        │   │
│  │ globalhub-property    │ 7077 │ UP (pending)              │   │
│  │ globalhub-tour        │ 7078 │ UP (pending)              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Features:                                                        │
│  - Service registration and discovery                             │
│  - Health checks                                                  │
│  - Load balancing                                                 │
│  - Failover support                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Registration                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User fills registration form                                 │
│     ↓                                                             │
│  2. Frontend validates input                                     │
│     ↓                                                             │
│  3. POST /api/auth/register                                      │
│     ↓                                                             │
│  4. Auth Service receives request                                │
│     ↓                                                             │
│  5. Hash password with BCrypt                                    │
│     ↓                                                             │
│  6. Save user to database                                        │
│     ↓                                                             │
│  7. Generate JWT token                                           │
│     ↓                                                             │
│  8. Return token and user info                                   │
│     ↓                                                             │
│  9. Frontend stores token in localStorage                        │
│     ↓                                                             │
│  10. Redirect to appropriate dashboard                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      User Login                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User enters email and password                               │
│     ↓                                                             │
│  2. POST /api/auth/login                                         │
│     ↓                                                             │
│  3. Auth Service receives request                                │
│     ↓                                                             │
│  4. Find user by email                                           │
│     ↓                                                             │
│  5. Compare password with hash                                   │
│     ↓                                                             │
│  6. If valid: Generate JWT token                                 │
│     ↓                                                             │
│  7. Return token and user info                                   │
│     ↓                                                             │
│  8. Frontend stores token in localStorage                        │
│     ↓                                                             │
│  9. Redirect to appropriate dashboard                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   Protected Route Access                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User tries to access protected route                         │
│     ↓                                                             │
│  2. ProtectedRoute component checks localStorage                 │
│     ↓                                                             │
│  3. If no token: Redirect to /login                              │
│     ↓                                                             │
│  4. If token exists: Check user role                             │
│     ↓                                                             │
│  5. If wrong role: Redirect to appropriate dashboard             │
│     ↓                                                             │
│  6. If correct role: Display component                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    API Request with Token                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Frontend makes API request                                   │
│     ↓                                                             │
│  2. getAuthHeaders() retrieves token from localStorage           │
│     ↓                                                             │
│  3. Add Authorization header: Bearer {token}                     │
│     ↓                                                             │
│  4. Send request to Gateway                                      │
│     ↓                                                             │
│  5. Gateway validates token                                      │
│     ↓                                                             │
│  6. If valid: Route to service                                   │
│     ↓                                                             │
│  7. If invalid (401): Return error                               │
│     ↓                                                             │
│  8. Frontend receives 401: Redirect to /login                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    Frontend (React)                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Components (Pages, Dashboards, Marketplace)              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  AuthContext (State Management)                            │  │
│  │  - user: { id, email, firstName, lastName, role }         │  │
│  │  - isAuthenticated: boolean                                │  │
│  │  - accessToken: JWT token                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  API Client (apiClient.js)                                 │  │
│  │  - Adds Authorization header                               │  │
│  │  - Handles 401 errors                                      │  │
│  │  - Manages token refresh                                   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  localStorage                                               │  │
│  │  - accessToken: JWT token                                  │  │
│  │  - user: { id, email, firstName, lastName, role }         │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                          ↓
                    HTTP/REST API
                          ↓
┌──────────────────────────────────────────────────────────────────┐
│                    API Gateway                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  - Validates JWT token                                     │  │
│  │  - Routes to appropriate service                           │  │
│  │  - Handles CORS                                            │  │
│  │  - Load balancing                                          │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
    Auth Service      User Service    Vendor Service
        ↓                 ↓                 ↓
    ┌───────┐         ┌───────┐        ┌───────┐
    │ Users │         │ Users │        │Vendors│
    │ Table │         │ Table │        │ Table │
    └───────┘         └───────┘        └───────┘
```

## User Role Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Roles                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    CONSUMER                              │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Dashboard: /consumer-dashboard                           │   │
│  │ Permissions:                                             │   │
│  │  - Browse marketplace                                    │   │
│  │  - Make bookings                                         │   │
│  │  - View order history                                    │   │
│  │  - Manage profile                                        │   │
│  │  - Manage addresses                                      │   │
│  │  - View wishlist                                         │   │
│  │  - Update settings                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     VENDOR                               │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Dashboard: /vendor-dashboard                             │   │
│  │ Permissions:                                             │   │
│  │  - Add/edit/delete products                              │   │
│  │  - View orders                                           │   │
│  │  - Track sales and revenue                               │   │
│  │  - Manage inventory                                      │   │
│  │  - View customer feedback                                │   │
│  │  - View analytics                                        │   │
│  │  - Update business info                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     ADMIN                                │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ Dashboard: /admin-dashboard                              │   │
│  │ Permissions:                                             │   │
│  │  - Manage all users                                      │   │
│  │  - Approve/reject vendors                                │   │
│  │  - View platform analytics                               │   │
│  │  - Monitor system health                                 │   │
│  │  - Manage orders                                         │   │
│  │  - View reports                                          │   │
│  │  - System configuration                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **Data Fetching**: TanStack Query
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 21
- **Microservices**: Spring Cloud
- **Service Discovery**: Eureka
- **API Gateway**: Spring Cloud Gateway
- **Security**: Spring Security + JWT
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA
- **Build Tool**: Maven
- **Containerization**: Docker

### Infrastructure
- **Database**: MySQL 8.0
- **Container Orchestration**: Docker Compose
- **Service Registry**: Eureka
- **API Gateway**: Spring Cloud Gateway
- **Load Balancing**: Built-in (Eureka)

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Production Environment                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Load Balancer (Nginx)                        │   │
│  │              Port: 80/443                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Frontend (React - Static Files)                │   │
│  │           Served via CDN or Web Server                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              API Gateway (Spring Cloud)                  │   │
│  │              Port: 8080 (internal)                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Microservices (Docker Containers)                │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │   │
│  │  │ Auth Svc   │ │ User Svc   │ │ Vendor Svc │ ...       │   │
│  │  └────────────┘ └────────────┘ └────────────┘           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              MySQL Database (RDS)                         │   │
│  │              Multi-AZ deployment                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Security Layers                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Layer 1: HTTPS/TLS                                              │
│  ├─ All traffic encrypted                                        │
│  └─ Certificate management                                       │
│                                                                   │
│  Layer 2: CORS                                                   │
│  ├─ Origin validation                                            │
│  └─ Method restrictions                                          │
│                                                                   │
│  Layer 3: Authentication (JWT)                                   │
│  ├─ Token generation                                             │
│  ├─ Token validation                                             │
│  └─ Token expiration                                             │
│                                                                   │
│  Layer 4: Authorization (Role-Based)                             │
│  ├─ Role verification                                            │
│  ├─ Permission checking                                          │
│  └─ Resource access control                                      │
│                                                                   │
│  Layer 5: Input Validation                                       │
│  ├─ Type checking                                                │
│  ├─ Length validation                                            │
│  └─ Format validation                                            │
│                                                                   │
│  Layer 6: Password Security                                      │
│  ├─ BCrypt hashing                                               │
│  ├─ Salt generation                                              │
│  └─ Strength requirements                                        │
│                                                                   │
│  Layer 7: Database Security                                      │
│  ├─ Parameterized queries                                        │
│  ├─ SQL injection prevention                                     │
│  └─ Access control                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Summary

The GlobalHub system is built on a modern microservices architecture with:
- **Frontend**: React-based SPA with JWT authentication
- **Backend**: Spring Boot microservices with Eureka discovery
- **Database**: MySQL with proper schema and relationships
- **Security**: Multi-layer security with JWT, CORS, and role-based access
- **Scalability**: Microservices design allows independent scaling
- **Reliability**: Service discovery and load balancing for high availability

---

**Last Updated**: March 10, 2026
