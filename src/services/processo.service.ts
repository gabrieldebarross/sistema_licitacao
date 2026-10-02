import { database } from "../config/database.js";

import processoRepository from "../repositories/processo.repository.js";
import movimentacaoRepository from "../repositories/movimentacao.repository.js";

import {
    Fluxo,
    TipoProcesso
} from "../models/index.js";

class ProcessoService {
    async criar(dados: {
        numero: string;
        objeto: string;
        descricao?: string | null;
        tipoProcessoId: number;
        fluxoId: number;
        usuarioId?: number | null;
        setorId?: number | null;
    }) {
        const transaction =
            await database.transaction();

        try {
            const tipoProcesso =
                await TipoProcesso.findByPk(
                    dados.tipoProcessoId,
                    {
                        transaction
                    }
                );

            if (!tipoProcesso) {
                throw new Error(
                    "Tipo de processo não encontrado."
                );
            }

            const fluxo =
                await Fluxo.findByPk(
                    dados.fluxoId,
                    {
                        transaction
                    }
                );

            if (!fluxo) {
                throw new Error(
                    "Fluxo não encontrado."
                );
            }

            if (
                fluxo.tipoProcessoId !==
                dados.tipoProcessoId
            ) {
                throw new Error(
                    "O fluxo informado não pertence ao tipo de processo informado."
                );
            }

            const etapas =
                await processoRepository.buscarEtapasDoFluxo(
                    dados.fluxoId,
                    transaction
                );

            if (etapas.length === 0) {
                throw new Error(
                    "O fluxo informado não possui etapas cadastradas."
                );
            }

            const processo =
                await processoRepository.criar(
                    {
                        numero:
                            dados.numero,
                        objeto:
                            dados.objeto,
                        descricao:
                            dados.descricao ??
                            null,
                        tipoProcessoId:
                            dados.tipoProcessoId,
                        fluxoId:
                            dados.fluxoId
                    },
                    transaction
                );

            const agora =
                new Date();

            const etapasParaCriar =
                etapas.map(
                    (etapa, index) => {
                        const primeiraEtapa =
                            index === 0;

                        let prazoPrevisto:
                            Date | null =
                            null;

                        if (
                            primeiraEtapa &&
                            etapa.prazoGestaoDias !==
                                null
                        ) {
                            prazoPrevisto =
                                new Date(
                                    agora.getTime() +
                                        etapa.prazoGestaoDias *
                                            24 *
                                            60 *
                                            60 *
                                            1000
                                );
                        }

                        return {
                            processoId:
                                processo.id,

                            etapaId:
                                etapa.id,

                            ordem:
                                index + 1,

                            status:
                                primeiraEtapa
                                    ? "EM_ANDAMENTO" as const
                                    : "PENDENTE" as const,

                            dataInicio:
                                primeiraEtapa
                                    ? agora
                                    : null,

                            dataConclusao:
                                null,

                            prazoPrevisto,

                            responsavelId:
                                null,

                            setorResponsavelId:
                                null,

                            observacao:
                                null
                        };
                    }
                );

            const processoEtapas =
                await processoRepository.criarEtapas(
                    etapasParaCriar,
                    transaction
                );

            const primeiraEtapa =
                processoEtapas[0];

            if (!primeiraEtapa) {
                throw new Error(
                    "Não foi possível criar a primeira etapa do processo."
                );
            }

            await processoRepository.atualizar(
                processo,
                {
                    status:
                        "EM_ANDAMENTO",

                    dataInicio:
                        agora,

                    etapaAtualId:
                        primeiraEtapa.id
                },
                transaction
            );

            await movimentacaoRepository.criar(
                {
                    processoId:
                        processo.id,

                    processoEtapaId:
                        primeiraEtapa.id,

                    usuarioId:
                        dados.usuarioId ??
                        null,

                    setorId:
                        dados.setorId ??
                        null,

                    tipo:
                        "CRIACAO",

                    descricao:
                        "Processo criado no sistema.",

                    dataMovimentacao:
                        agora
                },
                transaction
            );

            await movimentacaoRepository.criar(
                {
                    processoId:
                        processo.id,

                    processoEtapaId:
                        primeiraEtapa.id,

                    usuarioId:
                        dados.usuarioId ??
                        null,

                    setorId:
                        dados.setorId ??
                        null,

                    tipo:
                        "INICIO_ETAPA",

                    descricao:
                        `Início da etapa "${etapas[0]?.nome}".`,

                    dataMovimentacao:
                        agora
                },
                transaction
            );

            await transaction.commit();

            return processo;
        } catch (erro) {
            await transaction.rollback();

            throw erro;
        }
    }

    async buscarPorId(id: number) {
        const processo =
            await processoRepository.buscarPorId(
                id
            );

        if (!processo) {
            throw new Error(
                "Processo não encontrado."
            );
        }

        return processo;
    }

