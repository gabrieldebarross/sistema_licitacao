import processoRepository from "../repositories/processo.repository.js";
import movimentacaoRepository from "../repositories/movimentacao.repository.js";

class MovimentacaoService {
    async listarPorProcesso(
        processoId: number
    ) {
        /*
         * 1. Validar ID
         */

        if (
            !Number.isInteger(processoId) ||
            processoId <= 0
        ) {
            throw new Error(
                "ID do processo inválido."
            );
        }

        /*
         * 2. Verificar se o processo existe
         */

        const processo =
            await processoRepository.buscarPorId(
                processoId
            );

        if (!processo) {
            throw new Error(
                "Processo não encontrado."
            );
        }

        /*
         * 3. Buscar histórico
         */

        return movimentacaoRepository.listarPorProcesso(
            processoId
        );
    }
}

export default new MovimentacaoService();