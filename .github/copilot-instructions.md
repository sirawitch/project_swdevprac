# AI Agent Instructions for Art Toy Pre-Order System

## Project Overview
Full-stack application for managing art toy pre-orders with role-based access control:
- Frontend: Next.js (TypeScript) for the client interface
- Backend: Express.js REST API with MongoDB
- Authentication: JWT-based with role-based access (admin/member)

## Key Architecture Patterns

### Authentication Flow
- JWT tokens stored in localStorage, sent via Bearer authentication
- Protected routes use `middleware/auth.js` with `protect` and `authorize` middleware
- Two user roles: 'admin' and 'member' with different permissions
- Example token usage in frontend:
```typescript
const token = localStorage.getItem("token");
fetch(`${API_URL}/api/v1/auth/me`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

### API Structure
- Core routes with role-based access:
  - `/api/v1/auth/`: Authentication (register, login, logout, profile)
  - `/api/v1/arttoys/`: Art toy management (CRUD, search, filtering)
  - `/api/v1/orders/`: Order management with role-specific access

### Data Models
- **User**: `models/User.js` - name, email, tel, password(hashed), role
- **ArtToy**: `models/ArtToy.js` - sku, name, description, arrivalDate, availableQuota
- **Order**: `models/Order.js` - user reference, artToy reference, orderAmount(1-5)

### Business Rules
1. Art Toys:
   - Admin can CRUD art toys
   - arrivalDate must be future date
   - availableQuota tracks remaining pre-order slots

2. Orders:
   - Members can order 1-5 items per art toy
   - One order per art toy per member
   - Members can only view/edit their own orders
   - Admin can view/edit all orders

## Development Workflow

### Environment Setup
1. Backend (`backend/config/config.env`):
```env
PORT=5001
NODE_ENV=development
MONGO_URI=<mongodb-uri>
JWT_SECRET=<secret>
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
FRONTEND_URL=http://localhost:3000
```

2. Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Common Tasks
1. Development servers:
```bash
# Backend + Frontend
make dev

# Docker development
docker-compose -f docker-compose.dev.yml up -d --build
```

2. Production deployment:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Key Integration Points
1. Cross-domain communication:
   - Frontend uses `NEXT_PUBLIC_API_URL` for API calls
   - Backend allows CORS from `FRONTEND_URL`
   - Swagger docs at `http://localhost:5001/api-docs`

2. Component integration:
   - Frontend components in `frontend/src/components`
   - Theme context in `frontend/src/context/ThemeContext.tsx`
   - API routes protected via `backend/middleware/auth.js`

## Best Practices
1. Always use role-based auth middleware for protected routes
2. Validate order amounts (1-5) and available quota
3. Keep JWT token handling in dedicated auth context/hooks
4. Follow REST API patterns in controllers
5. Use Swagger docs for API documentation