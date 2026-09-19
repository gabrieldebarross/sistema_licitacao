import {
    Movimentacao
} from "../models/index.js";

class MovimentacaoRepository {
    async criar(dados: {
        processoId: number;
        processoEtapaId?: number | null;
        usuarioId?: number | null;
        setorId?: number | null;
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
        dataMovimentacao?: Date;
    }) {
        return Movimentacao.create({
            processoId: dados.processoId,
            processoEtapaId: dados.processoEtapaId ?? null,
            usuarioId: dados.usuarioId ?? null,
            setorId: dados.setorId ?? null,
            tipo: dados.tipo,
            descricao: dados.descricao,
            dataMovimentacao:
                dados.dataMovimentacao ?? new Date()
        });
    }

    async listarPorProcesso(processoId: number) {
        return Movimentacao.findAll({
            where: {
                processoId
            },
            order: [
                ["dataMovimentacao", "ASC"]
            ]
        });
    }
}

export default new MovimentacaoRepository();