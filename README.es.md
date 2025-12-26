# Eco Metrics 🌿

> 🇬🇧 [Read this in English](./README.md)

**Eco Metrics** es una plataforma integral diseñada para ayudar a las empresas a rastrear, medir y gestionar su impacto ambiental. Al registrar métricas clave como el consumo de energía, uso de agua, generación de residuos y emisiones de transporte, las organizaciones pueden visualizar su huella y tomar decisiones basadas en datos hacia la sostenibilidad.

## 🚀 Características Clave

- **Gestión de Empresas**: Incorporación de empresas y seguimiento de sus datos ambientales específicos.
- **Registro de Impacto**: Registra datos mensuales para:
  - ⚡ **Energía** (kWh)
  - 💧 **Agua** (m³)
  - 🗑️ **Residuos** (kg)
  - 🚚 **Transporte** (km)
- **Control de Acceso Basado en Roles (RBAC)**:
  - `SUPER_ADMIN`: Supervisión de todo el sistema.
  - `COMPANY_MANAGER`: Gestiona datos y usuarios específicos de la empresa.
  - `USER`: Visualiza e ingresa datos.
- **Dashboard Interactivo**: Visualiza tendencias y cálculos de impacto total.

## 🛠️ Stack Tecnológico

### Backend

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **API**: GraphQL (Apollo Server)
- **Configuración BD**: [Prisma ORM](https://www.prisma.io/) v7+
- **Base de Datos**: PostgreSQL (con Driver Adapters)
- **Autenticación**: JWT & Passport

### Frontend

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Lenguaje**: TypeScript
- **Estado del Cliente**: Apollo Client
- **Estilos**: Modern CSS / Tailwind (si aplica)
- **Componentes UI**: Lucide React, Framer Motion

## 📂 Estructura del Proyecto

```
eco-metrics/
├── backend/            # API NestJS y Lógica de Base de Datos
│   ├── src/            # Código Fuente
│   ├── prisma/         # Esquema y Migraciones
│   └── prisma.config.ts # Configuración de Prisma 7
└── frontend/           # Aplicación Cliente React
```

## ⚙️ Instalación y Configuración

### Prerequisitos

- Node.js (v20+)
- Base de Datos PostgreSQL
- npm o pnpm

### 1. Configuración del Backend

1.  Navega a la carpeta del backend:
    ```bash
    cd backend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Configura el Entorno:
    Crea un archivo `.env` en `backend/` y añade la URL de tu base de datos:
    ```env
    DATABASE_URL="postgresql://usuario:password@localhost:5432/eco_metrics_db?schema=public"
    JWT_SECRET="tu_clave_secreta"
    ```
4.  Ejecuta las Migraciones de Base de Datos:
    ```bash
    npx prisma migrate dev --name init
    ```
5.  Inicia el Servidor:
    ```bash
    npm run start:dev
    ```
    _El servidor correrá en `http://localhost:3000` (GraphQL Playground en `/graphql`)_

### 2. Configuración del Frontend

1.  Navega a la carpeta del frontend:
    ```bash
    cd frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el Servidor de Desarrollo:
    ```bash
    npm run dev
    ```
    _El cliente correrá usualmente en `http://localhost:5173`_

## 📜 Esquema de Base de Datos

Los modelos principales incluyen:

- **Company**: La entidad que se rastrea.
- **User**: Cuentas asociadas a empresas (o admins).
- **ImpactRecord**: Puntos de datos mensuales para métricas ambientales.

## 🤝 Contribuir

1.  Haz un Fork del repositorio.
2.  Crea una rama de funcionalidad (`git checkout -b feature/FuncionalidadIncreible`).
3.  Haz Commit de tus cambios (`git commit -m 'Añadir alguna FuncionalidadIncreible'`).
4.  Haz Push a la rama (`git push origin feature/FuncionalidadIncreible`).
5.  Abre un Pull Request.
