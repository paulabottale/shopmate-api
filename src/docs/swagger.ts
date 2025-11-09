export const spec = {
  openapi: "3.0.3",
  info: {
    title: "ShopMate API",
    version: "1.0.0",
    description: `
    `
  },
  servers: [
    { url: "http://localhost:3000", description: "Local" },
    { url: "https://TU-PROYECTO.vercel.app", description: "Producción" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "Auth", description: "Registro y login de usuarios" },
    { name: "Products", description: "Gestión de productos de ShopMate" }
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Info"],
        summary: "Health check",
        responses: { "200": { description: "OK" } }
      },
    "/api/public/products": {
  get: {
    tags: ["Products"],
    summary: "Listar productos públicos (sin autenticación)",
    parameters: [
      { name: "page", in: "query", schema: { type: "integer" } },
      { name: "size", in: "query", schema: { type: "integer" } },
      { name: "q", in: "query", schema: { type: "string" } }
    ],
    responses: {
      "200": { description: "Listado paginado de productos demo" }
    }
  }
  },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrar usuario",
        // ...(lo que ya tenías)
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
      }
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Actualizar access token",
      }
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Listar productos con filtros y paginación",
      },
      post: {
        tags: ["Products"],
        summary: "Crear producto",
      }
    },
    "/api/products/{id}": {
      get: { tags: ["Products"], summary: "Obtener producto por ID" },
      put: { tags: ["Products"], summary: "Actualizar producto" },
      delete: { tags: ["Products"], summary: "Eliminar producto (ADMIN)" }
    }
  }
};
