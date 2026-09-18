module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("movimentacoes", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            processo_id: {
                type: Sequelize.INTEGER,
                allowNull: false,

                references: {
                    model: "processos",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },

            processo_etapa_id: {
                type: Sequelize.INTEGER,
                allowNull: true,

                references: {
                    model: "processo_etapas",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },

            usuario_id: {
                type: Sequelize.INTEGER,
                allowNull: true,

                references: {
                    model: "usuarios",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },

            setor_id: {
                type: Sequelize.INTEGER,
                allowNull: true,

                references: {
                    model: "setores",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },

            tipo: {
                type: Sequelize.ENUM(
                    "CRIACAO",
                    "INICIO_ETAPA",
                    "CONCLUSAO_ETAPA",
                    "ENCAMINHAMENTO",
                    "DEVOLUCAO",
                    "ALTERACAO",
                    "SUSPENSAO",
                    "RETOMADA",
                    "OBSERVACAO"
                ),
                allowNull: false
            },

            descricao: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            data_movimentacao: {
                type: Sequelize.DATE,
                allowNull: false
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("movimentacoes");
    }
};