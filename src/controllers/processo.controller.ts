import { Request, Response } from "express";

import processoService from "../services/processo.service.js";
import { RequestAutenticado } from "../types/auth.types.js";

class ProcessoController {
    async criar(
        req: Request,
        res: Response
    ) {
        try {
            const request =
                req as RequestAutenticado;

            const usuarioId =
                request.usuario?.id ?? null;

            const {
                numero,
                objeto,
                descricao,
                tipoProcessoId,
                fluxoId,
                setorId
            } = req.body;

            const processo =
                await processoService.criar(
                    {
                        numero,
                        objeto,
                        descricao: descricao ?? null,
                        tipoProcessoId,
                        fluxoId,
                        usuarioId,
                        setorId: setorId ?? null
                    }
                );

            return res.status(201).json({
                sucesso: true,
                dados: processo
            });
        } catch (erro) {
            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Erro ao criar processo.";

            return res.status(400).json({
                sucesso: false,
                mensagem
            });
        }
    }

    async buscarSupervisao(
        req: Request,
        res: Response
    ) {
        try {
            const processoId =
                Number(req.params.id);

            if (!Number.isInteger(processoId)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem:
                        "ID do processo inválido."
                });
            }

            const dados =
                await processoService.buscarSupervisao(
                    processoId
                );

            return res.status(200).json({
                sucesso: true,
                dados
            });
        } catch (erro) {
            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Erro ao buscar supervisão do processo.";

            const status =
                mensagem === "Processo não encontrado."
                    ? 404
                    : 400;

            return res.status(status).json({
                sucesso: false,
                mensagem
            });
        }
    }
}

export default new ProcessoController();