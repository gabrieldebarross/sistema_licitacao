module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("etapas", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            nome: {
                type: Sequelize.STRING(200),
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

            fase_id: {
                type: Sequelize.INTEGER,
                allowNull: false,

                references: {
                    model: "fases",
                    key: "id"
                },

                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },

            prazo_gestao_dias: {
                type: Sequelize.INTEGER,
                allowNull: true
            },

            obrigatoria: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
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

        await queryInterface.addConstraint("etapas", {
            fields: ["fase_id", "ordem"],
            type: "unique",
            name: "uk_etapas_fase_ordem"
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("etapas");
    }
};