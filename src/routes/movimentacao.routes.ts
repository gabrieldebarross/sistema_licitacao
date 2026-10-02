import { Router } from "express";

import movimentacaoController from "../controllers/movimentacao.controller.js";

const movimentacaoRouter = Router();

movimentacaoRouter.get(
    "/processos/:id/movimentacoes",
    (req, res) =>
        movimentacaoController.listarPorProcesso(
            req,
            res
        )
);

export default movimentacaoRouter;