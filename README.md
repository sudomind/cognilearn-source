# CogniLearn — AI Study Platform

A full-featured AI-powered study platform built with React + Vite.

Upload PDFs, chat with your documents, generate summaries, flashcards, and quizzes — all powered by Claude AI.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 Document Library | Upload and manage PDF study materials |
| 💬 AI Chat | Ask any question about your documents |
| 📝 Smart Summaries | One-click AI-generated document summaries |
| 💡 Concept Explainer | Deep explanations of any concept |
| 🃏 Flashcards | Auto-generate and study with flip cards |
| 🧠 AI Quizzes | Multiple-choice quizzes with instant scoring |
| 📈 Progress Tracking | Track scores and study statistics |

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and fill in your values:
```env
VITE_API_URL=https://cognilearn-backend.onrender.com
VITE_ANTHROPIC_API_KEY=sk-ant-...   # optional — only for local dev without backend
```

### 3. Start development server
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🗂 Project Structure

```
cognilearn/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx         # Reusable button component
│   │   │   ├── Input.jsx          # Reusable input component
│   │   │   └── Loaders.jsx        # Spinner, Skeleton, TypingDots
│   │   ├── tabs/
│   │   │   ├── ChatTab.jsx        # AI Chat interface
│   │   │   ├── SummaryTab.jsx     # Document summary generation
│   │   │   ├── ExplainTab.jsx     # Concept explainer
│   │   │   ├── FlashcardsTab.jsx  # Flashcard generator + study mode
│   │   │   └── QuizTab.jsx        # Quiz generator + quiz runner
│   │   └── UploadModal.jsx        # PDF upload modal
│   ├── context/
│   │   └── AppContext.jsx         # Global state management
│   ├── hooks/
│   │   └── useApp.js              # Hook re-export
│   ├── layouts/
│   │   ├── MainLayout.jsx         # App shell with sidebar
│   │   └── Sidebar.jsx            # Navigation sidebar
│   ├── pages/
│   │   ├── LoginPage.jsx          # Auth (login + register)
│   │   ├── DashboardPage.jsx      # Home dashboard
│   │   ├── DocumentsPage.jsx      # Document library
│   │   ├── DocumentDetailPage.jsx # Per-document tabbed view
│   │   ├── FlashcardsPage.jsx     # Global flashcard library
│   │   ├── QuizzesPage.jsx        # Quiz history
│   │   ├── ProgressPage.jsx       # Learning progress stats
│   │   └── ProfilePage.jsx        # User profile settings
│   ├── router/
│   │   └── index.jsx              # View-based SPA router
│   ├── services/
│   │   ├── api.js                 # Axios backend API client
│   │   └── anthropic.js           # AI feature functions
│   ├── styles/
│   │   └── globals.css            # Tailwind + global styles
│   ├── utils/
│   │   └── helpers.js             # Utility functions
│   ├── App.jsx                    # Root component
│   └── main.jsx                   # React entry point
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🔌 API Integration

The app integrates with the CogniLearn backend at `https://cognilearn-backend.onrender.com`.

### Backend endpoints used

| Method | Path | Description |
|---|---|---|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| GET | `/documents` | List documents |
| POST | `/documents/upload` | Upload PDF |
| DELETE | `/documents/:id` | Delete document |
| POST | `/ai/complete` | AI completions (proxied) |
| POST | `/ai/summary` | Generate summary |
| POST | `/ai/flashcards` | Generate flashcards |
| POST | `/ai/quiz` | Generate quiz |
| POST | `/ai/chat` | Document chat |

### AI fallback
If the backend `/ai/complete` endpoint is unavailable, the app falls back to calling the Anthropic API directly using `VITE_ANTHROPIC_API_KEY`. This is useful for local development.

---

## 🛠 Available Scripts

```bash
npm run dev        # Start dev server on port 5173
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

---

## 🎨 Tech Stack

- **React 18** — UI library
- **Vite 5** — Build tool + dev server
- **Tailwind CSS 3** — Utility-first styling
- **Axios** — HTTP client
- **React Router DOM** — (available, app uses context-based routing)
- **Anthropic Claude** — AI features (via backend proxy)

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend base URL |
| `VITE_ANTHROPIC_API_KEY` | No | Direct API key (dev fallback) |

---

## 📦 Deployment

```bash
npm run build
# Deploy the dist/ folder to any static host (Vercel, Netlify, etc.)
```

Set `VITE_API_URL` in your hosting platform's environment variable settings.
