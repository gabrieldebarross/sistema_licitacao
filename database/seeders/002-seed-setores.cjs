module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("setores", [
            {
                nome: "Setor de Compras",
                sigla: "COMPRAS",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Setor de Licitações",
                sigla: "LIC",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Assessoria Jurídica",
                sigla: "JUR",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Setor Financeiro",
                sigla: "FIN",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Setor Demandante",
                sigla: "DEMAND",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Controle Interno",
                sigla: "CI",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Autoridade Competente",
                sigla: "AUT",
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("setores", null, {});
    }
};