# Eco Metrics 🌿

> 🇪🇸 [Leer esto en Español](./README.es.md)

**Eco Metrics** is a pro-grade sustainability platform for measuring, tracking, and managing corporate environmental impact. It enables organizations to monitor key consumption metrics, set annual targets, and get AI-powered insights to reduce their footprint.

## 🚀 Core Features

### 🏢 Organization & Access

- **Company Onboarding**: Streamlined registration for new companies.
- **Role-Based Control**: Hierarchical access for `SUPER_ADMIN`, `COMPANY_MANAGER`, and `USER`.
- **Approval System**: Managers approve/reject member requests to protect company data.

### 📊 Impact Intelligence

- **Monthly Recording**: Detailed logs for Energy (kWh), Water (m³), Waste (kg), and Transport (km).
- **Pro Dashboard**: High-end visualizations and real-time trend analysis using Recharts.
- **Goal Management**: Set and track annual sustainability targets per category.
- **AI Eco-Assistant**: Contextual AI insights (Groq + LLAMA 3.3) for data-driven optimization.

### 🛡️ Technical Excellence

- **100% Type Safety**: Strict Full-Stack TypeScript coverage (Zero `any` usage).
- **Graceful UX**: Friendly, localized error messages in Spanish for all edge cases.
- **Responsive Design**: Premium dark-mode UI optimized for mobile and desktop.

## 🛠️ Technology Stack

| Layer          | Technologies                                      |
| :------------- | :------------------------------------------------ |
| **Backend**    | NestJS, Node.js, GraphQL (Apollo), Prisma 7+      |
| **Frontend**   | React, Vite, Apollo Client, Tailwind-inspired CSS |
| **Database**   | PostgreSQL                                        |
| **AI**         | Groq SDK (LLAMA 3.3-70b-versatile)                |
| **Animations** | Framer Motion, Lucide React (Icons)               |

## 📂 Project Structure

```bash
eco-metrics/
├── backend/             # NestJS GraphQL API
│   ├── src/             # Source code (Services, Resolvers, Guards)
│   ├── prisma/          # Database schema & migrations
│   └── common/          # Global decorators, interfaces & filters
└── frontend/            # React + Vite Client
    ├── src/components/  # UI Widgets & Charts
    ├── src/pages/       # App Views & Navigation
    ├── src/graphql/     # API Queries & Mutations
    └── src/types/       # Centralized Type System (Source of Truth)
```

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js**: v20+
- **Database**: PostgreSQL
- **AI Key**: Groq API Key

### 1. Backend Setup

1. `cd backend`
2. `npm install`
3. Create `.env`:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/eco_metrics?schema=public"
   JWT_SECRET="your_secure_random_key"
   GROQ_API_KEY="your_groq_key"
   ```
4. `npx prisma migrate dev`
5. `npm run start:dev`

### 2. Frontend Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 📜 Architecture Highlights

### The Type System 🛡️

The project uses a **Centralized Type Protocol**. Any change in the data model must be updated in `frontend/src/types/index.ts`, ensuring the entire UI stays synchronized and type-safe.

### Error Handling 🚨

We implemented a global mapping system that transforms complex Backend/Prisma errors into user-friendly Spanish messages, ensuring a smooth experience even when things go wrong.

---

_Developed with focus on Performance, Sustainability and Code Quality._