    async listar() {
        return processoRepository.listar();
    }

    async buscarSupervisao(processoId: number) {
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
         * 2. Buscar dados necessários
         */

        const processo =
            await processoRepository.buscarDadosSupervisao(
                processoId
            );

        if (!processo) {
            throw new Error(
                "Processo não encontrado."
            );
        }

        /*
         * 3. Recuperar etapa atual
         */

        const etapaAtual =
            processo.etapaAtual;

        /*
         * 4. Recuperar última movimentação
         */

        const movimentacoes =
            processo.movimentacoes ?? [];

        const ultimaMovimentacao =
            movimentacoes[0] ?? null;

        /*
         * 5. Calcular informações da etapa atual
         */

        let diasNaEtapa = 0;
        let diasRestantes: number | null = null;
        let diasAtraso = 0;

        let situacaoPrazo:
            | "SEM_PRAZO"
            | "NO_PRAZO"
            | "VENCE_HOJE"
            | "ATRASADO" =
            "SEM_PRAZO";

        if (
            etapaAtual &&
            etapaAtual.dataInicio
        ) {
            const agora =
                new Date();

            const inicio =
                new Date(
                    etapaAtual.dataInicio
                );

            const diferencaMs =
                agora.getTime() -
                inicio.getTime();

            diasNaEtapa =
                Math.max(
                    0,
                    Math.floor(
                        diferencaMs /
                            (1000 *
                                60 *
                                60 *
                                24)
                    )
                );

            if (
                etapaAtual.prazoPrevisto
            ) {
                const prazo =
                    new Date(
                        etapaAtual.prazoPrevisto
                    );

                const diferencaPrazoMs =
                    prazo.getTime() -
                    agora.getTime();

                const diferencaDias =
                    Math.ceil(
                        diferencaPrazoMs /
                            (1000 *
                                60 *
                                60 *
                                24)
                    );

                if (
                    diferencaPrazoMs < 0
                ) {
                    diasAtraso =
                        Math.max(
                            1,
                            Math.ceil(
                                Math.abs(
                                    diferencaPrazoMs
                                ) /
                                    (1000 *
                                        60 *
                                        60 *
                                        24)
                            )
                        );

                    situacaoPrazo =
                        "ATRASADO";
                } else if (
                    diferencaDias === 0
                ) {
                    situacaoPrazo =
                        "VENCE_HOJE";

                    diasRestantes = 0;
                } else {
                    diasRestantes =
                        diferencaDias;

                    situacaoPrazo =
                        "NO_PRAZO";
                }
            }
        }

        /*
         * 6. Calcular progresso
         */

        const etapas =
            processo.etapas ?? [];

        const totalEtapas =
            etapas.length;

        const etapasConcluidas =
            etapas.filter(
                (etapa) =>
                    etapa.status ===
                    "CONCLUIDA"
            ).length;

        const percentualProgresso =
            totalEtapas > 0
                ? Math.round(
                      (etapasConcluidas /
                          totalEtapas) *
                          100
                  )
                : 0;

        /*
         * 7. Montar etapas para supervisão
         */

        const etapasSupervisao =
            etapas.map(
                (etapa) => ({
                    id: etapa.id,

                    ordem: etapa.ordem,

                    status: etapa.status,

                    dataInicio:
                        etapa.dataInicio,

                    dataConclusao:
                        etapa.dataConclusao,

                    prazoPrevisto:
                        etapa.prazoPrevisto,

                    observacao:
                        etapa.observacao,

                    etapa: etapa.etapa
                        ? {
                              id:
                                  etapa.etapa
                                      .id,

                              nome:
                                  etapa.etapa
                                      .nome,

                              ordem:
                                  etapa.etapa
                                      .ordem,

                              descricao:
                                  etapa.etapa
                                      .descricao,

                              prazoGestaoDias:
                                  etapa.etapa
                                      .prazoGestaoDias,

                              obrigatoria:
                                  etapa.etapa
                                      .obrigatoria
                          }
                        : null,

                    fase:
                        etapa.etapa?.fase
                            ? {
                                  id:
                                      etapa.etapa
                                          .fase
                                          .id,

                                  nome:
                                      etapa.etapa
                                          .fase
                                          .nome,

                                  ordem:
                                      etapa.etapa
                                          .fase
                                          .ordem
                              }
                            : null,

                    responsavel:
                        etapa.responsavel
                            ? {
                                  id:
                                      etapa.responsavel
                                          .id,

                                  nome:
                                      etapa.responsavel
                                          .nome,

                                  email:
                                      etapa.responsavel
                                          .email,

                                  perfil:
                                      etapa.responsavel
                                          .perfil
                              }
                            : null,

                    setorResponsavel:
                        etapa.setorResponsavel
                            ? {
                                  id:
                                      etapa
                                          .setorResponsavel
                                          .id,

                                  nome:
                                      etapa
                                          .setorResponsavel
                                          .nome,

                                  sigla:
                                      etapa
                                          .setorResponsavel
                                          .sigla
                              }
                            : null,

                    atual:
                        etapaAtual
                            ? etapa.id ===
                              etapaAtual.id
                            : false
                })
            );

        /*
         * 8. Retornar visão de supervisão
         */

        return {
            processo: {
                id: processo.id,
                numero: processo.numero,
                objeto: processo.objeto,
                descricao: processo.descricao,
                status: processo.status,
                dataInicio:
                    processo.dataInicio,
                dataConclusao:
                    processo.dataConclusao
            },

            tipoProcesso:
                processo.tipoProcesso
                    ? {
                          id:
                              processo
                                  .tipoProcesso
                                  .id,

                          nome:
                              processo
                                  .tipoProcesso
                                  .nome,

                          descricao:
                              processo
                                  .tipoProcesso
                                  .descricao
                      }
                    : null,

            fluxo:
                processo.fluxo
                    ? {
                          id:
                              processo.fluxo
                                  .id,

                          nome:
                              processo.fluxo
                                  .nome,

                          versao:
                              processo.fluxo
                                  .versao,

                          descricao:
                              processo.fluxo
                                  .descricao
                      }
                    : null,

            etapaAtual:
                etapaAtual
                    ? {
                          id:
                              etapaAtual.id,

                          ordem:
                              etapaAtual.ordem,

                          status:
                              etapaAtual.status,

                          inicio:
                              etapaAtual.dataInicio,

                          prazoPrevisto:
                              etapaAtual.prazoPrevisto,

                          diasNaEtapa,

                          diasRestantes,

                          diasAtraso,

                          situacaoPrazo,

                          etapa:
                              etapaAtual.etapa
                                  ? {
                                        id:
                                            etapaAtual
                                                .etapa
                                                .id,

                                        nome:
                                            etapaAtual
                                                .etapa
                                                .nome,

                                        descricao:
                                            etapaAtual
                                                .etapa
                                                .descricao,

                                        prazoGestaoDias:
                                            etapaAtual
                                                .etapa
                                                .prazoGestaoDias
                                    }
                                  : null,

                          fase:
                              etapaAtual.etapa
                                  ?.fase
                                  ? {
                                        id:
                                            etapaAtual
                                                .etapa
                                                .fase
                                                .id,

                                        nome:
                                            etapaAtual
                                                .etapa
                                                .fase
                                                .nome,

                                        ordem:
                                            etapaAtual
                                                .etapa
                                                .fase
                                                .ordem
                                    }
                                  : null,

                          responsavel:
                              etapaAtual.responsavel
                                  ? {
                                        id:
                                            etapaAtual
                                                .responsavel
                                                .id,

                                        nome:
                                            etapaAtual
                                                .responsavel
                                                .nome,

                                        email:
                                            etapaAtual
                                                .responsavel
                                                .email,

                                        perfil:
                                            etapaAtual
                                                .responsavel
                                                .perfil
                                    }
                                  : null,

                          setorResponsavel:
                              etapaAtual.setorResponsavel
                                  ? {
                                        id:
                                            etapaAtual
                                                .setorResponsavel
                                                .id,

                                        nome:
                                            etapaAtual
                                                .setorResponsavel
                                                .nome,

                                        sigla:
                                            etapaAtual
                                                .setorResponsavel
                                                .sigla
                                    }
                                  : null
                      }
                    : null,

            progresso: {
                totalEtapas,
                etapasConcluidas,
                percentual:
                    percentualProgresso
            },

            etapas:
                etapasSupervisao,

            ultimaMovimentacao:
                ultimaMovimentacao
                    ? {
                          id:
                              ultimaMovimentacao.id,

                          tipo:
                              ultimaMovimentacao.tipo,

                          descricao:
                              ultimaMovimentacao.descricao,

                          data:
                              ultimaMovimentacao.dataMovimentacao,

                          usuario:
                              ultimaMovimentacao.usuario
                                  ? {
                                        id:
                                            ultimaMovimentacao
                                                .usuario
                                                .id,

                                        nome:
                                            ultimaMovimentacao
                                                .usuario
                                                .nome
                                    }
                                  : null,

                          setor:
                              ultimaMovimentacao.setor
                                  ? {
                                        id:
                                            ultimaMovimentacao
                                                .setor
                                                .id,

                                        nome:
                                            ultimaMovimentacao
                                                .setor
                                                .nome,

                                        sigla:
                                            ultimaMovimentacao
                                                .setor
                                                .sigla
                                    }
                                  : null
                      }
                    : null
        };
    }
}

export default new ProcessoService();
