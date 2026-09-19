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
}

export default new UsuarioRepository();