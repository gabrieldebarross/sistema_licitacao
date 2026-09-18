module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("tipos_processo", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            nome: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
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
        await queryInterface.dropTable("tipos_processo");
    }
};