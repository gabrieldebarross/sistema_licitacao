module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("fases", {
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

            ordem: {
                type: Sequelize.INTEGER,
                allowNull: false
            },

            descricao: {
                type: Sequelize.TEXT,
                allowNull: true
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

        await queryInterface.addConstraint("fases", {
            fields: ["fluxo_id", "ordem"],
            type: "unique",
            name: "uk_fases_fluxo_ordem"
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("fases");
    }
};