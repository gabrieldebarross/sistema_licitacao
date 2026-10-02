import {
    Request,
    Response
} from "express";

import movimentacaoService from "../services/movimentacao.service.js";

class MovimentacaoController {
    async listarPorProcesso(
        req: Request,
        res: Response
    ) {
        try {
            const processoId =
                Number(req.params.id);

            /*
             * 1. Validar ID
             */

            if (
                !Number.isInteger(processoId) ||
                processoId <= 0
            ) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem:
                        "ID do processo inválido."
                });
            }

            /*
             * 2. Buscar histórico
             */

            const movimentacoes =
                await movimentacaoService.listarPorProcesso(
                    processoId
                );

            return res.status(200).json({
                sucesso: true,
                dados: movimentacoes
            });
        } catch (erro) {
            console.error(
                "Erro ao listar movimentações:",
                erro
            );

            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Erro interno ao listar movimentações.";

            /*
             * 3. Processo não encontrado
             */

            if (
                mensagem ===
                "Processo não encontrado."
            ) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem
                });
            }

            /*
             * 4. Erro interno
             */

            return res.status(500).json({
                sucesso: false,
                mensagem:
                    "Erro interno ao listar movimentações."
            });
        }
    }
}

export default new MovimentacaoController();