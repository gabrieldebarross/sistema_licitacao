module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("fluxos", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            nome: {
                type: Sequelize.STRING(150),
                allowNull: false
            },

            versao: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },

            descricao: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            ativo: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
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
        await queryInterface.dropTable("fluxos");
    }
};