import { Router } from "express";

import processoRoutes from "./processo.routes.js";
import workflowRoutes from "./workflow.routes.js";
import movimentacaoRoutes from "./movimentacao.routes.js";

const router = Router();

router.use(
    "/processos",
    processoRoutes
);

router.use(
    "/",
    workflowRoutes
);

router.use(
    "/",
    movimentacaoRoutes
);

export default router;