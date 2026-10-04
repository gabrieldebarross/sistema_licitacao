import { Request } from "express";

export interface UsuarioAutenticado {
    id: number;
    nome: string;
    email: string;
    perfil: string;
    setorId: number | null;
}

export interface RequestAutenticado
    extends Request {
    usuario?: UsuarioAutenticado;
}

export interface LoginDTO {
    email: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
    usuario: {
        id: number;
        nome: string;
        email: string;
        perfil: string;
        setorId: number | null;
    };
}