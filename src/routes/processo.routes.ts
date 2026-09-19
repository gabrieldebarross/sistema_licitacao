import { Router } from "express";

import processoController from "../controllers/processo.controller.js";

const router = Router();

router.post(
    "/",
    (req, res) =>
        processoController.criar(req, res)
);

router.get(
    "/",
    (req, res) =>
        processoController.listar(req, res)
);

router.get(
    "/:id",
    (req, res) =>
        processoController.buscarPorId(req, res)
);

export default router;