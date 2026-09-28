# Path Web Frontend

Next.js frontend for Path, a social application with profiles, posts, follows, notifications, direct messages, and weather information. The frontend uses the Express backend in `../pathProject-BackEnd` for account data, sessions, posts, and real-time messaging.

## Features

- Account creation, login, profile editing, and profile search
- Create and browse image and video posts
- Like, comment on, and share posts
- Follow users and view notifications
- Persistent direct messages with online and typing indicators
- Weather information based on the signed-in user's saved city
- Responsive layouts for feed and messaging pages

## Requirements

- Node.js 20 or later
- npm
- The Path backend running and configured; see its README for setup

## Local setup

Install frontend dependencies:

```powershell
npm install
```

Create `.env.local` in this directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
OPENWEATHER_API_KEY=your_openweathermap_api_key
```

`NEXT_PUBLIC_API_URL` is the base URL of the Express backend and should not have a trailing slash. It is exposed to the browser, so do not put secrets in it. `OPENWEATHER_API_KEY` is used only by the Next.js weather route and should remain server-side.

Start the development server:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The frontend `.gitignore` excludes `.env*`, including `.env.local`. On a hosting provider, configure these variables in the site's environment settings and redeploy after changing them.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Serve the production build; run `npm run build` first. |

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Login |
| `/mainPage` | Feed and weather |
| `/mainPage/[userId]` | User profile |
| `/mainPage/Search` | Search users |
| `/mainPage/direct` | Direct messages |
| `/mainPage/accounts/emailsignup` | Create an account |
| `/mainPage/accounts/edit` | Edit the signed-in profile |
| `/mainPage/accounts/password/reset` | Password reset |

## Project structure

```text
src/app/
├── api/                 # Frontend API clients and Next.js weather routes
├── components/          # Shared UI, feed, dialogs, notifications, and weather
├── Context/             # Authentication, socket, dialogs, and shared state
├── hooks/               # Shared React hooks
├── mainPage/            # Feed, profile, search, messaging, and account pages
├── Reducer/             # Profile and application state reducers
├── styles/              # Application and page styles
├── layout.tsx            # Root layout and providers
└── page.tsx              # Login route
```

## Backend and deployment

The browser calls the Express API using `NEXT_PUBLIC_API_URL`. The backend must allow the frontend origin through `FRONTEND_ORIGIN` and credentialed CORS. Authentication uses cookies, and real-time messaging uses Socket.IO at the same backend URL; deploy the backend on a service that supports long-lived HTTP connections and WebSockets.

For production, use HTTPS for both services and configure cookie settings, CORS, and the exact frontend origin for the deployed domains. Keep MongoDB and Cloudinary credentials exclusively in the backend environment. Keep the OpenWeather API key in the frontend host's server-side environment configuration; do not rename it with a `NEXT_PUBLIC_` prefix.

Post images and videos are uploaded through the backend to Cloudinary. Configure Cloudinary credentials in the backend environment, not in this frontend project. The backend's README documents its environment variables and setup.

## Notes

- The frontend has no configured unit-test script. Use `npm run lint` and `npm run build` to check it.
- Weather city lookup uses Open-Meteo geocoding; current weather is fetched through the Next.js route using `OPENWEATHER_API_KEY`.
- The frontend API defaults to `http://localhost:3001` when `NEXT_PUBLIC_API_URL` is unset; set it explicitly for deployed environments.
