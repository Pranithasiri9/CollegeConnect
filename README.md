# College Event Registration Web App

A full-stack web application for managing and registering for college events.

## Tech Stack

- **Frontend**: React.js (with Vite) + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT-based system

## Features

- Event browsing by categories (Cultural, Sports, Technical, etc.)
- Event registration with confirmation pages
- Admin authentication and dashboard
- Event creation and management
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- pip (Python package manager)

### Installation

1. Clone the repository
2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server:

```bash
npm run backend
```

2. Start the frontend development server:

```bash
npm run dev
```

3. Or start both with:

```bash
npm start
```

## Default Admin Credentials

The system comes pre-populated with these admin accounts:

- Username: `admin1` / Password: `password123`
- Username: `admin2` / Password: `password456`

## API Routes

### Authentication
- `POST /api/login` - Admin login

### Events
- `GET /api/events` - Get all events
- `GET /api/events/{event_id}` - Get event details
- `POST /api/events` - Create event (admin only)
- `DELETE /api/events/{event_id}` - Delete event (admin only)

### Registration
- `POST /api/register/{event_id}` - Register for an event
- `GET /api/confirmation/{registration_id}` - Get registration confirmation