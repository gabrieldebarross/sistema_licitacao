import { database } from "../config/database.js";

import processoRepository from "../repositories/processo.repository.js";
import movimentacaoRepository from "../repositories/movimentacao.repository.js";
import usuarioRepository from "../repositories/usuario.repository.js";
import setorRepository from "../repositories/setor.repository.js";

class WorkflowService {
    private async validarContextoMovimentacao(
        usuarioId?: number | null,
        setorId?: number | null
    ) {
        if (usuarioId != null) {
            const usuario =
                await usuarioRepository.buscarAtivoPorId(
                    usuarioId
                );

            if (!usuario) {
                throw new Error(
                    "Usuário da movimentação não encontrado ou está inativo."
                );
            }
        }

        if (setorId != null) {
            const setor =
                await setorRepository.buscarAtivoPorId(
                    setorId
                );

            if (!setor) {
                throw new Error(
                    "Setor da movimentação não encontrado ou está inativo."
                );
            }
        }
    }

    async avancarProcesso(
        processoId: number,
        usuarioId?: number | null,
        setorId?: number | null
    ) {
        const transaction =
            await database.transaction();

        let transacaoFinalizada = false;

        try {
            await this.validarContextoMovimentacao(
                usuarioId,
                setorId
            );

            const processo =
                await processoRepository.buscarPorId(
                    processoId,
                    transaction
                );

            if (!processo) {
                throw new Error(
                    "Processo não encontrado."
                );
            }

            if (
                processo.status === "CONCLUIDO" ||
                processo.status === "ANULADO" ||
                processo.status === "REVOGADO"
            ) {
                throw new Error(
                    "Não é possível avançar um processo encerrado."
                );
            }

            if (
                processo.status !== "EM_ANDAMENTO"
            ) {
                throw new Error(
                    "O processo precisa estar em andamento para avançar."
                );
            }

            const etapaAtual =
                processo.etapas?.find(
                    (etapa) =>
                        etapa.id ===
                        processo.etapaAtualId
                );

            if (!etapaAtual) {
                throw new Error(
                    "Etapa atual do processo não encontrada."
                );
            }

            if (
                etapaAtual.status !==
                "EM_ANDAMENTO"
            ) {
                throw new Error(
                    "A etapa atual não está em andamento."
                );
            }

            const proximaEtapa =
                await processoRepository.buscarEtapaPorOrdem(
                    processoId,
                    etapaAtual.ordem + 1,
                    transaction
                );

            const agora = new Date();

            etapaAtual.status =
                "CONCLUIDA";

            etapaAtual.dataConclusao =
                agora;

            await etapaAtual.save({
                transaction
            });

            await movimentacaoRepository.criar(
                {
                    processoId:
                        processo.id,

                    processoEtapaId:
                        etapaAtual.id,

                    usuarioId:
                        usuarioId ?? null,

                    setorId:
                        setorId ?? null,

                    tipo:
                        "CONCLUSAO_ETAPA",

                    descricao:
                        `Etapa "${etapaAtual.etapa?.nome}" concluída.`,

                    dataMovimentacao:
                        agora
                },
                transaction
            );

            if (!proximaEtapa) {
                await processoRepository.atualizar(
                    processo,
                    {
                        status:
                            "CONCLUIDO",

                        dataConclusao:
                            agora,

                        etapaAtualId:
                            null
                    },
                    transaction
                );

                await movimentacaoRepository.criar(
                    {
                        processoId:
                            processo.id,

                        processoEtapaId:
                            null,

                        usuarioId:
                            usuarioId ?? null,

                        setorId:
                            setorId ?? null,

                        tipo:
                            "ALTERACAO",

                        descricao:
                            "Processo concluído após a conclusão da última etapa.",

                        dataMovimentacao:
                            agora
                    },
                    transaction
                );

                await transaction.commit();
                transacaoFinalizada = true;

                const processoAtualizado =
                    await processoRepository.buscarPorId(
                        processo.id
                    );

                return {
                    processo:
                        processoAtualizado,

                    etapaConcluida:
                        etapaAtual,

                    etapaIniciada:
                        null
                };
            }

            proximaEtapa.status =
                "EM_ANDAMENTO";

            proximaEtapa.dataInicio =
                agora;

            const prazoGestaoDias =
                proximaEtapa.etapa
                    ?.prazoGestaoDias;

            if (
                prazoGestaoDias !== null &&
                prazoGestaoDias !== undefined
            ) {
                proximaEtapa.prazoPrevisto =
                    new Date(
                        agora.getTime() +
                        prazoGestaoDias *
                            24 *
                            60 *
                            60 *
                            1000
                    );
            } else {
                proximaEtapa.prazoPrevisto =
                    null;
            }

            await proximaEtapa.save({
                transaction
            });

            await processoRepository.atualizar(
                processo,
                {
                    etapaAtualId:
                        proximaEtapa.id
                },
                transaction
            );

            await movimentacaoRepository.criar(
                {
                    processoId:
                        processo.id,

                    processoEtapaId:
                        proximaEtapa.id,

                    usuarioId:
                        usuarioId ?? null,

                    setorId:
                        setorId ?? null,

                    tipo:
                        "INICIO_ETAPA",

                    descricao:
                        `Início da etapa "${proximaEtapa.etapa?.nome}".`,

                    dataMovimentacao:
                        agora
                },
                transaction
            );

            await transaction.commit();
            transacaoFinalizada = true;

            const processoAtualizado =
                await processoRepository.buscarPorId(
                    processo.id
                );

            return {
                processo:
                    processoAtualizado,

                etapaConcluida:
                    etapaAtual,

                etapaIniciada:
                    proximaEtapa
            };
        } catch (erro) {
            if (!transacaoFinalizada) {
                await transaction.rollback();
            }

            throw erro;
        }
    }

