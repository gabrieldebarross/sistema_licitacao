import bcrypt from "bcrypt";

import usuarioRepository from "../repositories/usuario.repository.js";
import {
    gerarToken
} from "../utils/jwt.js";

import {
    LoginDTO,
    LoginResponse
} from "../types/auth.types.js";

class AuthService {
    async login(
        dados: LoginDTO
    ): Promise<LoginResponse> {
        const email =
            dados.email
                ?.trim()
                .toLowerCase();

        const senha =
            dados.senha;

        if (!email) {
            throw new Error(
                "E-mail é obrigatório."
            );
        }

        if (!senha) {
            throw new Error(
                "Senha é obrigatória."
            );
        }

        const usuario =
            await usuarioRepository.buscarPorEmail(
                email
            );

        if (!usuario) {
            throw new Error(
                "E-mail ou senha inválidos."
            );
        }

        if (!usuario.ativo) {
            throw new Error(
                "Usuário inativo."
            );
        }

        const senhaValida =
            await bcrypt.compare(
                senha,
                usuario.senha
            );

        if (!senhaValida) {
            throw new Error(
                "E-mail ou senha inválidos."
            );
        }

        const token =
            gerarToken({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil,
                setorId:
                    usuario.setorId
            });

        return {
            token,

            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil,
                setorId:
                    usuario.setorId
            }
        };
    }
}

export default new AuthService();