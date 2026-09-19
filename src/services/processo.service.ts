import {
    Processo,
    ProcessoEtapa,
    Movimentacao,
    TipoProcesso,
    Fluxo,
    Fase,
    Etapa
} from "../models/index.js";

import { Transaction } from "sequelize";

class ProcessoRepository {
    async criar(
        dados: {
            numero: string;
            objeto: string;
            descricao: string | null;
            tipoProcessoId: number;
            fluxoId: number;
        },
        transaction: Transaction
    ) {
        return Processo.create(
            {
                numero: dados.numero,
                objeto: dados.objeto,
                descricao: dados.descricao,
                tipoProcessoId: dados.tipoProcessoId,
                fluxoId: dados.fluxoId,
                status: "RASCUNHO",
                dataInicio: null,
                dataConclusao: null,
                etapaAtualId: null
            },
            {
                transaction
            }
        );
    }

    async buscarPorId(id: number) {
        return Processo.findByPk(id, {
            include: [
                {
                    model: TipoProcesso,
                    as: "tipoProcesso"
                },
                {
                    model: Fluxo,
                    as: "fluxo"
                },
                {
                    model: ProcessoEtapa,
                    as: "etapas",
                    include: [
                        {
                            model: Etapa,
                            as: "etapa",
                            include: [
                                {
                                    model: Fase,
                                    as: "fase"
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Movimentacao,
                    as: "movimentacoes"
                },
                {
                    model: ProcessoEtapa,
                    as: "etapaAtual",
                    include: [
                        {
                            model: Etapa,
                            as: "etapa",
                            include: [
                                {
                                    model: Fase,
                                    as: "fase"
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [
                [
                    {
                        model: ProcessoEtapa,
                        as: "etapas"
                    },
                    "ordem",
                    "ASC"
                ],
                [
                    {
                        model: Movimentacao,
                        as: "movimentacoes"
                    },
                    "dataMovimentacao",
                    "ASC"
                ]
            ]
        });
    }

    async listar() {
        return Processo.findAll({
            include: [
                {
                    model: TipoProcesso,
                    as: "tipoProcesso"
                },
                {
                    model: Fluxo,
                    as: "fluxo"
                },
                {
                    model: ProcessoEtapa,
                    as: "etapaAtual",
                    include: [
                        {
                            model: Etapa,
                            as: "etapa",
                            include: [
                                {
                                    model: Fase,
                                    as: "fase"
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [
                ["createdAt", "DESC"]
            ]
        });
    }

    async buscarEtapasDoFluxo(
        fluxoId: number,
        transaction: Transaction
    ) {
        return Etapa.findAll({
            include: [
                {
                    model: Fase,
                    as: "fase",
                    where: {
                        fluxoId
                    },
                    required: true
                }
            ],
            where: {
                ativo: true
            },
            order: [
                [
                    {
                        model: Fase,
                        as: "fase"
                    },
                    "ordem",
                    "ASC"
                ],
                ["ordem", "ASC"]
            ],
            transaction
        });
    }

    async criarEtapas(
        etapas: Array<{
            processoId: number;
            etapaId: number;
            ordem: number;

            status:
                | "PENDENTE"
                | "EM_ANDAMENTO"
                | "CONCLUIDA"
                | "BLOQUEADA"
                | "PULADA";

            dataInicio: Date | null;
            dataConclusao: Date | null;
            prazoPrevisto: Date | null;

            responsavelId: number | null;
            setorResponsavelId: number | null;

            observacao: string | null;
        }>,
        transaction: Transaction
    ) {
        return ProcessoEtapa.bulkCreate(
            etapas.map((etapa) => ({
                processoId: etapa.processoId,
                etapaId: etapa.etapaId,
                ordem: etapa.ordem,
                status: etapa.status,
                responsavelId: etapa.responsavelId,
                setorResponsavelId:
                    etapa.setorResponsavelId,
                dataInicio: etapa.dataInicio,
                dataConclusao:
                    etapa.dataConclusao,
                prazoPrevisto:
                    etapa.prazoPrevisto,
                observacao: etapa.observacao
            })),
            {
                transaction
            }
        );
    }

    async atualizar(
        processo: Processo,
        dados: Partial<{
            objeto: string;
            descricao: string | null;

            status:
                | "RASCUNHO"
                | "EM_ANDAMENTO"
                | "SUSPENSO"
                | "CONCLUIDO"
                | "ANULADO"
                | "REVOGADO";

            dataInicio: Date | null;
            dataConclusao: Date | null;
            etapaAtualId: number | null;
        }>,
        transaction: Transaction
    ) {
        return processo.update(
            dados,
            {
                transaction
            }
        );
    }

    async buscarEtapaPorOrdem(
        processoId: number,
        ordem: number
    ) {
        return ProcessoEtapa.findOne({
            where: {
                processoId,
                ordem
            }
        });
    }
}

export default new ProcessoRepository();