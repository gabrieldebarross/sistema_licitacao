import {
    Request,
    Response
} from "express";

import workflowService from "../services/workflow.service.js";

class WorkflowController {
    async avancar(
        req: Request,
        res: Response
    ) {
        try {
            /*
             * ID do processo
             */

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

            /*
             * Usuário e setor são opcionais
             * neste momento.
             */

            const usuarioId =
                req.body?.usuarioId ??
                null;

            const setorId =
                req.body?.setorId ??
                null;

            /*
             * Executar workflow
             */

            const resultado =
                await workflowService.avancarProcesso(
                    processoId,
                    usuarioId,
                    setorId
                );

            return res.status(200).json({
                sucesso: true,

                mensagem:
                    "Processo avançado com sucesso.",

                dados:
                    resultado
            });
        } catch (erro) {
            console.error(
                "Erro ao avançar processo:",
                erro
            );

            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Erro interno ao avançar processo.";

            return res.status(400).json({
                sucesso: false,
                mensagem
            });
        }
    }

    async devolver(
        req: Request,
        res: Response
    ) {
        try {
            /*
             * 1. ID do processo
             */

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

            /*
             * 2. Dados da devolução
             */

            const etapaDestinoId =
                Number(req.body?.etapaDestinoId);

            const motivo =
                req.body?.motivo;

            const usuarioId =
                req.body?.usuarioId ??
                null;

            const setorId =
                req.body?.setorId ??
                null;

            /*
             * 3. Validar etapa de destino
             */

            if (
                !Number.isInteger(etapaDestinoId) ||
                etapaDestinoId <= 0
            ) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem:
                        "ID da etapa de destino inválido."
                });
            }

            /*
             * 4. Validar motivo
             */

            if (
                typeof motivo !== "string" ||
                motivo.trim().length === 0
            ) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem:
                        "O motivo da devolução é obrigatório."
                });
            }

            /*
             * 5. Executar devolução
             */

            const resultado =
                await workflowService.devolverProcesso(
                    processoId,
                    etapaDestinoId,
                    motivo,
                    usuarioId,
                    setorId
                );

            /*
             * 6. Retornar resultado
             */

            return res.status(200).json({
                sucesso: true,

                mensagem:
                    "Processo devolvido com sucesso.",

                dados:
                    resultado
            });
        } catch (erro) {
            console.error(
                "Erro ao devolver processo:",
                erro
            );

            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Erro interno ao devolver processo.";

            return res.status(400).json({
                sucesso: false,
                mensagem
            });
        }
    }

    async atribuir(
        req: Request,
        res: Response
    ) {
        try {
            /*
             * 1. ID do processo
             */

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

            /*
             * 2. ID da etapa
             *
             * É o ID da instância em
             * processo_etapas.
             */

            const processoEtapaId =
                Number(
                    req.params.processoEtapaId
                );

            if (
                !Number.isInteger(
                    processoEtapaId
                ) ||
                processoEtapaId <= 0
            ) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem:
                        "ID da etapa do processo inválido."
                });
            }

            /*
             * 3. Dados da atribuição
             */

            const responsavelId =
                req.body?.responsavelId ??
                null;

            const setorResponsavelId =
                req.body?.setorResponsavelId ??
                null;

            /*
             * Usuário e setor que estão
             * realizando o encaminhamento.
             */

            const usuarioId =
                req.body?.usuarioId ??
                null;

            const setorId =
                req.body?.setorId ??
                null;

            /*
             * 4. Validar responsáveis
             *
             * Pelo menos um deve ser informado.
             */

            if (
                responsavelId == null &&
                setorResponsavelId == null
            ) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem:
                        "Informe um responsável ou um setor responsável."
                });
            }

            /*
             * 5. Executar atribuição
             */

            const resultado =
                await workflowService.atribuirEtapa(
                    processoId,
                    processoEtapaId,
                    responsavelId,
                    setorResponsavelId,
                    usuarioId,
                    setorId
                );

            /*
             * 6. Retornar resultado
             */

            return res.status(200).json({
                sucesso: true,

                mensagem:
                    "Etapa atribuída com sucesso.",

                dados:
                    resultado
            });
        } catch (erro) {
            console.error(
                "Erro ao atribuir etapa:",
                erro
            );

            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Erro interno ao atribuir etapa.";

            return res.status(400).json({
                sucesso: false,
                mensagem
            });
        }
    }
}

export default new WorkflowController();