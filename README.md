# Enhanced Support Ticket System

A full-stack web application for managing support tickets with AI-powered classification using Google Gemini API.

## Tech Stack

- **Backend**: Java 21 + Spring Boot 3
- **Frontend**: Vue 3 + Vite + Tailwind CSS + Pinia
- **Database**: PostgreSQL
- **LLM**: Google Gemini API (gemini-1.5-flash for speed)
- **Real-time**: WebSocket (Spring STOMP)
- **Migrations**: Flyway
- **Testing**: JUnit 5
- **Containerization**: Docker + Docker Compose

## Quick Start

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Add your Gemini API key to `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

3. Start all services:
```bash
docker-compose up --build
```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - PostgreSQL: localhost:5432

## Default Users

| Email | Password | Role |
|-------|----------|------|
| manager@company.com | password | Manager |
| tech1@company.com | password | Technician |
| emp1@company.com | password | Employee |

## Why Gemini?

- **Structured JSON Output**: Reliable JSON mode for classification tasks
- **Speed**: gemini-1.5-flash provides sub-second response times
- **Cost-effective**: Lower cost per request compared to alternatives
- **Strong reasoning**: Excellent at understanding context and nuance in support tickets

## SLA Engine Design

The SLA engine runs as a scheduled job every 15 minutes:

1. **Calculation**: `dueAt = createdAt + priority_duration`
2. **Detection**: Finds tickets where `dueAt < now AND status NOT IN (resolved, closed)`
3. **Action**: Auto-escalates to ESCALATED status, creates breach record
4. **Notification**: Real-time WebSocket alerts to all managers

Priority durations:
- Critical: 2 hours
- High: 8 hours
- Medium: 24 hours
- Low: 72 hours

## LLM Override Rate Metric

Tracks how often users change Gemini's suggestions, indicating:
- AI accuracy and trust level
- Areas where the model needs improvement
- User confidence in AI recommendations

Formula: `(tickets with llmOverridden=true / total tickets) * 100`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/login | Login with email/password |
| POST | /api/v1/auth/logout | Logout current user |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/tickets/ | Create new ticket |
| GET | /api/v1/tickets/ | List tickets (paginated, filterable) |
| GET | /api/v1/tickets/{id} | Get ticket details |
| PATCH | /api/v1/tickets/{id} | Update ticket |
| GET | /api/v1/tickets/stats | Get aggregated statistics |
| POST | /api/v1/tickets/classify | Get AI classification |

### Query Parameters for Listing
- `category`: Filter by category
- `priority`: Filter by priority
- `status`: Filter by status
- `assignedTo`: Filter by assignee
- `breached`: Filter breached tickets
- `search`: Full-text search
- `page`: Page number (0-indexed)
- `size`: Page size (default: 20)

## Screenshots

[Dashboard - Manager View]
[Ticket Creation with AI Suggestions]
[SLA Breach Alerts]
[Workload Distribution]

## Development

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Run Tests
```bash
cd backend
./mvnw test
```

## Architecture Highlights

- **Auto-assignment**: Tickets assigned to least-loaded technician with matching specialization
- **Real-time updates**: WebSocket notifications for all critical events
- **Graceful degradation**: System works even if Gemini API fails
- **Audit trail**: Complete history of all ticket changes
- **SLA compliance**: Automated breach detection and escalation
