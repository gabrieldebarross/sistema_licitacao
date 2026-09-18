module.exports = {
    async up(queryInterface) {
        const [tipos] = await queryInterface.sequelize.query(`
            SELECT
                id,
                nome
            FROM tipos_processo
        `);

        const [fluxos] = await queryInterface.sequelize.query(`
            SELECT
                id,
                nome
            FROM fluxos
        `);

        const [etapas] = await queryInterface.sequelize.query(`
            SELECT
                e.id,
                e.nome,
                e.ordem,
                e.prazo_gestao_dias,
                e.fase_id,
                f.nome AS fase_nome,
                f.ordem AS fase_ordem,
                f.fluxo_id
            FROM etapas e
            INNER JOIN fases f
                ON f.id = e.fase_id
        `);

        const tiposPorNome = Object.fromEntries(
            tipos.map((tipo) => [tipo.nome, tipo.id])
        );

        const fluxosPorNome = Object.fromEntries(
            fluxos.map((fluxo) => [fluxo.nome, fluxo])
        );

        const processos = [
            {
                numero: "PE-001/2026",
                objeto: "Aquisição de materiais de expediente",
                descricao:
                    "Aquisição de materiais destinados ao atendimento das necessidades administrativas.",
                tipoProcesso: "Pregão",
                fluxo: "Pregão - Rito comum",
                status: "EM_ANDAMENTO"
            },
            {
                numero: "PE-002/2026",
                objeto: "Contratação de empresa para manutenção predial",
                descricao:
                    "Contratação de serviços de manutenção preventiva e corretiva dos prédios públicos.",
                tipoProcesso: "Pregão",
                fluxo: "Pregão - Rito comum",
                status: "EM_ANDAMENTO"
            },
            {
                numero: "CC-001/2026",
                objeto: "Contratação de empresa para execução de obra pública",
                descricao:
                    "Contratação de empresa especializada para execução de obra de infraestrutura.",
                tipoProcesso: "Concorrência",
                fluxo: "Concorrência - Rito comum",
                status: "EM_ANDAMENTO"
            },
            {
                numero: "DL-001/2026",
                objeto: "Alienação de veículos inservíveis",
                descricao:
                    "Alienação de veículos considerados inservíveis para a administração.",
                tipoProcesso: "Leilão",
                fluxo: "Leilão",
                status: "EM_ANDAMENTO"
            },
            {
                numero: "DP-001/2026",
                objeto: "Contratação de serviço especializado",
                descricao:
                    "Contratação direta por hipótese de dispensa de licitação.",
                tipoProcesso: "Dispensa",
                fluxo: "Dispensa",
                status: "EM_ANDAMENTO"
            },
            {
                numero: "IN-001/2026",
                objeto: "Contratação de serviço de natureza singular",
                descricao:
                    "Contratação direta mediante caracterização de inviabilidade de competição.",
                tipoProcesso: "Inexigibilidade",
                fluxo: "Inexigibilidade",
                status: "EM_ANDAMENTO"
            }
        ];

        for (const processo of processos) {
            if (!tiposPorNome[processo.tipoProcesso]) {
                throw new Error(
                    `Tipo de processo "${processo.tipoProcesso}" não encontrado.`
                );
            }

            if (!fluxosPorNome[processo.fluxo]) {
                throw new Error(
                    `Fluxo "${processo.fluxo}" não encontrado.`
                );
            }
        }

        const agora = new Date();

        const processosParaInserir = processos.map((processo) => ({
            numero: processo.numero,
            objeto: processo.objeto,
            descricao: processo.descricao,
            tipo_processo_id: tiposPorNome[processo.tipoProcesso],
            fluxo_id: fluxosPorNome[processo.fluxo].id,
            status: processo.status,
            data_inicio: agora,
            data_conclusao: null,
            etapa_atual_id: null,
            created_at: agora,
            updated_at: agora
        }));

        await queryInterface.bulkInsert(
            "processos",
            processosParaInserir
        );

        const numeros = processos.map(
            (processo) => processo.numero
        );

        const placeholders = numeros
            .map(() => "?")
            .join(", ");

        const [processosInseridos] =
            await queryInterface.sequelize.query(
                `
                    SELECT
                        id,
                        numero,
                        fluxo_id
                    FROM processos
                    WHERE numero IN (${placeholders})
                `,
                {
                    replacements: numeros
                }
            );

        const processoEtapas = [];

        for (const processo of processosInseridos) {
            const etapasDoFluxo = etapas
                .filter(
                    (etapa) =>
                        etapa.fluxo_id === processo.fluxo_id
                )
                .sort((a, b) => {
                    if (a.fase_ordem !== b.fase_ordem) {
                        return a.fase_ordem - b.fase_ordem;
                    }

                    return a.ordem - b.ordem;
                });

            if (etapasDoFluxo.length === 0) {
                throw new Error(
                    `Nenhuma etapa encontrada para o fluxo do processo "${processo.numero}".`
                );
            }

            etapasDoFluxo.forEach((etapa, index) => {
                const primeiraEtapa = index === 0;

                let prazoPrevisto = null;

                if (
                    primeiraEtapa &&
                    etapa.prazo_gestao_dias !== null
                ) {
                    prazoPrevisto = new Date(
                        agora.getTime() +
                            etapa.prazo_gestao_dias *
                                24 *
                                60 *
                                60 *
                                1000
                    );
                }

                processoEtapas.push({
                    processo_id: processo.id,
                    etapa_id: etapa.id,
                    status: primeiraEtapa
                        ? "EM_ANDAMENTO"
                        : "PENDENTE",
                    ordem: index + 1,
                    responsavel_id: null,
                    setor_responsavel_id: null,
                    data_inicio: primeiraEtapa
                        ? agora
                        : null,
                    data_conclusao: null,
                    prazo_previsto: prazoPrevisto,
                    observacao: null,
                    created_at: agora,
                    updated_at: agora
                });
            });
        }

        await queryInterface.bulkInsert(
            "processo_etapas",
            processoEtapas
        );

        const [primeirasEtapas] =
            await queryInterface.sequelize.query(`
                SELECT
                    pe.id,
                    pe.processo_id
                FROM processo_etapas pe
                INNER JOIN (
                    SELECT
                        processo_id,
                        MIN(ordem) AS menor_ordem
                    FROM processo_etapas
                    GROUP BY processo_id
                ) primeiras
                    ON primeiras.processo_id = pe.processo_id
                    AND primeiras.menor_ordem = pe.ordem
            `);

        for (const etapa of primeirasEtapas) {
            await queryInterface.sequelize.query(
                `
                    UPDATE processos
                    SET etapa_atual_id = ?
                    WHERE id = ?
                `,
                {
                    replacements: [
                        etapa.id,
                        etapa.processo_id
                    ]
                }
            );
        }
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query(`
            DELETE FROM processos
        `);
    }
};