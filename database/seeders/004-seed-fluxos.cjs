module.exports = {
    async up(queryInterface) {
        const [tiposProcesso] = await queryInterface.sequelize.query(`
            SELECT id, nome
            FROM tipos_processo
        `);

        const tipos = Object.fromEntries(
            tiposProcesso.map((tipo) => [tipo.nome, tipo.id])
        );

        const nomesObrigatorios = [
            "Pregão",
            "Concorrência",
            "Concurso",
            "Leilão",
            "Diálogo Competitivo",
            "Dispensa",
            "Inexigibilidade"
        ];

        for (const nome of nomesObrigatorios) {
            if (!tipos[nome]) {
                throw new Error(
                    `Tipo de processo "${nome}" não encontrado. Execute o seeder de tipos de processo primeiro.`
                );
            }
        }

        await queryInterface.bulkInsert("fluxos", [
            {
                nome: "Pregão - Rito comum",
                versao: 1,
                descricao: "Fluxo de gestão para processos de pregão.",
                ativo: true,
                tipo_processo_id: tipos["Pregão"],
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Concorrência - Rito comum",
                versao: 1,
                descricao: "Fluxo de gestão para processos de concorrência.",
                ativo: true,
                tipo_processo_id: tipos["Concorrência"],
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Concurso",
                versao: 1,
                descricao: "Fluxo de gestão para processos de concurso.",
                ativo: true,
                tipo_processo_id: tipos["Concurso"],
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Leilão",
                versao: 1,
                descricao: "Fluxo de gestão para processos de leilão.",
                ativo: true,
                tipo_processo_id: tipos["Leilão"],
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Diálogo Competitivo",
                versao: 1,
                descricao: "Fluxo de gestão para processos de diálogo competitivo.",
                ativo: true,
                tipo_processo_id: tipos["Diálogo Competitivo"],
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Dispensa",
                versao: 1,
                descricao: "Fluxo de gestão para processos de contratação direta por dispensa.",
                ativo: true,
                tipo_processo_id: tipos["Dispensa"],
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Inexigibilidade",
                versao: 1,
                descricao: "Fluxo de gestão para processos de contratação direta por inexigibilidade.",
                ativo: true,
                tipo_processo_id: tipos["Inexigibilidade"],
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("fluxos", null, {});
    }
};