# Setup Instructions

## Prerequisites

- Docker and Docker Compose installed
- Google Gemini API key (get from https://makersuite.google.com/app/apikey)

## Quick Start

1. Clone the repository and navigate to the project directory

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

4. Start all services:
```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database
- Build and run Spring Boot backend (port 8080)
- Build and run Vue.js frontend (port 5173)
- Run Flyway migrations automatically
- Seed the database with demo data

5. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Manager | manager@company.com | password |
| Technician | tech1@company.com | password |
| Technician | tech2@company.com | password |
| Technician | tech3@company.com | password |
| Employee | emp1@company.com | password |
| Employee | emp2@company.com | password |
| Employee | emp3@company.com | password |

## Development Mode

### Backend Only
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Only
```bash
cd frontend
npm install
npm run dev
```

## Running Tests

```bash
cd backend
./mvnw test
```

## Stopping Services

```bash
docker-compose down
```

To remove volumes (database data):
```bash
docker-compose down -v
```

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is healthy: `docker-compose ps`
- View backend logs: `docker-compose logs backend`

### Frontend can't connect to backend
- Ensure backend is running on port 8080
- Check CORS configuration in SecurityConfig.java

### Gemini API not working
- Verify API key is correct in `.env`
- Check backend logs for API errors
- System will work without Gemini, just won't provide AI suggestions

## Architecture Overview

```
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│   Vue 3     │─────▶│  Spring Boot │─────▶│ PostgreSQL │
│  Frontend   │      │   Backend    │      │  Database  │
│  (Port 5173)│      │  (Port 8080) │      │ (Port 5432)│
└─────────────┘      └──────────────┘      └────────────┘
       │                     │
       │                     │
       └─────────────────────┘
              WebSocket
           (Real-time updates)
                   │
                   ▼
            ┌─────────────┐
            │   Gemini    │
            │     API     │
            └─────────────┘
```

## Key Features Implemented

✅ JWT Authentication
✅ Role-based access control (Employee, Technician, Manager)
✅ AI-powered ticket classification with Gemini
✅ Auto-assignment to least-loaded technician
✅ SLA tracking and breach detection
✅ Real-time WebSocket notifications
✅ Comprehensive statistics dashboard
✅ LLM override rate tracking
✅ Audit logging
✅ Responsive UI with Tailwind CSS
✅ Docker containerization
✅ Database migrations with Flyway
✅ Unit tests for core services
