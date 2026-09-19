import { Router } from "express";

import workflowController from "../controllers/workflow.controller.js";

const workflowRouter = Router();

workflowRouter.post(
    "/processos/:id/avancar",
    (req, res) =>
        workflowController.avancar(
            req,
            res
        )
);

workflowRouter.post(
    "/processos/:id/devolver",
    (req, res) =>
        workflowController.devolver(
            req,
            res
        )
);

workflowRouter.post(
    "/processos/:id/etapas/:processoEtapaId/atribuir",
    (req, res) =>
        workflowController.atribuir(
            req,
            res
        )
);

export default workflowRouter;