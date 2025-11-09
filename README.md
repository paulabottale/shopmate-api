# 🛒 ShopMate API

API REST full stack-friendly para un e-commerce simple, construida como proyecto de portfolio por **Paula Bottale**.

Incluye:

- Registro y login con **JWT** (access + refresh)
- CRUD de productos con protección por token
- Endpoint público para listar productos demo
- Documentación interactiva con **Swagger UI**
- Base de datos en **MongoDB Atlas**
- Lista para deploy en **Vercel**

----------------------------------------------------------------------------

## 🚀 Demo

> Reemplazá estos links cuando despliegues.

- **Docs (Swagger UI):** `https://TU-PROYECTO.vercel.app/api/docs`
- **Catálogo público:** `https://TU-PROYECTO.vercel.app/api/public/products`

---

## 🧪 Guía rápida para probar endpoints

1. Ir a **`/api/docs`**.
2. Crear usuario en `POST /api/auth/register`.
3. Hacer login en `POST /api/auth/login` y copiar el `accessToken`.
4. Click en **Authorize** (arriba a la derecha) → `Bearer <accessToken>`.
5. Probar:
   - `GET /api/public/products` (sin auth)
   - `GET /api/products` (con auth)
   - `POST /api/products` creando un producto

------------------------------------------------------------------

## 🛠️ Stack técnico

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **DB:** MongoDB Atlas + Mongoose
- **Auth:** JWT (access & refresh)
- **Validación:** Zod
- **Docs:** Swagger UI / OpenAPI 3
- **Testing (opcional):** Vitest + Supertest
- **Infra:** Vercel (serverless) + Atlas

-------------------------------------------------------------------

## 🏗️ Cómo correrlo localmente

### 1. Clonar el repo

```bash
git clone https://github.com/paulabottale/shopmate-api.git
cd shopmate-api

### 2. Instalar dependencias

```bash
npm install

### 2. Configurar entorno

```crear .env desde .env.example
MONGODB_URI=mongodb+srv://paulabottaledev_db_user:Exito2026@shopmate.g7exulu.mongodb.net/?appName=shopmate
JWT_ACCESS_SECRET="super_secreto_access"
JWT_REFRESH_SECRET="super_secreto_refresh"
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
PORT=3000
NODE_ENV=development

## Levantar Servidor

```bash

npm run seed
npm run dev

## Endpoints locales

http://localhost:3000/health

http://localhost:3000/api/docs

http://localhost:3000/api/public/products

## Endpoints principales

POST /api/auth/register

POST /api/auth/login

POST /api/auth/refresh

GET /api/products (auth)

POST /api/products (auth)

GET /api/products/:id (auth)

PUT /api/products/:id (auth)

DELETE /api/products/:id (ADMIN)

GET /api/public/products (público)

Detalles completos en /api/docs.

## Posibles mejoras futuras

- Roles y permisos más granulares

- Filtros avanzados (precio, categoría, orden)

- Tests E2E completos

- Deploy de un frontend React/Next.js que consuma esta API (ShopMate Web)

Hecho por Paula Bottale.


