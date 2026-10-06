import { NextFunction, Request, Response } from "express";

import { verificarToken } from "../utils/jwt.js";
import { RequestAutenticado } from "../types/auth.types.js";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const cabecalho =
            req.headers.authorization;

        if (!cabecalho) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Token de autenticação não informado."
            });
        }

        const [tipo, token] =
            cabecalho.split(" ");

        if (tipo !== "Bearer" || !token) {
            return res.status(401).json({
                sucesso: false,
                mensagem:
                    "Formato de autenticação inválido."
            });
        }

        const usuario =
            verificarToken(token);

        const request =
            req as RequestAutenticado;

        request.usuario = usuario;

        return next();
    } catch {
        return res.status(401).json({
            sucesso: false,
            mensagem:
                "Token inválido ou expirado."
        });
    }
}
