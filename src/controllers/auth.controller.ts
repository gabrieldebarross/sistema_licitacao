import { Request, Response } from "express";

import authService from "../services/auth.service.js";

class AuthController {
    async login(
        req: Request,
        res: Response
    ) {
        try {
            const resultado =
                await authService.login(
                    req.body
                );

            return res.status(200).json({
                sucesso: true,
                dados: resultado
            });
        } catch (erro) {
            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Erro ao realizar login.";

            const status =
                mensagem ===
                "E-mail ou senha inválidos."
                    ? 401
                    : mensagem ===
                      "Usuário inativo."
                    ? 403
                    : 400;

            return res.status(status).json({
                sucesso: false,
                mensagem
            });
        }
    }
}

export default new AuthController();