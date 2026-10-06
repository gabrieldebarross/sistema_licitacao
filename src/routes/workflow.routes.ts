import { Router } from "express";

import workflowController from "../controllers/workflow.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(
    "/processos",
    authMiddleware
);

router.post(
    "/processos/:id/avancar",
    workflowController.avancar.bind(
        workflowController
    )
);

router.post(
    "/processos/:id/devolver",
    workflowController.devolver.bind(
        workflowController
    )
);

router.post(
    "/processos/:id/etapas/:processoEtapaId/atribuir",
    workflowController.atribuir.bind(
        workflowController
    )
);

export default router;