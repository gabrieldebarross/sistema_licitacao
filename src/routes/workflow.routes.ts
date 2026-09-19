import { Router } from "express";

import workflowController from "../controllers/workflow.controller.js";

const workflowRouter = Router();

workflowRouter.post(
    "/processos/:id/avancar",
    (req, res) =>
        workflowController.avancar(req, res)
);

export default workflowRouter;