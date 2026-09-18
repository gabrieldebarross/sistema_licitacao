module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("usuarios", {
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

            email: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true
            },

            senha: {
                type: Sequelize.STRING(255),
                allowNull: false
            },

            perfil: {
                type: Sequelize.ENUM(
                    "ADMIN",
                    "GESTOR",
                    "SERVIDOR"
                ),
                allowNull: false,
                defaultValue: "SERVIDOR"
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

            ativo: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
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
        await queryInterface.dropTable("usuarios");
    }
};