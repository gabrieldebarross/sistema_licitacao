import { Router } from "express";

import movimentacaoController from "../controllers/movimentacao.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
    "/processos/:id/movimentacoes",
    authMiddleware,
    movimentacaoController.listarPorProcesso.bind(
        movimentacaoController
    )
);

export default router;