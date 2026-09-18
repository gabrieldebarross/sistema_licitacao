module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("tipos_processo", [
            {
                nome: "Pregão",
                descricao: "Procedimento para contratação de bens e serviços comuns.",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Concorrência",
                descricao: "Procedimento aplicável às contratações conforme as hipóteses legais.",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Concurso",
                descricao: "Procedimento para escolha de trabalho técnico, científico ou artístico.",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Leilão",
                descricao: "Procedimento para alienação de bens conforme as hipóteses legais.",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Diálogo Competitivo",
                descricao: "Procedimento destinado às contratações nas hipóteses previstas em lei.",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Dispensa",
                descricao: "Contratação direta nas hipóteses legais de dispensa de licitação.",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Inexigibilidade",
                descricao: "Contratação direta quando caracterizada a inviabilidade de competição.",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("tipos_processo", null, {});
    }
};