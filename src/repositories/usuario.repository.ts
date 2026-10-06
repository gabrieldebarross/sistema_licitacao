import { Usuario } from "../models/index.js";

class UsuarioRepository {
    async buscarPorId(id: number) {
        return Usuario.findByPk(id);
    }

    async buscarAtivoPorId(id: number) {
        return Usuario.findOne({
            where: {
                id,
                ativo: true
            }
        });
    }

    async buscarPorEmail(email: string) {
        return Usuario.findOne({
            where: {
                email
            }
        });
    }
}

export default new UsuarioRepository();