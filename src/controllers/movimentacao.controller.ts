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

            return res.status(400).json({
                sucesso: false,
                mensagem
            });
        }
    }
}

export default new MovimentacaoController();