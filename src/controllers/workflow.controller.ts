import {
    Request,
    Response
} from "express";

import workflowService from "../services/workflow.service.js";
import { RequestAutenticado } from "../types/auth.types.js";

class WorkflowController {
    async avancar(
        req: Request,
        res: Response
    ) {
        try {
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

            const request =
                req as RequestAutenticado;

            const usuarioId =
                request.usuario?.id ??
                null;

            const setorId =
                request.usuario?.setorId ??
                null;

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
                dados: resultado
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

            const etapaDestinoId =
                Number(
                    req.body?.etapaDestinoId
                );

            const motivo =
                req.body?.motivo;

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

            const request =
                req as RequestAutenticado;

            const usuarioId =
                request.usuario?.id ??
                null;

            const setorId =
                request.usuario?.setorId ??
                null;

            const resultado =
                await workflowService.devolverProcesso(
                    processoId,
                    etapaDestinoId,
                    motivo.trim(),
                    usuarioId,
                    setorId
                );

            return res.status(200).json({
                sucesso: true,
                mensagem:
                    "Processo devolvido com sucesso.",
                dados: resultado
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

            const responsavelId =
                req.body?.responsavelId ??
                null;

            const setorResponsavelId =
                req.body?.setorResponsavelId ??
                null;

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

            const request =
                req as RequestAutenticado;

            const usuarioId =
                request.usuario?.id ??
                null;

            const setorId =
                request.usuario?.setorId ??
                null;

            const resultado =
                await workflowService.atribuirEtapa(
                    processoId,
                    processoEtapaId,
                    responsavelId,
                    setorResponsavelId,
                    usuarioId,
                    setorId
                );

            return res.status(200).json({
                sucesso: true,
                mensagem:
                    "Etapa atribuída com sucesso.",
                dados: resultado
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