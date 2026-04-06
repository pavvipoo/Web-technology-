# 🚀 GitHub Explorer Pro

**GitHub Explorer Pro** is a modern, AI-powered developer tool designed to enhance the experience of discovering and analyzing GitHub repositories. Built with a sleek glassmorphic UI and powered by Google's Gemini AI, it allows developers to not only search for repositories but also "chat" with their codebase to gain deep insights instantly.

---

## ✨ Features

### 🔍 Intelligent Repository Search
- **Real-Time Discovery**: Search millions of repositories using the official GitHub API.
- **Advanced Filtering**: Filter by language, stars, and popularity.
- **Trending Repos**: Stay updated with what the community is building.

### 💬 AI-Powered Repo Chat
- **Contextual Analysis**: Ask questions about any repository's architecture, technologies, or specific functions.
- **Powered by Gemini AI**: Leverages Google's state-of-the-art LLMs for accurate code analysis.
- **Streaming Responses**: Real-time interaction with the AI for a seamless experience.

### 📂 Smart Management
- **Bookmarking System**: Save repositories for quick access later.
- **Search History**: Automatically track your activity to pick up where you left off.
- **User Profiles**: Manage your account and see your activity stats at a glance.

### 🎨 Modern Developer UI
- **Glassmorphism Design**: High-end aesthetic with blur effects and neon accents.
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices.
- **Dark Mode First**: Engineered for developers who prefer a deep, high-contrast theme.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [Wouter](https://github.com/molecula-js/wouter) (Lightweight routing)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI Primitives)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Server**: [Express.js](https://expressjs.com/)
- **Database**: PostgreSQL (via [Drizzle ORM](https://orm.drizzle.team/))
- **AI Integration**: [Google Gemini AI](https://ai.google.dev/) (`@google/generative-ai`)
- **Authentication**: [Passport.js](https://www.passportjs.org/) with Local Strategy
- **Session Management**: `express-session` with PostgreSQL store

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A PostgreSQL database (e.g., [Neon](https://neon.tech/) or local instance)
- A Google AI (Gemini) API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/github-explorer-pro.git
   cd github-explorer-pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add:
   ```env
   DATABASE_URL=your_postgresql_url
   GEMINI_API_KEY=your_gemini_api_key
   SESSION_SECRET=a_secure_random_string
   ```

4. **Initialize the database:**
   ```bash
   npm run db:push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend proxy).

---

## 📁 Project Structure

```text
├── client/                # React Frontend
│   ├── src/
│   │   ├── api/          # GitHub & AI API integration
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks (auth, bookmarks, etc.)
│   │   ├── lib/          # Utilities (queryClient, etc.)
│   │   ├── pages/        # Route components (Dashboard, Search, RepoChat, etc.)
│   │   └── App.tsx       # Main application & routing
├── server/                # Express Backend
│   ├── auth.ts           # Passport.js configuration
│   ├── index.ts          # Server entry point & API routes
│   ├── db.ts             # Drizzle ORM configuration
│   └── routes.ts         # Main API endpoint definitions
├── shared/                # Shared types and Zod schemas
└── drizzle.config.ts      # Drizzle database configuration
```

---

## 🛡️ Security & Performance
- **Secure Authentication**: Passwords hashed and sessions managed securely.
- **Rate Limiting**: GitHub API requests are handled efficiently with caching via TanStack Query.
- **Code Splitting**: Routes are lazy-loaded to ensure fast initial page loads.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an issue.

---

## 📜 License
This project is licensed under the MIT License.

---

*Powered by [Design-Savvy](https://github.com/your-org/design-savvy)*
