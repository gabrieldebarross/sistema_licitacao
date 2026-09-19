import { Router } from "express";

import processoRoutes from "./processo.routes.js";
import workflowRoutes from "./workflow.routes.js";

const router = Router();

router.use(
    "/processos",
    processoRoutes
);

router.use(
    "/",
    workflowRoutes
);

export default router;