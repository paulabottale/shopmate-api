import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import * as c from "../controllers/products.controller";
const router = Router();

router.get("/", requireAuth, c.list);
router.post("/", requireAuth, c.create);
router.get("/:id", requireAuth, c.getById);
router.put("/:id", requireAuth, c.update);
router.delete("/:id", requireAuth, requireAdmin, c.remove);

export { router };
