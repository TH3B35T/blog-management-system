# Blog Management System

A RESTful API for managing blog posts with user authentication and authorization. Built with NestJS, TypeScript, and PostgreSQL.

## Features

- User authentication with JWT
- Role-based access control (Admin, Editor, User)
- Blog post management (CRUD operations)
- Pagination and filtering for blog posts
- PostgreSQL database with TypeORM
- API documentation with Swagger
- Docker containerization

## Tech Stack

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT, Passport.js, bcrypt
- **API Documentation**: Swagger
- **Containerization**: Docker, Docker Compose

## Prerequisites

- Docker and Docker Compose

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/blog-management-system.git
cd blog-management-system
```

### 2. Create environment files

Create `.env.production` and `.env.development` file in the project root:

Follow the instrections in `.env.example`

### 3. Start the application with Docker Compose

## For DEV using docker image "postgres & pgadmin"
```bash
docker-compose up -d
```

## For PRODUCTION using postgres "deployed on neon"
```bash
docker-compose.prod.yml up -d
```

The application will be available at:
- API: http://localhost:3000
- API Documentation: http://localhost:3000/api
- PGAdmin (Database UI): http://localhost:5050 (login with admin@admin.com / admin)


## Deployment

### Deployed Version

- **API URL**: https://blog-management-api.onrender.com
- **API Documentation**: https://blog-management-api.onrender.com/api
- **Database**: PostgreSQL hosted on Neon

### Deployment Instructions

#### Database Setup (ElephantSQL)

1. Create a free PostgreSQL database on [ElephantSQL](https://www.elephantsql.com/)
2. Copy the connection URL from your instance details

#### API Deployment (Render)

1. Fork/clone this repository to your GitHub account
2. Sign up on [Render](https://render.com/)
3. Create a new Web Service and connect your GitHub repository
4. Configure the service:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
5. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection URL
   - `JWT_SECRET`: A secure random string
   - `JWT_EXPIRATION_TIME`: Token lifetime in seconds (e.g., 3600)
   - `NODE_ENV`: Set to "production"

The service will automatically deploy when you push changes to your repository.

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Users

- `GET /users/:id` - Get user by ID (authenticated)

### Blogs

- `GET /blogs` - Get all blogs with pagination and filtering
- `GET /blogs/:id` - Get blog by ID
- `POST /blogs` - Create a new blog (Admin, Editor)
- `PATCH /blogs/:id` - Update a blog (Admin, Editor, Owner)
- `DELETE /blogs/:id` - Delete a blog (Admin, Owner)
- `GET /blogs/author/:authorId` - Get blogs by author

## Role-Based Access

- **Admin**: Can create, update, and delete any blog post
- **Editor**: Can create and update blog posts (but only delete their own)
- **User**: Can read blog posts

## Testing the API

There is a seeder to create initial users like admin and editor to start with, you don't have to create them unless they have been deleted.

### 1. Register a new admin user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "password123",
    "role": "admin"
  }'
```

### 2. Login and get token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "admin",
    "password": "password123"
  }'
```

Save the returned token for subsequent requests.

### 3. Create a blog post

```bash
curl -X POST http://localhost:3000/blogs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post.",
    "tags": ["nestjs", "tutorial"]
  }'
```

### 4. Get all blog posts

```bash
curl -X GET http://localhost:3000/blogs
```

## Development

### Run tests

```bash
docker-compose exec api npm run test
```

### Access the container shell

```bash
docker-compose exec api sh
```

## Database Schema

- **users**
  - id (uuid)
  - username (varchar, unique)
  - email (varchar, unique)
  - password (varchar, hashed)
  - role (enum: admin, editor, user)
  - createdAt (timestamp)
  - updatedAt (timestamp)

- **blogs**
  - id (uuid)
  - title (varchar)
  - content (text)
  - tags (simple-array)
  - authorId (uuid, foreign key)
  - createdAt (timestamp)
  - updatedAt (timestamp)

## Project Structure

```
src/
├── app.module.ts                  # Main application module
├── main.ts                        # Application entry point
├── common/                        # Common utilities and helpers
│   ├── decorators/               # Custom decorators
│   ├── enums/                     # Enumerations
│   ├── guards/                    # Guards for route protection
├── modules/                       # Feature modules
│   ├── auth/                      # Authentication module
│   ├── users/                     # Users module
│   └── blogs/                     # Blogs module
```

## Troubleshooting

### Common Issues

1. **Database connection errors**:
   - Verify PostgreSQL container is running: `docker-compose ps`
   - Check database logs: `docker-compose logs postgres`

2. **Authentication issues**:
   - Ensure JWT_SECRET is set correctly
   - Verify token expiration time (JWT_EXPIRATION_TIME)

3. **Permission denied errors**:
   - Confirm the user has the required role for the operation
   - Check token payload for correct role information
