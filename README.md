# Eco Metrics 🌿

> 🇪🇸 [Leer esto en Español](./README.es.md)

![Render Status](https://img.shields.io/badge/Deployment-Live-success?style=for-the-badge&logo=render)
![Vercel Status](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)
![Tech Stack](https://img.shields.io/badge/Stack-PERN-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Eco Metrics** is a pro-grade sustainability platform tailored for enterprises to measure, track, and manage environmental impact. By leveraging **Artificial Intelligence (Llama 3.3)** and **Real-time Analytics**, it empowers organizations to make data-driven decisions to reduce their carbon footprint.

---

## 🚀 Live Demo

| Service               | Status     | URL                                                                          |
| :-------------------- | :--------- | :--------------------------------------------------------------------------- |
| **🚀 App (Frontend)** | **Online** | [**eco-metrics.onrender.com**](https://eco-metrics.onrender.com/)            |
| **⚙️ API (Backend)**  | **Online** | [eco-metrics.onrender.com/graphql](https://eco-metrics.onrender.com/graphql) |

> **Credentials for Testing:**
>
> - **Manager:** `admin@ecotest.com` / `Test1234`
> - **Employee:** `empleado@ecotest.com` / `Test1234`

---

## 📚 Documentation & Manuals

Comprehensive guides for User Acceptance Testing (UAT) and role-specific workflows.

| Role                   | Description                                             | Link                                               |
| :--------------------- | :------------------------------------------------------ | :------------------------------------------------- |
| **👮 Company Manager** | Administrative workflows, user approvals, goal setting. | [View Manual](./testing_manual_company_manager.md) |
| **🧑‍💻 Employee**        | Data entry, metric visualization, reporting.            | [View Manual](./testing_manual_empleado.md)        |

---

## ✨ Core Features

### 🧠 Custom AI-Powered Metrics

Create business-specific metrics (e.g., _"Uber Trips"_, _"Flour Usage"_) driven by our **AI Wizard**.

- **Intelligent Extraction**: AI determines scientific units (`kgCO2e`) and emission factors.
- **Groq + Llama 3.3**: Ultra-fast inference with persistent caching to minimize costs.

### 🏢 Hierarchical Organization

- **Strict Access Control**: `SUPER_ADMIN` > `COMPANY_MANAGER` > `USER`.
- **Approval System**: Secure onboarding requiring manager verification.

### 📊 Professional Analytics

- **Real-time Dashboard**: Interactive charts built with **Recharts**.
- **Goal Tracking**: Set annual sustainability targets and monitor progress in real-time.
- **Metric Categories**: Energy (kWh), Water (m³), Waste (kg), Transportation (km).

---

---

## 🛠️ Technology Stack

Designed for **High Performance**, **Scalability**, and **Type Safety**.

### **Backend (The Core)**

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **API**: GraphQL (Apollo Server)
- **Database**: PostgreSQL 16
- **ORM**: Prisma 7.2
- **AI Engine**: Groq SDK + Llama 3.3

### **Frontend (The Experience)**

- **Framework**: React 19 + Vite
- **State/Data**: Apollo Client (Normalized Cache)
- **Styling**: TailwindCSS Principles + Framer Motion
- **Icons**: Lucide React

---

## ⚡ Local Development Setup

Prerequisites: `Node.js v20+`, `PostgreSQL`, `Groq API Key`.

### 1. Backend Service

```bash
cd backend
npm install
# Create .env file based on example
npx prisma db push
npm run start:dev
```

### 2. Frontend Client

```bash
cd frontend
npm install
npm run dev
```

---

## 🏛️ Architecture Highlights

### 🛡️ Centralized Type Protocol

We maintain a strict **Single Source of Truth** for types. Backend DTOs and Frontend Interfaces are synchronized to ensure 100% type safety and prevent runtime errors.

### ⚡ AiCache Layer

To optimize costs and latency, every AI response is hashed and cached in PostgreSQL. This means repetitive queries (like emission factors for common items) are instant and free after the first call.

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

<div align="center">
  <p>Made with ❤️ by the Eco Metrics Team</p>
</div>
