const bcrypt = require("bcrypt");

module.exports = {
    async up(queryInterface) {
        const senhaPadrao = await bcrypt.hash("123456", 10);

        await queryInterface.bulkInsert("usuarios", [
            {
                nome: "Administrador do Sistema",
                email: "admin@sistema.local",
                senha: senhaPadrao,
                perfil: "ADMIN",
                setor_id: null,
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Gestor de Licitações",
                email: "gestor@sistema.local",
                senha: senhaPadrao,
                perfil: "GESTOR",
                setor_id: 2,
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Servidor de Compras",
                email: "compras@sistema.local",
                senha: senhaPadrao,
                perfil: "SERVIDOR",
                setor_id: 1,
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Assessor Jurídico",
                email: "juridico@sistema.local",
                senha: senhaPadrao,
                perfil: "SERVIDOR",
                setor_id: 3,
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Servidor Financeiro",
                email: "financeiro@sistema.local",
                senha: senhaPadrao,
                perfil: "SERVIDOR",
                setor_id: 4,
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("usuarios", null, {});
    }
};