<div align="center">

# 🎯 PrepGrid AI

### Master Technical Interviews with AI Precision

Practice coding challenges, take adaptive AI mock interviews, and get instant personalized feedback — all in one platform.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Groq AI](https://img.shields.io/badge/Groq-LLaMA%203.3-F55036?style=for-the-badge)](https://groq.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [AI Systems](#-ai-systems)
- [Admin Panel](#-admin-panel)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 Overview

PrepGrid AI is a full-stack, AI-powered interview preparation platform designed for engineering students and developers targeting roles at top tech companies. It combines a curated coding practice hub with adaptive AI mock interviews that dynamically adjust difficulty based on your performance — simulating a real interviewer's behavior.

The platform features a **resume-driven interview flow** where users upload their resume (PDF/DOCX), the AI analyzes their professional profile, and the system recommends the most suitable interview track based on the candidate's skills and experience.

---

## ✨ Key Features

### 🎙️ Adaptive AI Mock Interviews
- **Resume-Driven Entry**: Upload your resume and let AI analyze your skills, projects, and experience level to recommend the best interview track.
- **Dynamic Difficulty**: AI adjusts question difficulty in real-time based on your score (easy → medium → hard).
- **Role-Specific Questions**: Choose from DSA, Frontend, Backend, or Full Stack tracks — each with tailored, scenario-based questions.
- **Detailed Feedback**: Get scored evaluations with strengths, weaknesses, improvement suggestions, and confidence assessment after every answer.
- **Adaptive Questioning**: The AI avoids repeating topics, tracks your weak areas, and follows a logical interview flow.

### 💻 Coding Practice Hub
- **Curated Problem Set**: Solve coding challenges fetched from a Supabase-backed question bank.
- **Built-in Code Editor**: Monaco Editor integration with syntax highlighting for Python, JavaScript, Java, C++, and C.
- **Progress Tracking**: Visual progress bars and solved-problem counts tracked per user.
- **Topic Filtering & Search**: Filter problems by topic (Arrays, Trees, Graphs, etc.) and search by title.

### 📊 Data-Driven Dashboard
- **Performance Overview**: See solved counts, average interview scores, and dynamically computed weak topics at a glance.
- **Activity Timeline**: Recent submissions and interview sessions displayed chronologically.
- **Recommended Problems**: AI-assisted suggestions based on your weak areas.

### 👤 User Profile & Settings
- **Profile Analytics**: View your total solved problems, interview count, average score, and weak topic analysis.
- **Account Management**: Update display name, set default programming language preference.
- **Session Management**: Secure sign-out with session cleanup.

### 🔐 Authentication
- **Google OAuth**: One-click sign-in via Google.
- **Email/Password**: Traditional email signup with confirmation flow.
- **Admin Portal**: Separate admin login with credential-based authentication.
- **Interactive 3D Auth Page**: Features a Spline-powered interactive robot on the login screen.

### 🛡️ Admin Panel
- **Platform Analytics**: View total users, questions, and interviews conducted.
- **Question Management**: Full CRUD for the coding problem bank (create, edit, delete questions).
- **User Management**: Browse registered users and their engagement data.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2 (App Router, Turbopack) |
| **Language** | TypeScript 5.7 |
| **UI** | React 19, Tailwind CSS 4.2, Radix UI, Lucide Icons |
| **3D/Visuals** | Three.js, React Three Fiber, Spline, Framer Motion, GSAP |
| **AI Engine** | Groq (LLaMA 3.3 70B Versatile) via Vercel AI SDK |
| **Auth & Database** | Supabase (Auth, PostgreSQL, Row Level Security) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Resume Parsing** | `pdf-parse` (PDF), `mammoth` (DOCX) |
| **Analytics** | Vercel Analytics |
| **Deployment** | Vercel (pnpm, Node 22) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Next.js)                  │
│                                                     │
│  Landing ─── Auth ─── Dashboard ─── Admin Panel     │
│                         │                           │
│              ┌──────────┼──────────┐                │
│              │          │          │                 │
│          Practice   Interview   Profile/Settings    │
│              │          │                           │
│         Monaco Editor   │                           │
│              │     ┌────┴────┐                      │
│              │   Resume    Session                  │
│              │   Upload    (Adaptive)               │
└──────────────┼─────┼────────┼───────────────────────┘
               │     │        │
         ┌─────┴─────┴────────┴─────┐
         │      API ROUTES          │
         │                          │
         │  /api/resume/analyze     │  ← PDF/DOCX → Groq AI
         │  /api/interview          │  ← generate_question / evaluate_answer
         └──────────┬───────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
    ┌────┴────┐          ┌─────┴─────┐
    │  Groq   │          │ Supabase  │
    │  (AI)   │          │ (Auth+DB) │
    └─────────┘          └───────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 22.0.0
- **pnpm** ≥ 10.0.0
- A [Supabase](https://supabase.com/) project
- A [Groq](https://console.groq.com/) API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/prepgrid.git
cd prepgrid

# Install dependencies (use pnpm only — do NOT use npm)
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials (see below)

# Start the development server
pnpm dev
```

The app will be running at `http://localhost:3000`.

> ⚠️ **Important**: Always use `pnpm` for this project. Running `npm install` will create a conflicting `package-lock.json` and break Vercel deployments.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Groq AI
GROQ_API_KEY=gsk_your-groq-api-key

# Admin Credentials
ADMIN_EMAIL=admin@prepgrid.com
ADMIN_PASSWORD=your-admin-password
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public API key |
| `GROQ_API_KEY` | API key from [Groq Console](https://console.groq.com/) |
| `ADMIN_EMAIL` | Email for admin portal access |
| `ADMIN_PASSWORD` | Password for admin portal access |

---

## 📁 Project Structure

```
prepgrid/
├── app/
│   ├── layout.tsx              # Root layout (Inter font, dark theme, SEO)
│   ├── page.tsx                # Landing page (Hero, Features, CTA)
│   ├── globals.css             # Global styles and design tokens
│   ├── auth/
│   │   └── page.tsx            # Auth page (Google OAuth, Email, Admin login)
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard shell (top nav, sidebar, avatar)
│   │   ├── page.tsx            # Main dashboard (stats, activity, recommendations)
│   │   ├── practice/
│   │   │   ├── page.tsx        # Problem listing with filters and search
│   │   │   └── [id]/page.tsx   # Individual problem (Monaco Editor + submission)
│   │   ├── interview/
│   │   │   ├── page.tsx        # Interview entry (resume upload, role selection)
│   │   │   └── session/page.tsx# Live AI interview session (adaptive Q&A)
│   │   ├── profile/page.tsx    # User profile with analytics
│   │   └── settings/page.tsx   # Account & preference management
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   ├── page.tsx            # Admin analytics dashboard
│   │   ├── questions/          # Question CRUD (list, new, edit)
│   │   └── users/page.tsx      # User management
│   ├── api/
│   │   ├── interview/route.ts  # AI interview (question gen + evaluation)
│   │   └── resume/analyze/route.ts # Resume parsing + AI analysis
│   └── actions/
│       └── admin-auth.ts       # Server action for admin authentication
├── components/
│   ├── navbar.tsx              # Landing page navigation
│   ├── hero.tsx                # Hero section with 3D orb
│   ├── ai-orb.tsx              # Three.js animated AI orb
│   ├── features.tsx            # Feature showcase section
│   ├── how-it-works.tsx        # Step-by-step flow section
│   ├── ai-demo.tsx             # Interactive AI demo section
│   ├── cta.tsx                 # Call-to-action section
│   ├── footer.tsx              # Footer
│   ├── auth-context.tsx        # Supabase auth context provider
│   ├── ui/                     # Radix UI + shadcn components
│   └── blocks/                 # Complex UI blocks (3D robot, etc.)
├── lib/
│   ├── supabase.ts             # Supabase client initialization
│   ├── utils.ts                # Utility functions (cn, etc.)
│   └── data/                   # Static data files
├── public/
│   └── Logo/                   # Brand assets
├── vercel.json                 # Vercel deployment configuration
├── .npmrc                      # pnpm hoisting configuration
├── next.config.mjs             # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

---

## 🤖 AI Systems

### 1. Resume Analysis Engine (`/api/resume/analyze`)

Accepts PDF/DOCX uploads, extracts text using `pdf-parse` or `mammoth`, and sends it to **Groq LLaMA 3.3 70B** with an expert recruiter prompt. Returns structured JSON:

```json
{
  "candidate_summary": "Full-stack developer with 2 years of experience...",
  "experience_level": "intermediate",
  "recommended_roles": ["Frontend Engineer", "Full Stack"],
  "primary_skills": ["React", "Node.js", "TypeScript"],
  "strengths": ["Strong project portfolio", "Modern stack expertise"],
  "weaknesses": ["Limited system design experience"],
  "focus_areas_for_interview": ["System Design", "DSA Fundamentals"]
}
```

### 2. Adaptive Interview Engine (`/api/interview`)

Two-action API powered by Groq:

- **`generate_question`**: Generates role-specific, difficulty-calibrated interview questions.
- **`evaluate_answer`**: Scores answers (0–10), identifies strengths/weaknesses, adapts difficulty for the next round, and generates a follow-up question — all in a single inference call.

The engine uses a detailed expert prompt that simulates a senior technical interviewer from top tech companies, with rules for:
- Dynamic difficulty scaling based on scores
- Confidence detection (HIGH / MEDIUM / LOW)
- Topic tracking to avoid repetition
- Question type adaptation (conceptual → scenario → coding → follow-up)

---

## 🛡️ Admin Panel

Access the admin panel at `/admin` using the credentials defined in your environment variables.

| Feature | Route | Description |
|---------|-------|-------------|
| **Analytics** | `/admin` | Total users, questions, and interviews |
| **Questions** | `/admin/questions` | Browse, create, edit, and manage the question bank |
| **Users** | `/admin/users` | View registered users and activity |

---

## 🌐 Deployment

This project is optimized for **Vercel** deployment.

### Configuration

The project includes:
- **`vercel.json`** — Pins Node 22 and configures pnpm as the install command.
- **`package.json`** — Contains `packageManager: "pnpm@10.0.0"` and `engines` constraints.
- **`.npmrc`** — Enables `shamefully-hoist=true` for full dependency resolution.

### Deploy to Vercel

```bash
# Push to GitHub, then connect at vercel.com
# Or use the CLI:
npx vercel --prod
```

> Make sure to add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## 🧪 Scripts

```bash
pnpm dev          # Start development server (Turbopack)
pnpm build        # Create production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

---

## 📄 License

This project is private and not licensed for public distribution.

---

<div align="center">

**Built with ❤️ using Next.js, Groq AI, and Supabase**

</div>
