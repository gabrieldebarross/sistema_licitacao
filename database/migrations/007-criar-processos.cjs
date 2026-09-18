module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("processos", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            numero: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },

            objeto: {
                type: Sequelize.STRING(500),
                allowNull: false
            },

            descricao: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            tipo_processo_id: {
                type: Sequelize.INTEGER,
                allowNull: false,

                references: {
                    model: "tipos_processo",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },

            fluxo_id: {
                type: Sequelize.INTEGER,
                allowNull: false,

                references: {
                    model: "fluxos",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },

            status: {
                type: Sequelize.ENUM(
                    "RASCUNHO",
                    "EM_ANDAMENTO",
                    "SUSPENSO",
                    "CONCLUIDO",
                    "ANULADO",
                    "REVOGADO"
                ),
                allowNull: false,
                defaultValue: "RASCUNHO"
            },

            data_inicio: {
                type: Sequelize.DATE,
                allowNull: true
            },

            data_conclusao: {
                type: Sequelize.DATE,
                allowNull: true
            },

            etapa_atual_id: {
                type: Sequelize.INTEGER,
                allowNull: true
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                    "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                )
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("processos");
    }
};