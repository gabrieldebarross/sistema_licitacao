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
}

export default new WorkflowController();