    async devolverProcesso(
        processoId: number,
        etapaDestinoId: number,
        motivo: string,
        usuarioId?: number | null,
        setorId?: number | null
    ) {
        const transaction =
            await database.transaction();

        let transacaoFinalizada = false;

        try {
            await this.validarContextoMovimentacao(
                usuarioId,
                setorId
            );

            const processo =
                await processoRepository.buscarPorId(
                    processoId,
                    transaction
                );

            if (!processo) {
                throw new Error(
                    "Processo não encontrado."
                );
            }

            if (
                processo.status === "CONCLUIDO" ||
                processo.status === "ANULADO" ||
                processo.status === "REVOGADO"
            ) {
                throw new Error(
                    "Não é possível devolver um processo encerrado."
                );
            }

            if (
                processo.status !== "EM_ANDAMENTO"
            ) {
                throw new Error(
                    "O processo precisa estar em andamento para ser devolvido."
                );
            }

            if (
                typeof motivo !== "string" ||
                motivo.trim().length === 0
            ) {
                throw new Error(
                    "O motivo da devolução é obrigatório."
                );
            }

            const etapaAtual =
                processo.etapas?.find(
                    (etapa) =>
                        etapa.id ===
                        processo.etapaAtualId
                );

            if (!etapaAtual) {
                throw new Error(
                    "Etapa atual do processo não encontrada."
                );
            }

            if (
                etapaAtual.status !==
                "EM_ANDAMENTO"
            ) {
                throw new Error(
                    "A etapa atual não está em andamento."
                );
            }

            const etapaDestino =
                await processoRepository.buscarEtapaPorId(
                    processoId,
                    etapaDestinoId,
                    transaction
                );

            if (!etapaDestino) {
                throw new Error(
                    "Etapa de destino não encontrada."
                );
            }

            if (
                etapaDestino.id ===
                etapaAtual.id
            ) {
                throw new Error(
                    "A etapa de destino deve ser diferente da etapa atual."
                );
            }

            if (
                etapaDestino.ordem >=
                etapaAtual.ordem
            ) {
                throw new Error(
                    "A etapa de destino deve ser anterior à etapa atual."
                );
            }

            if (
                etapaDestino.status !==
                "CONCLUIDA"
            ) {
                throw new Error(
                    "A etapa de destino precisa estar concluída."
                );
            }

            const agora = new Date();

            etapaAtual.status =
                "PENDENTE";

            etapaAtual.dataInicio =
                null;

            etapaAtual.dataConclusao =
                null;

            etapaAtual.prazoPrevisto =
                null;

            await etapaAtual.save({
                transaction
            });

            etapaDestino.status =
                "EM_ANDAMENTO";

            etapaDestino.dataInicio =
                agora;

            etapaDestino.dataConclusao =
                null;

            const prazoGestaoDias =
                etapaDestino.etapa
                    ?.prazoGestaoDias;

            if (
                prazoGestaoDias !== null &&
                prazoGestaoDias !== undefined
            ) {
                etapaDestino.prazoPrevisto =
                    new Date(
                        agora.getTime() +
                        prazoGestaoDias *
                            24 *
                            60 *
                            60 *
                            1000
                    );
            } else {
                etapaDestino.prazoPrevisto =
                    null;
            }

            await etapaDestino.save({
                transaction
            });

            await processoRepository.atualizar(
                processo,
                {
                    etapaAtualId:
                        etapaDestino.id
                },
                transaction
            );

            await movimentacaoRepository.criar(
                {
                    processoId:
                        processo.id,

                    processoEtapaId:
                        etapaAtual.id,

                    usuarioId:
                        usuarioId ?? null,

                    setorId:
                        setorId ?? null,

                    tipo:
                        "DEVOLUCAO",

                    descricao:
                        `Processo devolvido da etapa "${etapaAtual.etapa?.nome}" para a etapa "${etapaDestino.etapa?.nome}". Motivo: ${motivo.trim()}`,

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
                        etapaDestino.id,

                    usuarioId:
                        usuarioId ?? null,

                    setorId:
                        setorId ?? null,

                    tipo:
                        "INICIO_ETAPA",

                    descricao:
                        `Início da etapa "${etapaDestino.etapa?.nome}" após devolução.`,

                    dataMovimentacao:
                        agora
                },
                transaction
            );

            await transaction.commit();
            transacaoFinalizada = true;

            const processoAtualizado =
                await processoRepository.buscarPorId(
                    processo.id
                );

            return {
                processo:
                    processoAtualizado,

                etapaDevolvida:
                    etapaAtual,

                etapaIniciada:
                    etapaDestino
            };
        } catch (erro) {
            if (!transacaoFinalizada) {
                await transaction.rollback();
            }

            throw erro;
        }
    }

