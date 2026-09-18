module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("processo_etapas", {
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

            etapa_id: {
                type: Sequelize.INTEGER,
                allowNull: false,

                references: {
                    model: "etapas",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },

            status: {
                type: Sequelize.ENUM(
                    "PENDENTE",
                    "EM_ANDAMENTO",
                    "CONCLUIDA",
                    "BLOQUEADA",
                    "PULADA"
                ),
                allowNull: false,
                defaultValue: "PENDENTE"
            },

            ordem: {
                type: Sequelize.INTEGER,
                allowNull: false
            },

            responsavel_id: {
                type: Sequelize.INTEGER,
                allowNull: true,

                references: {
                    model: "usuarios",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },

            setor_responsavel_id: {
                type: Sequelize.INTEGER,
                allowNull: true,

                references: {
                    model: "setores",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },

            data_inicio: {
                type: Sequelize.DATE,
                allowNull: true
            },

            data_conclusao: {
                type: Sequelize.DATE,
                allowNull: true
            },

            prazo_previsto: {
                type: Sequelize.DATE,
                allowNull: true
            },

            observacao: {
                type: Sequelize.TEXT,
                allowNull: true
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
        await queryInterface.dropTable("processo_etapas");
    }
};