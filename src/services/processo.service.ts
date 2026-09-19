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
}

export default new ProcessoService();