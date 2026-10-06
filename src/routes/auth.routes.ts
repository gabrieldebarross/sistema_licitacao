import { Router } from "express";

import authController from "../controllers/auth.controller.js";

const router = Router();

router.post(
    "/auth/login",
    authController.login.bind(authController)
);

export default router;
