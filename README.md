## ArtToy Pre-Order - ArtToy PreOrder System API

YourArtToy is a RESTful API for an ArtToy PreOrder System API with user authentication and role-based access control.

## 🚀 Features

### Authentication System
- User registration and login with JWT tokens
- Password hashing using bcryptjs
- Role-based authorization (staff/admin)
- Protected routes with middleware

### Core Entities
- **Users:** Registration, login, profile management. There are two types of user 'admin' and 'member'.
- **ArtToys:** CRUD operations for art toy management to manage available art toys.
- **Orders:** orders linking Users to ArtToys

### Database Schema
- **User Model:** name, email, tel, password, role, timestamps
- **ArtToy Model:** sku, name, description, arrivalDate, availableQuota, posterPicture
- **Order Model:** user reference, art toy reference, orderAmount

### API Structure
- **Auth Routes (/api/v1/auth):** register, login, logout, get profile
- **ArtToy Routes (/api/v1/arttoys):** CRUD operations for art toys
- **Order Routes (/api/v1/order):** CRUD operations for pre-order

### Access Control / Controllers 
- After login, registered admin user can add/update/delete/view any art toy. For adding the art toy, the arrivalDate cannot be earlier than the current date.
- After login, registered member user can submit pre-order request for the art toy. The art toy list is provided to the user. Art Toy information is also available. For each order, a member user can pre-order for upto amount of 5 art toy. Each member user can place only 1 order per art toy.
- Registered member user can view his/her own pre-order requests
- Registered member user can edit his/her own pre-order request 
- Registered member user can delete his/her own pre-order request 
- Registered admin user can view any pre-order request 
- Registered admin user can edit any pre-order request 
- Registered admin user can delete any pre-order request 

### Security Features
- JWT-based authentication
- Rate limiting (100 requests per 10 minutes)
- Helmet for security headers
- XSS protection
- MongoDB injection protection
- CORS enabled

### Documentation
- Swagger/OpenAPI documentation integrated
- Available at /api-docs endpoint

### Technology Stack
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose ODM
**Authentication:** JWT, bcryptjs
**Security:** helmet, xss-clean, express-rate-limit
**Documentation:** Swagger UI

### Development Setup
- Uses nodemon for development
- Environment variables in config/config.env
- MongoDB connection with mongoose

The project follows RESTful API conventions with proper middleware, error handling, and security measures.
