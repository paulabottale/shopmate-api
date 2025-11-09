import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { spec } from "./docs/swagger";
import { router as auth } from "./routes/auth.routes";
import { router as products } from "./routes/products.routes";
import { listPublic } from "./controllers/products.controller";
import { renderStore } from "./controllers/products.controller";


const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", auth);
app.use("/api/products", products);

app.get("/api/public/products", listPublic);

app.get("/shop", renderStore);
app.get("/", renderStore);


const swaggerOptions = {
  customSiteTitle: "ShopMate API Docs",
  customCss: `
    .swagger-ui .topbar { background-color: #111827; }
    .swagger-ui .topbar-wrapper .link span { color: #f9fafb !important; font-weight: 600; }
    .swagger-ui .info h2, .swagger-ui .info p { font-family: system-ui; }
    .swagger-ui .scheme-container { display: none; }
  `
};

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec, swaggerOptions));



export default app;
