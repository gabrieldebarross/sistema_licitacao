import { database } from "../config/database.js";

import processoRepository from "../repositories/processo.repository.js";
import movimentacaoRepository from "../repositories/movimentacao.repository.js";

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
}

export default new WorkflowService();