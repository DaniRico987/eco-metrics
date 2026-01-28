# Eco Metrics 🌿

> 🇬🇧 [Read this in English](./README.md)

![Render Status](https://img.shields.io/badge/Despliegue-En_Línea-success?style=for-the-badge&logo=render)
![Vercel Status](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)
![Tech Stack](https://img.shields.io/badge/Stack-PERN-blue?style=for-the-badge)
![License](https://img.shields.io/badge/Licencia-MIT-yellow?style=for-the-badge)

**Eco Metrics** es una plataforma de sostenibilidad de nivel profesional diseñada para que las empresas midan, rastreen y gestionen su impacto ambiental. Aprovechando **Inteligencia Artificial (Llama 3.3)** y **Analítica en Tiempo Real**, empodera a las organizaciones para tomar decisiones basadas en datos y reducir su huella de carbono.

---

## 🚀 Demo en Vivo

| Servicio              | Estado     | URL                                                                          |
| :-------------------- | :--------- | :--------------------------------------------------------------------------- |
| **🚀 App (Frontend)** | **Online** | [**eco-metrics.onrender.com**](https://eco-metrics.onrender.com/)            |
| **⚙️ API (Backend)**  | **Online** | [eco-metrics.onrender.com/graphql](https://eco-metrics.onrender.com/graphql) |

> **Credenciales de Prueba:**
>
> - **Manager:** `admin@ecotest.com` / `Test1234`
> - **Empleado:** `empleado@ecotest.com` / `Test1234`

---

## 📚 Documentación y Manuales

Guías completas para Pruebas de Aceptación (UAT) y flujos por rol.

| Rol                    | Descripción                                  | Enlace                                            |
| :--------------------- | :------------------------------------------- | :------------------------------------------------ |
| **👮 Company Manager** | Gestión administrativa, aprobaciones, metas. | [Ver Manual](./testing_manual_company_manager.md) |
| **🧑‍💻 Empleado**        | Carga de datos, visualización de métricas.   | [Ver Manual](./testing_manual_empleado.md)        |

---

## ✨ Características Principales

### 🧠 Métricas Personalizadas con IA

Crea métricas específicas (ej: _"Viajes Uber"_, _"Uso de Harina"_) guiado por nuestro **AI Wizard**.

- **Extracción Inteligente**: La IA determina unidades científicas (`kgCO2e`) y factores de emisión.
- **Groq + Llama 3.3**: Inferencia ultra-rápida con caché persistente para minimizar costos.

### 🏢 Organización Jerárquica

- **Control de Acceso Estricto**: `SUPER_ADMIN` > `COMPANY_MANAGER` > `USER`.
- **Sistema de Aprobación**: Onboarding seguro que requiere verificación del manager.

### 📊 Analítica Profesional

- **Dashboard en Tiempo Real**: Gráficos interactivos construidos con **Recharts**.
- **Seguimiento de Metas**: Define objetivos anuales y monitorea el progreso.
- **Categorías de Métricas**: Energía (kWh), Agua (m³), Residuos (kg), Transporte (km).

---

---

## 🛠️ Stack Tecnológico

Diseñado para **Alto Rendimiento**, **Escalabilidad** y **Seguridad de Tipos**.

### **Backend (El Núcleo)**

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **API**: GraphQL (Apollo Server)
- **Base de Datos**: PostgreSQL 16
- **ORM**: Prisma 7.2
- **Motor IA**: Groq SDK + Llama 3.3

### **Frontend (La Experiencia)**

- **Framework**: React 19 + Vite
- **Estado/Datos**: Apollo Client (Caché Normalizado)
- **Estilos**: Principios TailwindCSS + Framer Motion
- **Iconos**: Lucide React

---

## ⚡ Configuración Local

Prerrequisitos: `Node.js v20+`, `PostgreSQL`, `Groq API Key`.

### 1. Servicio Backend

```bash
cd backend
npm install
# Crear archivo .env basado en el ejemplo
npx prisma db push
npm run start:dev
```

### 2. Cliente Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🏛️ Puntos Destacados de Arquitectura

### 🛡️ Protocolo de Tipado Centralizado

Mantenemos una **Fuente Única de Verdad** para los tipos. Los DTOs del Backend y las Interfaces del Frontend están sincronizados para garantizar 100% de seguridad de tipos y prevenir errores en tiempo de ejecución.

### ⚡ Capa AiCache

Para optimizar costos y latencia, cada respuesta de la IA se "hashea" y almacena en PostgreSQL. Esto significa que las consultas repetitivas (como factores de emisión para ítems comunes) son instantáneas y gratuitas después de la primera llamada.

---

## 📝 Licencia

Este proyecto está bajo la **Licencia MIT** - ver el archivo [LICENSE](LICENSE) para detalles.

<div align="center">
  <p>Creado con ❤️ por el Equipo Eco Metrics</p>
</div>
