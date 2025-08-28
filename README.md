# Node.js TypeScript Boilerplate

Node.js boilerplate with TypeScript, PostgreSQL, and Express.js.

## Project Structure

```
project/
├── src/
│   ├── config/        # Database and environment configuration
│   ├── controllers/   # Business logic and request handlers
│   ├── models/        # Database models and data access
│   ├── routes/        # Express route definitions
│   ├── middlewares/   # Custom middleware functions
│   ├── utils/         # Helper functions and utilities
│   ├── types/         # TypeScript type definitions
│   ├── app.ts         # Express application setup
│   └── server.ts      # Server entry point
├── tests/             # Test files
├── prisma/            # Database schema and migrations
├── .env               # Environment variables
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-boiler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/node_boiler?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `GET /api/auth/users` - Get all users (admin only)

### Health Check

- `GET /api/health` - Server health check

## Example API Usage

### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gorkem@example.com",
    "password": "password123",
    "name": "Görkem Özkan"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gorkem@example.com",
    "password": "password123"
  }'
```

### Get profile (with JWT token)
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

The project uses Prisma with the following schema:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your-super-secret-key-with-32-chars` |

### Core Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port (1-65535) | `3000` |
| `API_PREFIX` | API route prefix | `/api/v1` |
| `LOG_LEVEL` | Logging level | `info` |

### JWT Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `JWT_REFRESH_SECRET` | Refresh token secret | Optional |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `30d` |

### Security & Rate Limiting

| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `CORS_ORIGIN` | CORS allowed origins | `*` |
| `CORS_CREDENTIALS` | Allow CORS credentials | `true` |

### Optional Services

| Variable | Description | Example |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection for caching | `redis://localhost:6379` |
| `SENTRY_DSN` | Sentry error tracking | `https://dsn@sentry.io/project` |
| `SMTP_HOST` | SMTP server for emails | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username | `user@gmail.com` |
| `SMTP_PASS` | SMTP password | `app-password` |

### File Upload

| Variable | Description | Default |
|----------|-------------|---------|
| `MAX_FILE_SIZE` | Max file size in bytes | `5242880` (5MB) |
| `UPLOAD_PATH` | Upload directory | `./uploads` |

### Environment File Setup

Create a `.env` file in the root directory:

```bash
# Copy example file
cp .env.example .env

# Or create manually with required variables:
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/node_boiler"
JWT_SECRET="your-super-secret-jwt-key-with-at-least-32-characters"
```

**Security Notes:**
- Use strong, unique secrets in production
- Never commit `.env` files to version control
- Use different secrets for different environments
- Consider using a secrets management service in production