    async atribuirEtapa(
        processoId: number,
        processoEtapaId: number,
        responsavelId?: number | null,
        setorResponsavelId?: number | null,
        usuarioId?: number | null,
        setorId?: number | null
    ) {
        const transaction =
            await database.transaction();

        let transacaoFinalizada = false;

        try {
            await this.validarContextoMovimentacao(
                usuarioId,
                setorId
            );

            const processo =
                await processoRepository.buscarPorId(
                    processoId,
                    transaction
                );

            if (!processo) {
                throw new Error(
                    "Processo não encontrado."
                );
            }

            if (
                processo.status === "CONCLUIDO" ||
                processo.status === "ANULADO" ||
                processo.status === "REVOGADO"
            ) {
                throw new Error(
                    "Não é possível atribuir uma etapa de um processo encerrado."
                );
            }

            if (
                processo.status !== "EM_ANDAMENTO"
            ) {
                throw new Error(
                    "O processo precisa estar em andamento para atribuir uma etapa."
                );
            }

            if (
                responsavelId == null &&
                setorResponsavelId == null
            ) {
                throw new Error(
                    "Informe um responsável ou um setor responsável."
                );
            }

            let responsavelNome:
                string | null = null;

            if (responsavelId != null) {
                const responsavel =
                    await usuarioRepository.buscarAtivoPorId(
                        responsavelId
                    );

                if (!responsavel) {
                    throw new Error(
                        "Responsável não encontrado ou está inativo."
                    );
                }

                responsavelNome =
                    responsavel.nome;
            }

            let setorResponsavelNome:
                string | null = null;

            if (setorResponsavelId != null) {
                const setor =
                    await setorRepository.buscarAtivoPorId(
                        setorResponsavelId
                    );

                if (!setor) {
                    throw new Error(
                        "Setor responsável não encontrado ou está inativo."
                    );
                }

                setorResponsavelNome =
                    setor.nome;
            }

            const etapa =
                await processoRepository.buscarEtapaPorId(
                    processoId,
                    processoEtapaId,
                    transaction
                );

            if (!etapa) {
                throw new Error(
                    "Etapa do processo não encontrada."
                );
            }

            if (
                etapa.id !==
                processo.etapaAtualId
            ) {
                throw new Error(
                    "Somente a etapa atual do processo pode ser atribuída."
                );
            }

            if (
                etapa.status !==
                "EM_ANDAMENTO"
            ) {
                throw new Error(
                    "A etapa precisa estar em andamento para ser atribuída."
                );
            }

            const agora = new Date();

            etapa.responsavelId =
                responsavelId ?? null;

            etapa.setorResponsavelId =
                setorResponsavelId ?? null;

            await etapa.save({
                transaction
            });

            let descricao =
                `Etapa "${etapa.etapa?.nome}" encaminhada.`;

            if (
                responsavelNome != null &&
                setorResponsavelNome != null
            ) {
                descricao +=
                    ` Responsável: ${responsavelNome}. Setor responsável: ${setorResponsavelNome}.`;
            } else if (
                responsavelNome != null
            ) {
                descricao +=
                    ` Responsável: ${responsavelNome}.`;
            } else if (
                setorResponsavelNome != null
            ) {
                descricao +=
                    ` Setor responsável: ${setorResponsavelNome}.`;
            }

            await movimentacaoRepository.criar(
                {
                    processoId:
                        processo.id,

                    processoEtapaId:
                        etapa.id,

                    usuarioId:
                        usuarioId ?? null,

                    setorId:
                        setorId ?? null,

                    tipo:
                        "ENCAMINHAMENTO",

                    descricao,

                    dataMovimentacao:
                        agora
                },
                transaction
            );

            await transaction.commit();
            transacaoFinalizada = true;

            const processoAtualizado =
                await processoRepository.buscarPorId(
                    processo.id
                );

            return {
                processo:
                    processoAtualizado,

                etapa
            };
        } catch (erro) {
            if (!transacaoFinalizada) {
                await transaction.rollback();
            }

            throw erro;
        }
    }
}

export default new WorkflowService();