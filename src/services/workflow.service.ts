import { database } from "../config/database.js";

import processoRepository from "../repositories/processo.repository.js";
import movimentacaoRepository from "../repositories/movimentacao.repository.js";
import usuarioRepository from "../repositories/usuario.repository.js";
import setorRepository from "../repositories/setor.repository.js";

class WorkflowService {
    async avancarProcesso(
        processoId: number,
        usuarioId?: number | null,
        setorId?: number | null
    ) {
        const transaction =
            await database.transaction();

        try {
            /*
             * 1. Buscar processo dentro da
             *    transação com lock
             */

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

            /*
             * 2. Verificar status do processo
             */

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

            /*
             * 3. Encontrar etapa atual
             */

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

            /*
             * 4. Verificar status da etapa
             */

            if (
                etapaAtual.status !==
                "EM_ANDAMENTO"
            ) {
                throw new Error(
                    "A etapa atual não está em andamento."
                );
            }

            /*
             * 5. Buscar próxima etapa
             */

            const proximaEtapa =
                await processoRepository.buscarEtapaPorOrdem(
                    processoId,
                    etapaAtual.ordem + 1,
                    transaction
                );

            const agora = new Date();

            /*
             * 6. Concluir etapa atual
             */

            etapaAtual.status =
                "CONCLUIDA";

            etapaAtual.dataConclusao =
                agora;

            await etapaAtual.save({
                transaction
            });

            /*
             * 7. Registrar movimentação
             */

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

            /*
             * 8. Se não existe próxima etapa,
             *    processo foi concluído.
             */

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

                /*
                 * Recarregar o processo após o commit
                 * para retornar os dados atualizados.
                 */

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

            /*
             * 9. Iniciar próxima etapa
             */

            proximaEtapa.status =
                "EM_ANDAMENTO";

            proximaEtapa.dataInicio =
                agora;

            /*
             * 10. Calcular prazo de gestão
             */

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
            }

            await proximaEtapa.save({
                transaction
            });

            /*
             * 11. Atualizar etapa atual
             *     do processo
             */

            await processoRepository.atualizar(
                processo,
                {
                    etapaAtualId:
                        proximaEtapa.id
                },

                transaction
            );

            /*
             * 12. Registrar início da
             *     nova etapa
             */

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

            /*
             * 13. Confirmar transação
             */

            await transaction.commit();

            /*
             * Recarregar o processo após o commit
             * para retornar os dados atualizados.
             */

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
            /*
             * Se qualquer operação falhar,
             * desfaz tudo.
             */

            await transaction.rollback();

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

        try {
            /*
             * 1. Buscar processo dentro da
             *    transação com lock
             */

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

            /*
             * 2. Verificar status do processo
             */

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

            /*
             * 3. Validar motivo
             */

            if (
                typeof motivo !== "string" ||
                motivo.trim().length === 0
            ) {
                throw new Error(
                    "O motivo da devolução é obrigatório."
                );
            }

            /*
             * 4. Encontrar etapa atual
             */

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

            /*
             * 5. Verificar status da etapa atual
             */

            if (
                etapaAtual.status !==
                "EM_ANDAMENTO"
            ) {
                throw new Error(
                    "A etapa atual não está em andamento."
                );
            }

            /*
             * 6. Buscar etapa de destino
             *
             * etapaDestinoId é o ID da instância
             * em processo_etapas.
             */

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

            /*
             * 7. Verificar se a etapa escolhida
             *    realmente é anterior à atual.
             */

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

            /*
             * 8. Na primeira versão, somente
             *    etapas concluídas podem receber
             *    uma devolução.
             */

            if (
                etapaDestino.status !==
                "CONCLUIDA"
            ) {
                throw new Error(
                    "A etapa de destino precisa estar concluída."
                );
            }

            const agora = new Date();

            /*
             * 9. Devolver a etapa atual para
             *    PENDENTE
             */

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

            /*
             * 10. Iniciar novamente a etapa
             *     de destino
             */

            etapaDestino.status =
                "EM_ANDAMENTO";

            etapaDestino.dataInicio =
                agora;

            etapaDestino.dataConclusao =
                null;

            /*
             * 11. Recalcular prazo da etapa
             *     de destino
             */

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

            /*
             * 12. Atualizar etapa atual
             *     do processo
             */

            await processoRepository.atualizar(
                processo,
                {
                    etapaAtualId:
                        etapaDestino.id
                },
                transaction
            );

            /*
             * 13. Registrar a devolução
             */

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

            /*
             * 14. Registrar novo início da
             *     etapa de destino
             */

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

            /*
             * 15. Confirmar transação
             */

            await transaction.commit();

            /*
             * Recarregar o processo após o commit
             * para retornar os dados atualizados.
             */

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
            /*
             * Se qualquer operação falhar,
             * desfaz tudo.
             */

            await transaction.rollback();

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

        try {
            /*
             * 1. Buscar processo dentro da
             *    transação com lock
             */

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

            /*
             * 2. Verificar status do processo
             */

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

            /*
             * 3. Validar responsáveis
             *
             * Pelo menos um responsável deve
             * ser informado.
             */

            if (
                responsavelId == null &&
                setorResponsavelId == null
            ) {
                throw new Error(
                    "Informe um responsável ou um setor responsável."
                );
            }

            /*
             * 4. Validar usuário responsável
             */

            let responsavelNome: string | null =
                null;

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

            /*
             * 5. Validar setor responsável
             */

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

            /*
             * 6. Buscar etapa dentro do processo
             */

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

            /*
             * 7. A atribuição nesta primeira
             *    versão será feita somente para
             *    a etapa atualmente em andamento.
             */

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

            /*
             * 8. Guardar os responsáveis
             */

            etapa.responsavelId =
                responsavelId ?? null;

            etapa.setorResponsavelId =
                setorResponsavelId ?? null;

            await etapa.save({
                transaction
            });

            /*
             * 9. Montar descrição da movimentação
             */

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

            /*
             * 10. Registrar movimentação
             */

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

            /*
             * 11. Confirmar transação
             */

            await transaction.commit();

            /*
             * Recarregar o processo após o commit
             */

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
            /*
             * Se qualquer operação falhar,
             * desfaz tudo.
             */

            await transaction.rollback();

            throw erro;
        }
    }
}

export default new WorkflowService();