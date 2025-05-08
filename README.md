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

## Project Overview

*College Connect* is a platform that allows event management and registration for students. The system has two main interfaces: *Admin* and *User* (Student).

### Admin Interface

The *Admin* has exclusive login access, which allows them to:

•⁠  ⁠*Add Events*: Admins can add new events, specifying the event name, venue, and event details.
•⁠  ⁠*View/Delete Events: Admins can view the number of registrations for each event or delete events. The **View* option allows the admin to see the number of registrations and download the registration data as a CSV file.
•⁠  ⁠*Admin Access Control*: Only two hardcoded admin accounts (Admin 1 and Admin 2) are authorized to manage events.

Once logged in, the admin can monitor registrations for each event and download a CSV file with registration details.

### User Interface

Once the admin logs out, the events are displayed to users on the *Dashboard*. Students can:

•⁠  ⁠*Register for Events*: Users can click the "Register Event" button to sign up for an event, providing their name, email, and student ID.
•⁠  ⁠*Print Registration Form*: After successful registration, users can print a confirmation form with their event details.

### Summary of How the System Works

1.⁠ ⁠The admin logs in to manage events.
2.⁠ ⁠Admin can add, view, or delete events, with the ability to download registration details in CSV format.
3.⁠ ⁠After the admin logs out, the events are displayed for students to view and register.
4.⁠ ⁠Students register by providing their details, and after successful registration, they receive a confirmation form.

This simple workflow provides a streamlined event management and registration process for both event organizers and participants.


## Link to the demo of the project : https://drive.google.com/file/d/1OSdy00KXXC_G097rShL32P3uuZOtKFa6/view?usp=drivesdk
  SRS- https://drive.google.com/file/d/1ACRfKU8xa-T9-X54TBLJ58NxveYnK36E/view?usp=drivesdk
  SDD- https://drive.google.com/file/d/1G2-HeYWHyD8DyPIhrHaVIox9c43aKaeH/view?usp=drivesdk
  Software Test Plan : https://docs.google.com/document/d/18GUsAyeKXVhEoogp1KC1z4-eTYgqFdSS/edit?usp=sharing&ouid=113754257959949511359&rtpof=true&sd=true
