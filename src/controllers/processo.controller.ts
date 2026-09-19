import { Request, Response } from "express";

import processoService from "../services/processo.service.js";

class ProcessoController {
    async criar(req: Request, res: Response) {
        try {
            const {
                numero,
                objeto,
                descricao,
                tipoProcessoId,
                fluxoId,
                usuarioId,
                setorId
            } = req.body;

            if (!numero) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "O número do processo é obrigatório."
                });
            }

            if (!objeto) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "O objeto do processo é obrigatório."
                });
            }

            if (!tipoProcessoId) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem:
                        "O tipo de processo é obrigatório."
                });
            }

            if (!fluxoId) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem:
                        "O fluxo do processo é obrigatório."
                });
            }

            const processo =
                await processoService.criar({
                    numero,
                    objeto,
                    descricao:
                        descricao ?? null,
                    tipoProcessoId,
                    fluxoId,
                    usuarioId:
                        usuarioId ?? null,
                    setorId:
                        setorId ?? null
                });

            return res.status(201).json({
                sucesso: true,
                mensagem:
                    "Processo criado com sucesso.",
                dados: processo
            });
        } catch (erro) {
            console.error(erro);

            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Erro interno ao criar processo.";

            return res.status(400).json({
                sucesso: false,
                mensagem
            });
        }
    }

    async buscarPorId(
        req: Request,
        res: Response
    ) {
        try {
            const id =
                Number(req.params.id);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem:
                        "ID do processo inválido."
                });
            }

            const processo =
                await processoService.buscarPorId(
                    id
                );

            return res.status(200).json({
                sucesso: true,
                dados: processo
            });
        } catch (erro) {
            console.error(erro);

            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Erro interno ao buscar processo.";

            const status =
                mensagem ===
                "Processo não encontrado."
                    ? 404
                    : 400;

            return res.status(status).json({
                sucesso: false,
                mensagem
            });
        }
    }

    async listar(
        _req: Request,
        res: Response
    ) {
        try {
            const processos =
                await processoService.listar();

            return res.status(200).json({
                sucesso: true,
                dados: processos
            });
        } catch (erro) {
            console.error(erro);

            return res.status(500).json({
                sucesso: false,
                mensagem:
                    "Erro interno ao listar processos."
            });
        }
    }
}

export default new ProcessoController();