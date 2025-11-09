import type { Request, Response } from "express";
import { Product } from "../models/Product";
import { productCreateSchema, productUpdateSchema } from "../schemas/product.schema";

export async function list(req: Request, res: Response) {
  const { page = "1", size = "10", q } = req.query;
  const p = Math.max(1, Number(page));
  const s = Math.min(50, Math.max(1, Number(size)));
  const where = q ? { name: { $regex: String(q), $options: "i" } } : {};

  const [items, total] = await Promise.all([
    Product.find(where)
      .sort({ createdAt: -1 })
      .skip((p - 1) * s)
      .limit(s),
    Product.countDocuments(where)
  ]);

  return res.json({ items, page: p, size: s, total });
}

export async function create(req: Request, res: Response) {
  const parsed = productCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const user = (req as any).user as { sub: string };
  const item = await Product.create({ ...parsed.data, ownerId: user.sub });

  return res.status(201).json(item);
}

export async function getById(req: Request, res: Response) {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  return res.json(item);
}

export async function update(req: Request, res: Response) {
  const parsed = productUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const item = await Product.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
  if (!item) return res.status(404).json({ error: "Not found" });

  return res.json(item);
}

export async function remove(req: Request, res: Response) {
  await Product.findByIdAndDelete(req.params.id);
  return res.status(204).send();
}

export async function listPublic(req: Request, res: Response) {
  const { page = "1", size = "10", q } = req.query;
  const p = Math.max(1, Number(page));
  const s = Math.min(50, Math.max(1, Number(size)));
  const where = q ? { name: { $regex: String(q), $options: "i" } } : {};

  const [items, total] = await Promise.all([
    Product.find(where)
      .sort({ createdAt: -1 })
      .skip((p - 1) * s)
      .limit(s)
      .select("-ownerId"),
    Product.countDocuments(where)
  ]);

  return res.json({ items, page: p, size: s, total });
}

export async function renderStore(req: Request, res: Response) {
  const { q } = req.query;
  const filter = q
    ? { name: { $regex: String(q), $options: "i" } }
    : {};

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const html = `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>ShopMate · Catálogo demo</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          background: #0f172a;
          color: #e5e7eb;
          padding: 24px;
        }
        header {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid #22c55e33;
          color: #22c55e;
          background: #020817;
        }
        .title {
          font-size: 28px;
          font-weight: 600;
          color: #f9fafb;
        }
        .subtitle {
          font-size: 14px;
          color: #9ca3af;
        }
        .actions {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 12px;
          color: #9ca3af;
        }
        .actions a {
          color: #38bdf8;
          text-decoration: none;
        }
        .search-form {
          margin-top: 8px;
        }
        .search-input {
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #374151;
          background: #020817;
          color: #e5e7eb;
          width: 220px;
          font-size: 13px;
        }
        .grid {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .card {
          background: #020817;
          border-radius: 16px;
          padding: 14px;
          border: 1px solid #111827;
          box-shadow: 0 12px 30px rgba(15,23,42,0.55);
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(15,23,42,0.9);
          border-color: #38bdf8;
        }
        .pill {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 999px;
          background: #111827;
          color: #9ca3af;
          align-self: flex-start;
        }
        .name {
          font-size: 15px;
          font-weight: 600;
          color: #f9fafb;
        }
        .description {
          font-size: 12px;
          color: #9ca3af;
          min-height: 32px;
        }
        .price {
          font-size: 17px;
          font-weight: 600;
          color: #22c55e;
          margin-top: 4px;
        }
        .meta {
          font-size: 10px;
          color: #6b7280;
        }
        .empty {
          margin-top: 32px;
          font-size: 14px;
          color: #9ca3af;
        }
        footer {
          margin-top: 32px;
          font-size: 10px;
          color: #6b7280;
        }
        footer a {
          color: #38bdf8;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <header>
        <div class="badge">
          <span>●</span>
          <span>Demo pública de API</span>
        </div>
        <h1 class="title">ShopMate · Catálogo de productos demo</h1>
        <p class="subtitle">
          Vista ligera para reclutadores: datos servidos por la API real de ShopMate (Node + Express + MongoDB + JWT).
        </p>
        <div class="actions">
          <span>🔐 Endpoints protegidos documentados en <a href="/api/docs">/api/docs</a></span>
          <span>🧾 JSON público en <a href="/api/public/products">/api/public/products</a></span>
        </div>
        <form class="search-form" method="GET">
          <input
            class="search-input"
            type="text"
            name="q"
            placeholder="Buscar productos por nombre..."
            value="${q ? String(q).replace(/"/g, "&quot;") : ""}"
          />
        </form>
      </header>

      ${
        products.length === 0
          ? `<p class="empty">No hay productos cargados aún. Ejecutá <code>npm run seed</code> o creá productos vía API.</p>`
          : `<section class="grid">
              ${products
                .map(
                  (p) => `
                <article class="card">
                  <div class="pill">Producto demo</div>
                  <div class="name">${escapeHtml(p.name)}</div>
                  <div class="description">${escapeHtml(
                    p.description || "Sin descripción"
                  )}</div>
                  <div class="price">$ ${Number(p.price).toLocaleString("es-AR")}</div>
                  <div class="meta">ID: ${p._id}</div>
                </article>`
                )
                .join("")}
            </section>`
      }

      <footer>
        Construido por Paula Bottale · Código fuente disponible en el repositorio de ShopMate API.
      </footer>
    </body>
  </html>
  `;

  res.status(200).send(html);
}

// util para evitar inyectar HTML raro
function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}