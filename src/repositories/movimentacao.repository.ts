import {
    Movimentacao
} from "../models/index.js";

import {
    Transaction
} from "sequelize";

class MovimentacaoRepository {
    async criar(
        dados: {
            processoId: number;
            processoEtapaId: number | null;
            usuarioId: number | null;
            setorId: number | null;

            tipo:
                | "CRIACAO"
                | "INICIO_ETAPA"
                | "CONCLUSAO_ETAPA"
                | "ENCAMINHAMENTO"
                | "DEVOLUCAO"
                | "ALTERACAO"
                | "SUSPENSAO"
                | "RETOMADA"
                | "OBSERVACAO";

            descricao: string;

            dataMovimentacao: Date;
        },
        transaction: Transaction
    ) {
        return Movimentacao.create(
            {
                processoId:
                    dados.processoId,

                processoEtapaId:
                    dados.processoEtapaId,

                usuarioId:
                    dados.usuarioId,

                setorId:
                    dados.setorId,

                tipo:
                    dados.tipo,

                descricao:
                    dados.descricao,

                dataMovimentacao:
                    dados.dataMovimentacao
            },
            {
                transaction
            }
        );
    }

    async listarPorProcesso(
        processoId: number
    ) {
        return Movimentacao.findAll({
            where: {
                processoId
            },
            order: [
                [
                    "dataMovimentacao",
                    "ASC"
                ]
            ]
        });
    }
}

export default new MovimentacaoRepository();