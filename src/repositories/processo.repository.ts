import {
    Processo,
    ProcessoEtapa,
    Movimentacao,
    TipoProcesso,
    Fluxo,
    Fase,
    Etapa,
    Usuario,
    Setor
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

    async buscarPorId(
        id: number,
        transaction?: Transaction
    ) {
        if (transaction) {
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
                ],
                transaction,
                lock: transaction.LOCK.UPDATE
            });
        }

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

    async buscarDadosSupervisao(
        processoId: number
    ) {
        return Processo.findByPk(
            processoId,
            {
                include: [
                    {
                        model: TipoProcesso,
                        as: "tipoProcesso",
                        attributes: [
                            "id",
                            "nome",
                            "descricao"
                        ]
                    },
                    {
                        model: Fluxo,
                        as: "fluxo",
                        attributes: [
                            "id",
                            "nome",
                            "versao",
                            "descricao",
                            "ativo"
                        ]
                    },
                    {
                        model: ProcessoEtapa,
                        as: "etapas",
                        attributes: [
                            "id",
                            "processoId",
                            "etapaId",
                            "status",
                            "ordem",
                            "responsavelId",
                            "setorResponsavelId",
                            "dataInicio",
                            "dataConclusao",
                            "prazoPrevisto",
                            "observacao"
                        ],
                        include: [
                            {
                                model: Etapa,
                                as: "etapa",
                                attributes: [
                                    "id",
                                    "nome",
                                    "ordem",
                                    "descricao",
                                    "prazoGestaoDias",
                                    "obrigatoria",
                                    "ativo"
                                ],
                                include: [
                                    {
                                        model: Fase,
                                        as: "fase",
                                        attributes: [
                                            "id",
                                            "nome",
                                            "ordem",
                                            "descricao",
                                            "ativo"
                                        ]
                                    }
                                ]
                            },
                            {
                                model: Usuario,
                                as: "responsavel",
                                attributes: [
                                    "id",
                                    "nome",
                                    "email",
                                    "perfil",
                                    "ativo"
                                ]
                            },
                            {
                                model: Setor,
                                as: "setorResponsavel",
                                attributes: [
                                    "id",
                                    "nome",
                                    "sigla",
                                    "ativo"
                                ]
                            }
                        ]
                    },
                    {
                        model: Movimentacao,
                        as: "movimentacoes",
                        attributes: [
                            "id",
                            "processoId",
                            "processoEtapaId",
                            "usuarioId",
                            "setorId",
                            "tipo",
                            "descricao",
                            "dataMovimentacao"
                        ],
                        include: [
                            {
                                model: Usuario,
                                as: "usuario",
                                attributes: [
                                    "id",
                                    "nome",
                                    "email",
                                    "perfil"
                                ]
                            },
                            {
                                model: Setor,
                                as: "setor",
                                attributes: [
                                    "id",
                                    "nome",
                                    "sigla"
                                ]
                            }
                        ]
                    },
                    {
                        model: ProcessoEtapa,
                        as: "etapaAtual",
                        attributes: [
                            "id",
                            "processoId",
                            "etapaId",
                            "status",
                            "ordem",
                            "responsavelId",
                            "setorResponsavelId",
                            "dataInicio",
                            "dataConclusao",
                            "prazoPrevisto",
                            "observacao"
                        ],
                        include: [
                            {
                                model: Etapa,
                                as: "etapa",
                                attributes: [
                                    "id",
                                    "nome",
                                    "ordem",
                                    "descricao",
                                    "prazoGestaoDias",
                                    "obrigatoria",
                                    "ativo"
                                ],
                                include: [
                                    {
                                        model: Fase,
                                        as: "fase",
                                        attributes: [
                                            "id",
                                            "nome",
                                            "ordem",
                                            "descricao",
                                            "ativo"
                                        ]
                                    }
                                ]
                            },
                            {
                                model: Usuario,
                                as: "responsavel",
                                attributes: [
                                    "id",
                                    "nome",
                                    "email",
                                    "perfil",
                                    "ativo"
                                ]
                            },
                            {
                                model: Setor,
                                as: "setorResponsavel",
                                attributes: [
                                    "id",
                                    "nome",
                                    "sigla",
                                    "ativo"
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
                        "DESC"
                    ]
                ]
            }
        );
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
                processoId:
                    etapa.processoId,

                etapaId:
                    etapa.etapaId,

                ordem:
                    etapa.ordem,

                status:
                    etapa.status,

                responsavelId:
                    etapa.responsavelId,

                setorResponsavelId:
                    etapa.setorResponsavelId,

                dataInicio:
                    etapa.dataInicio,

                dataConclusao:
                    etapa.dataConclusao,

                prazoPrevisto:
                    etapa.prazoPrevisto,

                observacao:
                    etapa.observacao
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
        ordem: number,
        transaction: Transaction
    ) {
        return ProcessoEtapa.findOne({
            where: {
                processoId,
                ordem
            },
            include: [
                {
                    model: Etapa,
                    as: "etapa"
                }
            ],
            transaction
        });
    }

    async buscarEtapaPorId(
        processoId: number,
        processoEtapaId: number,
        transaction: Transaction
    ) {
        return ProcessoEtapa.findOne({
            where: {
                id: processoEtapaId,
                processoId
            },
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
            ],
            transaction,
            lock: transaction.LOCK.UPDATE
        });
    }
}

export default new ProcessoRepository();