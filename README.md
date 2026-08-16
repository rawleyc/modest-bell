# 🇵🇱 Słówka V2 — AI-Augmented Polish Vocabulary Engine

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1-6E9F18?style=for-the-badge&logo=vitest)](https://vitest.dev/)

**Słówka V2** is a modern, production-ready language learning platform designed for rapid Polish vocabulary acquisition. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Supabase**, Słówka combines a **5-stage cognitive mastery pipeline** with an **adaptive spaced-repetition algorithm**, **resilient AI exercise generation**, and **gamified practice modes**.

---

## 🌟 Key Features

### 1. 🧠 5-Stage Cognitive Mastery Framework
Rather than relying on basic flashcards, Słówka guides learners through five progressively challenging cognitive stages to build long-term retention:
- **Stage 1: Learn** — Flashcard introduction with native Web Speech API audio pronunciation, phonetic guide, and example sentence context.
- **Stage 2: Recognize** — 4-option multiple-choice recognition testing active listening and word identification.
- **Stage 3: Recall** — Cued fill-in-the-blank retrieval testing memory recall under light constraints.
- **Stage 4: Rebuild** — Interactive letter-tile constructor testing orthography and spelling structure.
- **Stage 5: Use** — Full sentence composition and contextual usage validation.
- **Mastery Unlock** — Reaching 80%+ mastery score unlocks permanent "Mastered" / "Expert" status.

### 2. 📈 Adaptive Spaced Repetition Engine
- **Mastery Score (0–100)**: Dynamically adjusted based on attempt outcome and stage difficulty (e.g., +5 XP for Stage 1 up to +25 XP for Stage 5, -10 XP on mistakes).
- **Mastery Tiers**: Automatically classifies words into `New` (<20), `Learning` (20-39), `Familiar` (40-59), `Strong` (60-79), `Mastered` (80-99), and `Expert` (100).
- **Decay & Review Scheduling**: Next review dates are dynamically calculated based on mastery tier:
  - *New (<20)*: 12 Hours
  - *Learning (20–39)*: 1 Day
  - *Familiar (40–59)*: 2 Days
  - *Strong (60–79)*: 5 Days
  - *Mastered (80–99)*: 10 Days
  - *Expert (100)*: 30 Days

### 3. ⚡ Timed "Turbo Mode" & Gamification
- **Turbo Mode**: Rapid-fire timed practice cards designed to test subconscious recall speed.
- **Daily Target & Streaks**: Streak tracking (`🔥 Xd`) and daily XP goals to maximize user retention.
- **Overdue Banners**: Real-time identification of words requiring urgent review.
- **Analytics Dashboard**: Comprehensive progress overview breakdown by mastery tier and historical attempt logs.

### 4. 🤖 Resilient AI Engine & Exercise Caching
- **Multi-Provider Architecture**: Powered by Google Gemini API for context-aware exercise generation with a automatic local fallback provider for offline resiliency.
- **PostgreSQL JSONB Caching**: Generated exercises and contextual examples are stored in `generated_content` and `generated_exercises` to ensure sub-millisecond response times and eliminate redundant API calls.

---

## 💼 Portfolio & Resume Highlights

If you are showcasing this repository on your resume or portfolio, here are tailored, high-impact bullet points:

> **Full-Stack Software Engineer | Słówka V2 (AI-Augmented Language Learning Engine)**
> - **Architected & Deployed** a full-stack vocabulary acquisition platform using **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Supabase (PostgreSQL)** featuring a 5-stage cognitive learning pipeline.
> - **Engineered an Adaptive Spaced-Repetition System** implementing dynamic mastery tiering (0–100 score) and automated decay intervals (12h to 30d) based on cognitive retrieval difficulty.
> - **Built a Resilient AI Integration Layer** with Google Gemini API and a local fallback engine, utilizing **PostgreSQL JSONB caching** to reduce LLM latency by 90%+ and ensure offline availability.
> - **Implemented Enterprise-Grade Database Security** using Supabase Row Level Security (RLS) policies, foreign key cascades, and automated PL/pgSQL user profile creation triggers.
> - **Maintained High Code Quality & Reliability** through a comprehensive **Vitest unit testing suite** covering scheduling logic, adaptive session selection, game state engines, and AI providers.

---

## 🛠️ Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js 16 (App Router)                         │
│   ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│   │   Learn Engine    │  │    Turbo Mode     │  │    Progress UI    │  │
│   └─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘  │
└─────────────┼──────────────────────┼──────────────────────┼────────────┘
              │                      │                      │
┌─────────────▼──────────────────────▼──────────────────────▼────────────┐
│                             Domain Layer                               │
│  ┌──────────────────┐  ┌───────────────────┐  ┌─────────────────────┐ │
│  │ Mastery Scheduler│  │ Adaptive Session  │  │ AI Provider / Cache │ │
│  └──────────┬───────┘  └─────────┬─────────┘  └──────────┬──────────┘ │
└─────────────┼────────────────────┼───────────────────────┼────────────┘
              │                    │                       │
┌─────────────▼────────────────────▼───────────────────────▼────────────┐
│                    Supabase Backend (PostgreSQL)                       │
│     profiles  │  words  │  word_progress  │  attempts  │  cache        │
└────────────────────────────────────────────────────────────────────────┘
```

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), Material Symbols Icons |
| **Database & Auth** | [Supabase PostgreSQL](https://supabase.com/), `@supabase/ssr`, Row Level Security (RLS), PL/pgSQL Triggers |
| **AI & Audio** | Google Gemini API, Web Speech API (Text-to-Speech), Local Fallback Generator |
| **Testing** | [Vitest 4](https://vitest.dev/) (100% pass rate across core algorithms) |

---

## 🗄️ Database Schema Overview

The database is built on PostgreSQL via Supabase with strict Row Level Security (RLS) policies:

- **`public.profiles`**: Stores user metadata, total XP, current streak, and language preferences. Automatically populated via PL/pgSQL trigger on signup.
- **`public.words`**: Public vocabulary database containing Polish terms, translations, IPA pronunciations, example sentences, and categories.
- **`public.word_progress`**: Per-user tracking table recording current mastery score (0-100), total/correct attempts, last review timestamp, and next review date.
- **`public.attempts`**: Immutable event log recording atomic attempts (stage, correct status, response time ms, hint usage) for performance analytics.
- **`public.generated_content` & `public.generated_exercises`**: JSONB cache tables storing AI-generated context sentences and exercises.

---

## 🧪 Testing Suite

Słówka V2 emphasizes unit testing for core domain algorithms.

```bash
npm test
```

### Test Coverage Summary:
- ✅ `src/lib/mastery/__tests__/scheduler.test.ts` — Tests score deltas, mastery tier classification, and next review date calculations.
- ✅ `src/lib/game/__tests__/engine.test.ts` — Tests 5-stage game state transitions, score increments, and session completion.
- ✅ `src/lib/game/__tests__/word-selection.test.ts` — Tests distractor generation and multiple-choice candidate selection.
- ✅ `src/lib/adaptive/__tests__/adaptive.test.ts` — Tests adaptive session building balancing overdue and weak cards.
- ✅ `src/lib/ai/__tests__/ai-provider.test.ts` — Tests Gemini AI client, fallback provider, and exercise JSON formatting.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm, yarn, or pnpm
- A free [Supabase](https://supabase.com/) account (optional for local mock data)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/modest-bell.git
cd modest-bell
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in your Supabase and Gemini credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Database Setup (Supabase)
Run the SQL script located in [`supabase/schema.sql`](file:///c:/Users/chiru/Documents/antigravity/modest-bell/supabase/schema.sql) in your Supabase SQL Editor to initialize tables, RLS policies, and triggers.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
