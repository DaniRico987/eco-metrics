# Eco Metrics 🌿

> 🇬🇧 [Read this in English](./README.md)

**Eco Metrics** es una plataforma de sostenibilidad de nivel profesional para medir, rastrear y gestionar el impacto ambiental corporativo. Permite a las organizaciones monitorear métricas clave de consumo, establecer metas anuales y obtener insights potenciados por IA para reducir su huella de carbono.

## 🚀 Características Principales

### 🏢 Organización y Acceso

- **Onboarding de Empresas**: Flujo de registro optimizado para nuevas compañías.
- **Control Basado en Roles**: Acceso jerárquico para `SUPER_ADMIN`, `COMPANY_MANAGER` y `USER`.
- **Sistema de Aprobación**: Los administradores aprueban/rechazan solicitudes para proteger los datos de la empresa.

### 📊 Inteligencia de Impacto

- **Registro Mensual**: Logs detallados de Energía (kWh), Agua (m³), Residuos (kg) y Transporte (km).
- **Dashboard Profesional**: Visualizaciones avanzadas y análisis de tendencias en tiempo real con Recharts.
- **Gestión de Metas**: Establece y mide objetivos de sostenibilidad anuales por categoría.
- **Eco-Asistente IA**: Insights contextuales (Groq + LLAMA 3.3) para la optimización basada en datos.

### 🛡️ Excelencia Técnica

- **Tipado 100% Seguro**: Cobertura estricta de TypeScript Full-Stack (Cero uso de `any`).
- **UX Fluida**: Mensajes de error amigables y localizados en español para todos los casos de uso.
- **Diseño Responsive**: Interfaz premium en modo oscuro optimizada para móvil y escritorio.

## 🛠️ Stack Tecnológico

| Capa              | Tecnologías                                           |
| :---------------- | :---------------------------------------------------- |
| **Backend**       | NestJS, Node.js, GraphQL (Apollo), Prisma 7+          |
| **Frontend**      | React, Vite, Apollo Client, CSS inspirado en Tailwind |
| **Base de Datos** | PostgreSQL                                            |
| **IA**            | Groq SDK (LLAMA 3.3-70b-versatile)                    |
| **Animaciones**   | Framer Motion, Lucide React (Iconos)                  |

## 📂 Estructura del Proyecto

```bash
eco-metrics/
├── backend/             # API GraphQL NestJS
│   ├── src/             # Código fuente (Servicios, Resolvers, Guards)
│   ├── prisma/          # Esquema de base de datos y migraciones
│   └── common/          # Decoradores, interfaces y filtros globales
└── frontend/            # Cliente React + Vite
    ├── src/components/  # Widgets de UI y Gráficos
    ├── src/pages/       # Vistas de la App y Navegación
    ├── src/graphql/     # Queries y Mutaciones de API
    └── src/types/       # Sistema de Tipos Centralizado (Fuente de Verdad)
```

## ⚙️ Instalación y Configuración

### Prerrequisitos

- **Node.js**: v20+
- **Base de Datos**: PostgreSQL
- **IA Key**: Groq API Key

### 1. Configuración del Backend

1. `cd backend`
2. `npm install`
3. Crear `.env`:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/eco_metrics?schema=public"
   JWT_SECRET="tu_clave_secreta_aleatoria"
   GROQ_API_KEY="tu_llave_de_groq"
   ```
4. `npx prisma migrate dev`
5. `npm run start:dev`

### 2. Configuración del Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 📜 Puntos Destacados de la Arquitectura

### El Sistema de Tipos 🛡️

El proyecto utiliza un **Protocolo de Tipado Centralizado**. Cualquier cambio en el modelo de datos debe actualizarse en `frontend/src/types/index.ts`, asegurando que toda la interfaz permanezca sincronizada y segura.

### Manejo de Errores 🚨

Implementamos un sistema de mapeo global que transforma errores complejos de Backend/Prisma en mensajes amigables en español, garantizando una experiencia fluida incluso cuando algo sale mal.

---

_Desarrollado con enfoque en Rendimiento, Sostenibilidad y Calidad de Código._
