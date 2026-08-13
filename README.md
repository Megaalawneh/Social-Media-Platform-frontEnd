diff --git a/D:\2026\Downloads\Compressed\pathProject\README.md b/D:\2026\Downloads\Compressed\pathProject\README.md
new file mode 100644
--- /dev/null
+++ b/D:\2026\Downloads\Compressed\pathProject\README.md
@@ -0,0 +1,104 @@
+# PathWebSite
+
+PathWebSite is a front-end social-media prototype built with Next.js, React, and Material UI. It provides local profile management, image posts, profile search, a demo direct-message interface, and a weather card.
+
+> This is a learning/demo project. It has no backend or production authentication system, so do not use real personal information or passwords.
+
+## Features
+
+- Create, edit, and search user profiles
+- Form validation for usernames, passwords, and dates of birth
+- Create image posts with captions
+- Like and delete posts
+- Browser-local state persistence with `localStorage`
+- Profile search by username prefix
+- Demo direct messages with an emoji picker
+- Current weather card powered by OpenWeatherMap
+
+## Tech stack
+
+- [Next.js](https://nextjs.org/) 16
+- [React](https://react.dev/) 19
+- [Material UI](https://mui.com/)
+- Emotion
+- `uuid` for client-side IDs
+- `moment` for post dates
+- `emoji-picker-react`
+
+## Getting started
+
+### Prerequisites
+
+- A current Node.js LTS release
+- npm
+
+### Install and run
+
+From the application directory:
+
+```bash
+cd my-app
+npm install
+npm run dev
+```
+
+Open [http://localhost:3000](http://localhost:3000) in your browser.
+
+For a clean install from the lockfile, use `npm ci` instead of `npm install`.
+
+## Scripts
+
+| Command | Description |
+| --- | --- |
+| `npm run dev` | Starts the development server. |
+| `npm run build` | Creates a production build. |
+| `npm run start` | Starts the production server after building. |
+| `npm run lint` | Runs ESLint. |
+
+## Routes
+
+| Route | Purpose |
+| --- | --- |
+| `/` | Login screen |
+| `/mainPage` | Main feed and weather card |
+| `/mainPage/Search` | Profile search |
+| `/mainPage/direct` | Demo direct messages |
+| `/mainPage/accounts/emailsignup` | Create account |
+| `/mainPage/accounts/edit` | Edit profile |
+| `/mainPage/accounts/password/reset` | Password-reset screen |
+
+## Project structure
+
+```text
+my-app/
+└── src/app/
+    ├── Context/        # Shared React context and local-state persistence
+    ├── Reducer/        # Profile, post, like, delete, and search actions
+    ├── components/     # Reusable UI, post, weather, and dialog components
+    ├── mainPage/       # Feed, search, messaging, and account routes
+    ├── styles/         # Page-specific CSS
+    ├── layout.tsx      # App-wide Material UI theme and layout
+    └── page.tsx        # Login route
+```
+
+## Data and API notes
+
+- Profiles and posts are stored in the browser under the `AppState` `localStorage` key. Clearing browser site data resets the demo data.
+- Profile pictures and post media use browser object URLs, so uploaded media will not persist after a page reload.
+- The weather card requests OpenWeatherMap data for fixed coordinates. It requires an internet connection and a valid API key.
+
+## Known limitations
+
+- This is a client-side demo: there is no database, backend API, real login flow, or server-side message storage.
+- Passwords are saved in plain text in browser storage. Never use real credentials.
+- Direct-message contacts and conversations are seeded demo data.
+- The password-reset page is UI-only.
+- Before deploying, move the OpenWeatherMap key out of source code and into an environment variable.
+
+## Development notes
+
+The app currently initializes shared state from `localStorage` during rendering. With Next.js server rendering, existing browser data can cause a hydration mismatch. Load stored data after the component mounts to avoid that issue.
+
+## License
+
+No license has been specified for this project.
