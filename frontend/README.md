# FitZone Frontend

React frontend for the FitZone Gym & Class Booking System.

## Requirements
- Node.js 18+
- FitZone Express backend running on port 5000

## Run
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux:
```bash
cp .env.example .env
```

Open the Vite URL shown in the terminal, normally:
```text
http://localhost:5173
```

## API configuration
`.env`:
```env
VITE_API_URL=http://localhost:5000
```

## Main features
- Sign in / Sign up
- React Router navigation
- Protected member routes
- AuthContext with member, token, role, login and logout
- Trainer listing from Express API
- TrainerCard prop-based component
- Specialization search without a new API request
- Booking form using React state
- My bookings page with cancellation
- Lazy-loaded admin page

## Architecture
See `docs/architecture.md`.

## Viva
See `docs/viva.md`.


### Admin login

Configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the backend `.env`. Start the backend once so the admin user is created, then sign in on the frontend using those credentials. Admin users see the Admin link and can add trainers.
