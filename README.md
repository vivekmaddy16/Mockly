# 🎙️ Mockly — AI-Powered Interview Preparation & Simulator System

[![Next.js 15](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Mockly** is an enterprise-grade, full-stack **AI-powered mock interview preparation system**. It combines real-time speech recognition (STT), text-to-speech (TTS), multi-dimensional AI answer grading, automated resume/JD skill extraction, structured CS roadmap trees, and candidate readiness analytics—wrapped in a modern **Castrio-inspired UI design system**.

---

## 🌟 Key Features

### 🎙️ Live Studio AI Interview Room
- **Real-Time Audio Waveform Canvas**: Dynamic frequency visualizer canvas reacting to live voice input during speech recording.
- **Pulsing AI Interviewer Aura**: Animated visual indicator when Text-to-Speech is reading questions aloud.
- **Speech-to-Text (STT) & Text-to-Speech (TTS)**: Dictate answers using Web Speech API; hear AI questions read aloud.
- **STAR Framework Guidance Drawer**: Collapsible slide-over drawer giving candidates instant advice on structuring answers using **Situation, Task, Action, Result**.

### 📊 Executive Performance Scorecard & Analytics
- **Animated Readiness Gauge Ring**: Radial progress gauge classifying candidate readiness (*FAANG Ready*, *Good Candidate*, *Needs Practice*).
- **3-Metric Breakdown**: Granular scoring across **Technical Depth**, **STAR Structure**, and **Articulation/Clarity**.
- **Model Answer Comparison**: Side-by-side split viewer comparing candidate responses with golden AI model answers.
- **Domain Mastery Radar Chart**: Recharts radar graph mapping candidate strength across `DSA`, `OOPs`, `DBMS`, `OS`, `CN`, and `System Design`.

### 🌳 Structured CS & System Design Roadmap Tree
- Step-by-step milestone nodes for Computer Science fundamentals and System Design.
- Connected to backend MySQL APIs for user step completion tracking and resource drawers.

### 🛡️ Enterprise Security & Authentication
- **Dual-Token Strategy**: Short-lived Access Tokens (15 min) + `httpOnly` Refresh Tokens (7 days).
- **Token Rotation & Reuse Detection**: Refresh requests issue new token pairs; reused old tokens trigger immediate multi-device session invalidation.
- **Account Lockout**: 5 consecutive failed login attempts lock the account for 30 minutes.
- **Rate Limiting & Security Headers**: Multi-tiered rate limiters, Helmet headers, CORS credentials control, and Express-Validator sanitization.
- **Email Verification & Password Reset**: Tokenized email flows powered by Nodemailer.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Framer Motion, Canvas Confetti |
| **Backend** | Node.js, Express 5, Mongoose (MongoDB ODM), Sequelize ORM (MySQL), JsonWebToken, BcryptJS, Nodemailer |
| **Design System** | Castrio Aesthetic (Sage `#B5C49C`, Cream Canvas Sheet `#FFFFFF`, Charcoal `#1B1E16`, Lime `#C5F874`, Syne Display Font) |
| **AI Engine** | Google Gemini 1.5/2.5 Flash (`@google/generative-ai`) + Fallback Rules Engine |

---

## 🗄️ Database Architecture

### Primary Database: MongoDB
- `User`: Handles credentials, hashed passwords (bcrypt salt 12), login attempts, lockout timer, verification tokens, and multi-device refresh token array.
- `InterviewSession`: Stores mock interview sessions, generated questions, evaluations, target role, and aggregated overall feedback.
- `ProgressTracker`: Tracks daily user progress (questions answered, topics practiced, time spent, streak calculation).

### Optional Database: MySQL (Sequelize ORM)
- `RoadmapSteps`: Structured CS/Tech categories (`DSA`, `OOPs`, `DBMS`, `OS`, `CN`, `System Design`), prerequisites, resources, and user completion tracking.
- `ResumeVersionSQL`: Structured resume versioning with JSON section storage (`summary`, `experience`, `education`, `skills`) and ATS scoring.

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Running instance (local or Cloud Atlas)
- **MySQL**: (Optional) Running instance for roadmap features

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/vivekmaddy16/Mockly.git
cd Mockly
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/mockly_db

# Security & JWT Secrets
JWT_SECRET=mockly_access_token_secret_2026_ultra_secure_key_x9z
JWT_REFRESH_SECRET=mockly_refresh_token_secret_2026_ultra_secure_key_r7q
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Optional Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional MySQL Configuration (Sequelize)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=mockly_sql_db
```

### 4. Run Full Stack Server Concurrently
Start both the Next.js frontend (Port `3000`) and Express backend API server (Port `5000`):
```bash
npm run dev:full
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API Base**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 📡 API Endpoints Overview

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user & send verification email |
| `POST` | `/api/auth/login` | Authenticate user, issue access token & set refresh cookie |
| `POST` | `/api/auth/refresh-token` | Rotate refresh token & issue new access token |
| `POST` | `/api/auth/logout` | Revoke refresh token & clear HTTP cookie |
| `POST` | `/api/auth/forgot-password` | Send password reset token email |
| `POST` | `/api/auth/reset-password` | Reset user password with token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |

### Mock Interviews (`/api/interviews`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/interviews` | Fetch candidate interview sessions (paginated) |
| `POST` | `/api/interviews` | Create new interview session |
| `GET` | `/api/interviews/:id` | Fetch specific session details |
| `PUT` | `/api/interviews/:id/evaluations` | Submit question answer for AI evaluation |

### Candidate Analytics & Roadmap (`/api/progress` & `/api/roadmap`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/progress/stats` | Aggregated user stats (avg score, streak, category matrix) |
| `GET` | `/api/roadmap?category=DSA` | Fetch CS subject roadmap steps |
| `POST` | `/api/roadmap/step/:id/complete` | Toggle roadmap step completion |

---




## 📄 License
This project is licensed under the [MIT License](LICENSE).
