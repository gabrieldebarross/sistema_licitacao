import movimentacaoRepository from "../repositories/movimentacao.repository.js";

class MovimentacaoService {
    async listarPorProcesso(
        processoId: number
    ) {
        if (
            !Number.isInteger(processoId) ||
            processoId <= 0
        ) {
            throw new Error(
                "ID do processo inválido."
            );
        }

        return movimentacaoRepository.listarPorProcesso(
            processoId
        );
    }
}

export default new MovimentacaoService();