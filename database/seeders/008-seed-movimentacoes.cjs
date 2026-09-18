module.exports = {
    async up(queryInterface) {
        const [processos] = await queryInterface.sequelize.query(`
            SELECT
                id,
                numero
            FROM processos
        `);

        const [processoEtapas] = await queryInterface.sequelize.query(`
            SELECT
                pe.id,
                pe.processo_id,
                pe.etapa_id,
                pe.status,
                pe.ordem,
                e.nome AS etapa_nome
            FROM processo_etapas pe
            INNER JOIN etapas e
                ON e.id = pe.etapa_id
            ORDER BY
                pe.processo_id,
                pe.ordem
        `);

        const [usuarios] = await queryInterface.sequelize.query(`
            SELECT
                id,
                nome,
                email
            FROM usuarios
        `);

        const [setores] = await queryInterface.sequelize.query(`
            SELECT
                id,
                nome,
                sigla
            FROM setores
        `);

        const processosPorNumero = Object.fromEntries(
            processos.map((processo) => [
                processo.numero,
                processo
            ])
        );

        const usuariosPorEmail = Object.fromEntries(
            usuarios.map((usuario) => [
                usuario.email,
                usuario
            ])
        );

        const setoresPorSigla = Object.fromEntries(
            setores.map((setor) => [
                setor.sigla,
                setor
            ])
        );

        const obterEtapasDoProcesso = (numeroProcesso) => {
            const processo = processosPorNumero[numeroProcesso];

            if (!processo) {
                throw new Error(
                    `Processo "${numeroProcesso}" não encontrado.`
                );
            }

            return processoEtapas.filter(
                (etapa) =>
                    etapa.processo_id === processo.id
            );
        };

        const obterEtapa = (
            numeroProcesso,
            ordem
        ) => {
            const etapas =
                obterEtapasDoProcesso(numeroProcesso);

            const etapa = etapas.find(
                (item) => item.ordem === ordem
            );

            if (!etapa) {
                throw new Error(
                    `Etapa ${ordem} do processo "${numeroProcesso}" não encontrada.`
                );
            }

            return etapa;
        };

        const obterUsuario = (email) => {
            const usuario = usuariosPorEmail[email];

            if (!usuario) {
                throw new Error(
                    `Usuário "${email}" não encontrado.`
                );
            }

            return usuario;
        };

        const obterSetor = (sigla) => {
            const setor = setoresPorSigla[sigla];

            if (!setor) {
                throw new Error(
                    `Setor "${sigla}" não encontrado.`
                );
            }

            return setor;
        };

        const agora = new Date();

        const criarData = (diasAtras, horas = 9) => {
            const data = new Date(agora);

            data.setDate(
                data.getDate() - diasAtras
            );

            data.setHours(
                horas,
                0,
                0,
                0
            );

            return data;
        };

        const movimentacoes = [];

        /*
         * PE-001/2026
         *
         * Processo já avançou por algumas etapas.
         */

        const processo1 =
            processosPorNumero["PE-001/2026"];

        const etapa1Processo1 =
            obterEtapa("PE-001/2026", 1);

        const etapa2Processo1 =
            obterEtapa("PE-001/2026", 2);

        const etapa3Processo1 =
            obterEtapa("PE-001/2026", 3);

        const usuarioCompras =
            obterUsuario("compras@sistema.local");

        const usuarioGestor =
            obterUsuario("gestor@sistema.local");

        const setorCompras =
            obterSetor("COMPRAS");

        const setorLicitacoes =
            obterSetor("LIC");

        movimentacoes.push(
            {
                processo_id: processo1.id,
                processo_etapa_id: etapa1Processo1.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorCompras.id,
                tipo: "CRIACAO",
                descricao:
                    "Processo criado e encaminhado para o Setor de Compras.",
                data_movimentacao:
                    criarData(15, 8),
                created_at:
                    criarData(15, 8),
                updated_at:
                    criarData(15, 8)
            },
            {
                processo_id: processo1.id,
                processo_etapa_id: etapa1Processo1.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorCompras.id,
                tipo: "INICIO_ETAPA",
                descricao:
                    "Iniciada a etapa de formalização da demanda.",
                data_movimentacao:
                    criarData(15, 9),
                created_at:
                    criarData(15, 9),
                updated_at:
                    criarData(15, 9)
            },
            {
                processo_id: processo1.id,
                processo_etapa_id: etapa1Processo1.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorCompras.id,
                tipo: "CONCLUSAO_ETAPA",
                descricao:
                    "Formalização da demanda concluída.",
                data_movimentacao:
                    criarData(13, 16),
                created_at:
                    criarData(13, 16),
                updated_at:
                    criarData(13, 16)
            },
            {
                processo_id: processo1.id,
                processo_etapa_id: etapa2Processo1.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorCompras.id,
                tipo: "ENCAMINHAMENTO",
                descricao:
                    "Processo encaminhado para elaboração do estudo técnico.",
                data_movimentacao:
                    criarData(13, 16),
                created_at:
                    criarData(13, 16),
                updated_at:
                    criarData(13, 16)
            },
            {
                processo_id: processo1.id,
                processo_etapa_id: etapa2Processo1.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorCompras.id,
                tipo: "INICIO_ETAPA",
                descricao:
                    "Iniciada a elaboração do estudo técnico.",
                data_movimentacao:
                    criarData(12, 9),
                created_at:
                    criarData(12, 9),
                updated_at:
                    criarData(12, 9)
            },
            {
                processo_id: processo1.id,
                processo_etapa_id: etapa2Processo1.id,
                usuario_id: usuarioGestor.id,
                setor_id: setorLicitacoes.id,
                tipo: "OBSERVACAO",
                descricao:
                    "Aguardando complementação das informações técnicas da área demandante.",
                data_movimentacao:
                    criarData(5, 14),
                created_at:
                    criarData(5, 14),
                updated_at:
                    criarData(5, 14)
            },
            {
                processo_id: processo1.id,
                processo_etapa_id: etapa2Processo1.id,
                usuario_id: usuarioGestor.id,
                setor_id: setorLicitacoes.id,
                tipo: "ENCAMINHAMENTO",
                descricao:
                    "Processo encaminhado para análise do Setor de Licitações.",
                data_movimentacao:
                    criarData(2, 10),
                created_at:
                    criarData(2, 10),
                updated_at:
                    criarData(2, 10)
            }
        );

        /*
         * PE-002/2026
         *
         * Processo parado em uma etapa,
         * útil para testar alertas de prazo.
         */

        const processo2 =
            processosPorNumero["PE-002/2026"];

        const etapa1Processo2 =
            obterEtapa("PE-002/2026", 1);

        const setorDemandante =
            obterSetor("DEMAND");

        movimentacoes.push(
            {
                processo_id: processo2.id,
                processo_etapa_id: etapa1Processo2.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorDemandante.id,
                tipo: "CRIACAO",
                descricao:
                    "Processo criado e encaminhado ao setor demandante.",
                data_movimentacao:
                    criarData(20, 8),
                created_at:
                    criarData(20, 8),
                updated_at:
                    criarData(20, 8)
            },
            {
                processo_id: processo2.id,
                processo_etapa_id: etapa1Processo2.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorDemandante.id,
                tipo: "INICIO_ETAPA",
                descricao:
                    "Iniciada a formalização da demanda.",
                data_movimentacao:
                    criarData(20, 9),
                created_at:
                    criarData(20, 9),
                updated_at:
                    criarData(20, 9)
            },
            {
                processo_id: processo2.id,
                processo_etapa_id: etapa1Processo2.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorDemandante.id,
                tipo: "OBSERVACAO",
                descricao:
                    "Processo aguardando informações complementares da área demandante.",
                data_movimentacao:
                    criarData(10, 11),
                created_at:
                    criarData(10, 11),
                updated_at:
                    criarData(10, 11)
            }
        );

        /*
         * CC-001/2026
         *
         * Processo que chegou à fase de análise jurídica.
         */

        const processo3 =
            processosPorNumero["CC-001/2026"];

        const etapa1Processo3 =
            obterEtapa("CC-001/2026", 1);

        const etapa2Processo3 =
            obterEtapa("CC-001/2026", 2);

        const setorJuridico =
            obterSetor("JUR");

        const usuarioJuridico =
            obterUsuario("juridico@sistema.local");

        movimentacoes.push(
            {
                processo_id: processo3.id,
                processo_etapa_id: etapa1Processo3.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorCompras.id,
                tipo: "CRIACAO",
                descricao:
                    "Processo de concorrência criado.",
                data_movimentacao:
                    criarData(25, 8),
                created_at:
                    criarData(25, 8),
                updated_at:
                    criarData(25, 8)
            },
            {
                processo_id: processo3.id,
                processo_etapa_id: etapa1Processo3.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorCompras.id,
                tipo: "INICIO_ETAPA",
                descricao:
                    "Iniciada a preparação da contratação.",
                data_movimentacao:
                    criarData(25, 9),
                created_at:
                    criarData(25, 9),
                updated_at:
                    criarData(25, 9)
            },
            {
                processo_id: processo3.id,
                processo_etapa_id: etapa1Processo3.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorCompras.id,
                tipo: "CONCLUSAO_ETAPA",
                descricao:
                    "Preparação concluída.",
                data_movimentacao:
                    criarData(18, 16),
                created_at:
                    criarData(18, 16),
                updated_at:
                    criarData(18, 16)
            },
            {
                processo_id: processo3.id,
                processo_etapa_id: etapa2Processo3.id,
                usuario_id: usuarioJuridico.id,
                setor_id: setorJuridico.id,
                tipo: "ENCAMINHAMENTO",
                descricao:
                    "Processo encaminhado para análise jurídica.",
                data_movimentacao:
                    criarData(18, 16),
                created_at:
                    criarData(18, 16),
                updated_at:
                    criarData(18, 16)
            }
        );

        /*
         * DL-001/2026
         *
         * Processo de leilão.
         */

        const processo4 =
            processosPorNumero["DL-001/2026"];

        const etapa1Processo4 =
            obterEtapa("DL-001/2026", 1);

        movimentacoes.push(
            {
                processo_id: processo4.id,
                processo_etapa_id: etapa1Processo4.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorCompras.id,
                tipo: "CRIACAO",
                descricao:
                    "Processo de leilão criado.",
                data_movimentacao:
                    criarData(7, 8),
                created_at:
                    criarData(7, 8),
                updated_at:
                    criarData(7, 8)
            },
            {
                processo_id: processo4.id,
                processo_etapa_id: etapa1Processo4.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorCompras.id,
                tipo: "INICIO_ETAPA",
                descricao:
                    "Iniciada a preparação do leilão.",
                data_movimentacao:
                    criarData(7, 9),
                created_at:
                    criarData(7, 9),
                updated_at:
                    criarData(7, 9)
            }
        );

        /*
         * DP-001/2026
         *
         * Processo de dispensa.
         */

        const processo5 =
            processosPorNumero["DP-001/2026"];

        const etapa1Processo5 =
            obterEtapa("DP-001/2026", 1);

        movimentacoes.push(
            {
                processo_id: processo5.id,
                processo_etapa_id: etapa1Processo5.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorCompras.id,
                tipo: "CRIACAO",
                descricao:
                    "Processo de dispensa criado.",
                data_movimentacao:
                    criarData(5, 8),
                created_at:
                    criarData(5, 8),
                updated_at:
                    criarData(5, 8)
            },
            {
                processo_id: processo5.id,
                processo_etapa_id: etapa1Processo5.id,
                usuario_id: usuarioCompras.id,
                setor_id: setorCompras.id,
                tipo: "INICIO_ETAPA",
                descricao:
                    "Iniciada a formalização da demanda.",
                data_movimentacao:
                    criarData(5, 9),
                created_at:
                    criarData(5, 9),
                updated_at:
                    criarData(5, 9)
            }
        );

        /*
         * IN-001/2026
         *
         * Processo de inexigibilidade.
         */

        const processo6 =
            processosPorNumero["IN-001/2026"];

        const etapa1Processo6 =
            obterEtapa("IN-001/2026", 1);

        movimentacoes.push(
            {
                processo_id: processo6.id,
                processo_etapa_id: etapa1Processo6.id,
                usuario_id: usuarioJuridico.id,
                setor_id: setorJuridico.id,
                tipo: "CRIACAO",
                descricao:
                    "Processo de inexigibilidade criado.",
                data_movimentacao:
                    criarData(3, 8),
                created_at:
                    criarData(3, 8),
                updated_at:
                    criarData(3, 8)
            },
            {
                processo_id: processo6.id,
                processo_etapa_id: etapa1Processo6.id,
                usuario_id: usuarioJuridico.id,
                setor_id: setorJuridico.id,
                tipo: "INICIO_ETAPA",
                descricao:
                    "Iniciada a formalização da demanda.",
                data_movimentacao:
                    criarData(3, 9),
                created_at:
                    criarData(3, 9),
                updated_at:
                    criarData(3, 9)
            }
        );

        await queryInterface.bulkInsert(
            "movimentacoes",
            movimentacoes
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete(
            "movimentacoes",
            null,
            {}
        );
    }
};