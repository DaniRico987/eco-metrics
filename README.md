# Eco Metrics 🌿

> 🇪🇸 [Leer esto en Español](./README.es.md)

**Eco Metrics** is a comprehensive platform designed to help companies track, measure, and manage their environmental impact. By recording key metrics such as energy consumption, water usage, waste generation, and transport emissions, organizations can visualize their footprint and make data-driven decisions towards sustainability.

## 🚀 Key Features

- **Company Management**: Onboard companies and track their specific environmental data.
- **Impact Recording**: Log monthly records for:
  - ⚡ **Energy** (kWh)
  - 💧 **Water** (m³)
  - 🗑️ **Waste** (kg)
  - 🚚 **Transport** (km)
- **Role-Based Access Control (RBAC)**:
  - `SUPER_ADMIN`: System-wide oversight.
  - `COMPANY_MANAGER`: Manage company-specific data and users.
  - `USER`: View and input data.
- **Interactive Dashboard**: Visualize trends and total impact calculations.

## 🛠️ Technology Stack

### Backend

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **API**: GraphQL (Apollo Server)
- **Database Settings**: [Prisma ORM](https://www.prisma.io/) v7+
- **Database**: PostgreSQL (with Driver Adapters)
- **Authentication**: JWT & Passport

### Frontend

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Client State**: Apollo Client
- **Styling**: Modern CSS / Tailwind (if applicable)
- **UI Components**: Lucide React, Framer Motion

## 📂 Project Structure

```
eco-metrics/
├── backend/            # NestJS API & Database Logic
│   ├── src/            # Application Source
│   ├── prisma/         # Schema & Migrations
│   └── prisma.config.ts # Prisma 7 Configuration
└── frontend/           # React Client Application
```

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v20+)
- PostgreSQL Database
- npm or pnpm

### 1. Backend Setup

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment:
    Create a `.env` file in `backend/` and add your database URL:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/eco_metrics_db?schema=public"
    JWT_SECRET="your_secret_key"
    ```
4.  Run Database Migrations:
    ```bash
    npx prisma migrate dev --name init
    ```
5.  Start the Server:
    ```bash
    npm run start:dev
    ```
    _Server will run at `http://localhost:3000` (GraphQL Playground at `/graphql`)_

### 2. Frontend Setup

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Development Server:
    ```bash
    npm run dev
    ```
    _Client will run usually at `http://localhost:5173`_

## 📜 Database Schema

The core models include:

- **Company**: The entity being tracked.
- **User**: Accounts associated with companies (or admins).
- **ImpactRecord**: Monthly data points for environmental metrics.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
