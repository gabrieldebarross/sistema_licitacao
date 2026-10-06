import { Router } from "express";

import processoController from "../controllers/processo.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(
    "/processos",
    authMiddleware
);

router.post(
    "/processos",
    processoController.criar.bind(processoController)
);

router.get(
    "/processos/:id/supervisao",
    processoController.buscarSupervisao.bind(
        processoController
    )
);

export default router;