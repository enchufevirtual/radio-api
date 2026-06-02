# 💫 Radio Enchufe Virtual - API 💫

[![Node.js Version](https://img.shields.io/badge/Node.js-v18.14.2-green.svg)](https://nodejs.org/en/download/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

> A modern, scalable REST API built with Node.js, Express, and TypeScript for managing a virtual radio station with real-time chat, user management, and streaming capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
  - [Option 1: Docker (Recommended)](#option-1-docker-recommended)
  - [Option 2: Local Setup](#option-2-local-setup)
- [Configuration](#configuration)
- [Database](#database)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Support & Contact](#support--contact)

---

## Overview

**Radio Enchufe Virtual** is a full-featured API for managing a virtual radio station. It provides comprehensive functionality for:

- 🎙️ **Radio Management**: Stream management and station control
- 👥 **User Management**: Authentication, authorization, and user profiles
- 💬 **Real-time Chat**: WebSocket-powered instant messaging
- 📝 **Posts**: Content management system for radio updates
- 🤝 **Social Features**: User interactions and social networking
- 📤 **File Uploads**: Efficient image and audio handling with Sharp optimization
- 🔐 **Authentication**: JWT-based secure authentication with bcrypt password hashing
- 🌐 **CORS Support**: Configurable cross-origin resource sharing

This project is built with **TypeScript** for type safety, **Express.js** for routing, **Sequelize** for ORM, and **Socket.io** for real-time communication.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js v18.14.2 |
| **Language** | TypeScript 5.0+ |
| **Framework** | Express.js 4.18+ |
| **Database** | MariaDB 10.5+ |
| **ORM** | Sequelize 6.30+ |
| **Real-time** | Socket.io 4.6+ |
| **Authentication** | JWT + bcrypt |
| **File Upload** | Multer 1.4+ with Sharp optimization |
| **Validation** | Joi 17.9+ |
| **Container** | Docker + Docker Compose |

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required

- **Node.js** (v18.14.2 or higher)
  - [Download Node.js](https://nodejs.org/en/download/)
  - Verify: `node -v && npm -v`

- **Git**
  - [Download Git](https://git-scm.com/downloads)
  - Verify: `git --version`

### Optional (for Docker Setup)

- **Docker** (Desktop or Server)
  - [Install Docker](https://www.docker.com/get-started/)
  - Verify: `docker --version`

- **Docker Compose**
  - Usually included with Docker Desktop
  - Verify: `docker-compose --version`

---

## Quick Start

Get the API running in less than 5 minutes:

```bash
# 1. Clone the repository
git clone git@github.com:enchufevirtual/radio-api.git
cd radio-api

# 2. Install dependencies
npm install

# 3. Set up environment variables (see Configuration section)
cp .env.example .env
# Edit .env with your configuration

# 4. Start database with Docker Compose
docker-compose up -d

# 5. Run database migrations
npm run migrations:run

# 6. Start development server
npm run dev
```

The API will be available at `http://localhost:4000`

---

## Detailed Setup

### Option 1: Docker (Recommended)

This is the **recommended approach** for consistent development and easier deployment.

#### Step 1: Clone & Install

```bash
git clone git@github.com:enchufevirtual/radio-api.git
cd radio-api
npm install
```

#### Step 2: Configure Environment

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your specific configuration:

```env
# Node Environment
NODE_ENV=development

# Database Configuration
DB_HOST=mariadb          # Service name in docker-compose.yml
DB_NAME=radio_db
DB_USER=radio_user
DB_PASSWORD=secure_password_here
DB_ROOT_PASSWORD=root_password_here

# JWT Secret (use a strong, random string)
JWT_SECRET=your_secure_jwt_secret_key_here

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000
PORT=4000

# Zeno FM Configuration (for streaming)
ZENO_STATION_ID=your_station_id
ZENO_STREAM_ID=your_stream_id

# Email Configuration (NodeMailer)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

#### Step 3: Start Services

```bash
# Start MariaDB and phpMyAdmin containers
docker-compose up -d

# Verify containers are running
docker-compose ps
```

You should see:
- **mariadb** container running on port 3306
- **phpmyadmin** container running on port 8080

#### Step 4: Initialize Database

```bash
# Run all migrations to create database schema
npm run migrations:run

# Verify tables were created (optional)
# Access phpMyAdmin at http://localhost:8080
# User: your_db_user
# Password: your_db_password
```

#### Step 5: Start the API

```bash
# Development mode with hot reload
npm run dev
```

Success! API is running at `http://localhost:4000` ✅

---

### Option 2: Local Setup

For local database setup without Docker.

#### Step 1: Clone & Install

```bash
git clone git@github.com:enchufevirtual/radio-api.git
cd radio-api
npm install
```

#### Step 2: Set Up MariaDB

**On macOS (with Homebrew):**
```bash
brew install mariadb
brew services start mariadb
mysql -u root -p  # Access MariaDB console (no password by default)
```

**On Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install mariadb-server
sudo systemctl start mariadb
mysql -u root -p
```

**Inside MariaDB console:**
```sql
CREATE DATABASE radio_db;
CREATE USER 'radio_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON radio_db.* TO 'radio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 3: Configure Environment

```bash
cp .env.example .env
```

Update `.env` with your local database credentials:

```env
DB_HOST=localhost
DB_NAME=radio_db
DB_USER=radio_user
DB_PASSWORD=your_password
DB_ROOT_PASSWORD=your_root_password
DATABASE_URL=mariadb://radio_user:your_password@localhost:3306/radio_db
```

#### Step 4: Run Migrations

```bash
npm run migrations:run
```

#### Step 5: Start the API

```bash
npm run dev
```

---

## Configuration

### Environment Variables

All configuration is managed through the `.env` file. Here's what each variable does:

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | No | API port (default: 4000) |
| `DB_HOST` | Yes | Database host/service name |
| `DB_NAME` | Yes | Database name |
| `DB_USER` | Yes | Database username |
| `DB_PASSWORD` | Yes | Database password |
| `DB_ROOT_PASSWORD` | Yes | Database root password |
| `JWT_SECRET` | Yes | Secret key for JWT signing (use strong random string) |
| `DATABASE_URL` | Yes | Full connection string |
| `FRONTEND_URL` | Yes | Frontend application URL (for CORS and links) |
| `BACKEND_URL` | Yes | Backend API URL (for email links, etc.) |
| `ZENO_STATION_ID` | No | Zeno.fm station ID for streaming |
| `ZENO_STREAM_ID` | No | Zeno.fm stream ID for streaming |
| `EMAIL_HOST` | No | SMTP server host |
| `EMAIL_PORT` | No | SMTP server port |
| `EMAIL_USER` | No | SMTP authentication username |
| `EMAIL_PASS` | No | SMTP authentication password |

### Port Configuration

By default, the API runs on **port 4000**. If this port is already in use, you can:

1. **Change it in `.env`:**
   ```env
   PORT=5000
   ```

2. **Or pass it as environment variable:**
   ```bash
   PORT=5000 npm run dev
   ```

---

## Database

### Database Structure

The API uses **MariaDB** with **Sequelize ORM** for database management. Database schema is version-controlled through migrations.

### Running Migrations

**Create new migration:**
```bash
npm run migrations:generate -- --name create_users_table
# Edit the generated file in ./app/database/migrations/
```

**Apply migrations:**
```bash
npm run migrations:run
```

**Rollback last migration:**
```bash
npm run migrations:undo
```

### Accessing the Database

**Using phpMyAdmin (Docker setup):**
- URL: `http://localhost:8080`
- User: `radio_user`
- Password: (from `.env` DB_PASSWORD)
- Select database: `radio_db`

**Using MySQL CLI:**
```bash
mysql -h localhost -u radio_user -p radio_db
```

---

## Running the Application

### Development Mode

Start with hot reload and debug logging:

```bash
npm run dev
```

Features:
- ✅ Auto-reload on file changes (via nodemon)
- ✅ TypeScript transpilation
- ✅ Full error logging
- ✅ Console output

Access the API: `http://localhost:4000`

### Production Mode

Build and run optimized production code:

```bash
# Compile TypeScript to JavaScript
npm run build

# Start the built application
npm start
```

This creates a `dist/` directory with compiled JavaScript and starts the server.

### Checking Health

Verify the API is running:

```bash
curl http://localhost:4000

# Response: "400 - Enchufe Virtual - API - Bad Request"
# (The 400 is expected for non-existent routes, confirming the API is alive)
```

---

## Project Structure

```
radio-api/
├── app/
│   ├── index.ts                          # Server entry point
│   ├── config/                           # Configuration files
│   │   ├── index.ts
│   │   └── config.js
│   ├── database/
│   │   ├── config.js                     # Database connection config
│   │   ├── migrations/                   # Version-controlled schema changes
│   │   └── models/                       # Sequelize data models
│   ├── enchufevirtual/                   # API modules (routes & controllers)
│   │   ├── index.ts                      # Route aggregator
│   │   ├── users/                        # User management (auth, profiles)
│   │   ├── posts/                        # Content/posts endpoints
│   │   ├── chat/                         # Chat management
│   │   ├── radio/                        # Radio streaming management
│   │   └── social/                       # Social features (follows, likes)
│   ├── helpers/                          # Utility functions
│   │   ├── auth.ts                       # Auth helpers (JWT, tokens)
│   │   ├── hashPassword.ts               # Password hashing utilities
│   │   ├── generateId.ts                 # ID generation
│   │   ├── generateJWT.ts                # JWT token generation
│   │   ├── emailRegister.ts              # Email templates
│   │   ├── sanitizeText.ts               # XSS prevention
│   │   └── ...
│   ├── libs/
│   │   └── sequelize.ts                  # Sequelize ORM initialization
│   ├── middlewares/                      # Express middlewares
│   │   ├── checkAuth.ts                  # JWT verification
│   │   ├── checkRoleAuth.ts              # Role-based access control
│   │   ├── checkOrigin.ts                # CORS validation
│   │   ├── setupSocketIO.ts              # WebSocket configuration
│   │   ├── upload.ts                     # File upload handling
│   │   ├── createImage.ts                # Image optimization with Sharp
│   │   ├── error.handler.ts              # Centralized error handling
│   │   ├── validator.handler.ts          # Request validation (Joi)
│   │   └── ...
│   ├── Schemas/                          # Joi validation schemas
│   │   └── user.schema.ts
│   └── public/
│       └── uploads/                      # User-uploaded files
├── types/
│   └── types.d.ts                        # Global TypeScript definitions
├── .env.example                          # Environment variables template
├── .env                                  # Environment variables (gitignored)
├── docker-compose.yml                    # Docker services configuration
├── package.json                          # Project dependencies
├── tsconfig.json                         # TypeScript configuration
├── .eslintrc.json                        # ESLint rules
├── .sequelizerc                          # Sequelize CLI config
└── README.md                             # This file
```

### Key Modules Explained

- **users/**: User registration, login, profile management, password reset
- **posts/**: Create, read, update, delete posts with images
- **chat/**: WebSocket-powered real-time messaging between users
- **radio/**: Stream management, station information, now playing data
- **social/**: Follow relationships, likes, user recommendations

---

## API Documentation

### Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

**Login endpoint:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  }
}
```

**Using the token:**
```bash
GET /api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Common Endpoints

See individual module documentation for complete API reference:

- **Users**: Registration, login, profile, password reset
- **Posts**: Create, list, update, delete posts
- **Chat**: Send messages, get chat history (WebSocket)
- **Radio**: Get station info, streaming status
- **Social**: Follow/unfollow users, like content

### Error Handling

The API returns consistent error responses:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation failed)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Development

### Available Scripts

```bash
npm run dev                # Start development server with hot reload
npm run build              # Compile TypeScript to JavaScript
npm start                  # Run compiled production build
npm run migrations:run     # Apply pending database migrations
npm run migrations:generate --name create_table  # Generate new migration
tsc                        # Type-check TypeScript without building
```

### Code Quality

The project uses **ESLint** and **Prettier** for code consistency:

```bash
npm run lint               # Check code style
npm run format             # Auto-format code with Prettier
```

### TypeScript

TypeScript provides type safety across the codebase. Configuration in `tsconfig.json`:

```json
{
  "target": "ES2020",
  "module": "commonjs",
  "strict": true,
  "esModuleInterop": true,
  "skipLibCheck": true,
  "forceConsistentCasingInFileNames": true
}
```

---

## Docker Reference

### View Logs

```bash
# All containers
docker-compose logs

# Specific container
docker-compose logs mariadb
docker-compose logs phpmyadmin

# Follow logs in real-time
docker-compose logs -f mariadb
```

### Stop & Cleanup

```bash
# Stop containers (preserve data)
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove containers and volumes (WARNING: deletes database data!)
docker-compose down -v
```

### Reset Database

```bash
# Remove database container and volume
docker-compose down -v

# Recreate and start fresh
docker-compose up -d
npm run migrations:run
```

---

## Troubleshooting

### Common Issues

**Problem**: Port 4000 already in use
```bash
# Solution 1: Use different port
PORT=5000 npm run dev

# Solution 2: Kill the process using port 4000
lsof -ti:4000 | xargs kill -9
```

**Problem**: Database connection refused
```bash
# Check if database is running
docker-compose ps

# If not, start it
docker-compose up -d

# Check database logs
docker-compose logs mariadb
```

**Problem**: Migrations fail
```bash
# Verify database exists and connection works
mysql -h localhost -u radio_user -p radio_db -e "SHOW TABLES;"

# Check migration files are in correct directory
ls app/database/migrations/
```

**Problem**: TypeScript compilation errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m 'Add amazing feature'`
5. Push to your fork: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Guidelines

- Follow the existing code style (ESLint + Prettier)
- Write TypeScript with strict mode enabled
- Add proper error handling
- Update this README for new features
- Test your changes before submitting

---

## Support & Contact

- 📧 **Email**: chendoec@gmail.com
- 🌐 **Social Media**: [@enchufevirtual](https://wa.me/enchufevirtual)
- 📱 **GitHub**: [enchufevirtual](https://github.com/enchufevirtual)
- 💬 **Issues**: Open an issue on GitHub for bugs or feature requests

---

## License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by the Enchufe Virtual Team**

*This project represents knowledge acquired through experience. It improves over time with your contributions. Be free, be happy!* 🎉