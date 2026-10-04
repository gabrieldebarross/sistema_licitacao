import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface PayloadToken {
    id: number;
    nome: string;
    email: string;
    perfil: string;
    setorId: number | null;
}

export function gerarToken(payload: PayloadToken): string {
    if (!env.jwtSecret) {
        throw new Error(
            "JWT_SECRET não configurado."
        );
    }

    return jwt.sign(
        payload,
        env.jwtSecret,
        {
            expiresIn: "8h"
        }
    );
}

export function verificarToken(
    token: string
): PayloadToken {
    if (!env.jwtSecret) {
        throw new Error(
            "JWT_SECRET não configurado."
        );
    }

    const payload =
        jwt.verify(
            token,
            env.jwtSecret
        );

    if (
        typeof payload !== "object" ||
        payload === null ||
        typeof payload.id !== "number" ||
        typeof payload.nome !== "string" ||
        typeof payload.email !== "string" ||
        typeof payload.perfil !== "string"
    ) {
        throw new Error(
            "Token inválido."
        );
    }

    return {
        id: payload.id,
        nome: payload.nome,
        email: payload.email,
        perfil: payload.perfil,
        setorId:
            typeof payload.setorId === "number"
                ? payload.setorId
                : null
    };
}