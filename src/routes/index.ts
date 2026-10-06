import { Router } from "express";

import authRoutes from "./auth.routes.js";
import processoRoutes from "./processo.routes.js";
import workflowRoutes from "./workflow.routes.js";
import movimentacaoRoutes from "./movimentacao.routes.js";

const router = Router();

router.use(authRoutes);
router.use(processoRoutes);
router.use(workflowRoutes);
router.use(movimentacaoRoutes);

export default router;