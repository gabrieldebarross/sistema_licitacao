import { Setor } from "../models/index.js";

class SetorRepository {
    async buscarPorId(id: number) {
        return Setor.findByPk(id);
    }

    async buscarAtivoPorId(id: number) {
        return Setor.findOne({
            where: {
                id,
                ativo: true
            }
        });
    }
}

export default new SetorRepository();