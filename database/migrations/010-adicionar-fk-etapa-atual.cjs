module.exports = {
    async up(queryInterface) {
        await queryInterface.addConstraint("processos", {
            fields: ["etapa_atual_id"],

            type: "foreign key",

            name: "fk_processos_etapa_atual",

            references: {
                table: "processo_etapas",
                field: "id"
            },

            onUpdate: "CASCADE",
            onDelete: "SET NULL"
        });
    },

    async down(queryInterface) {
        await queryInterface.removeConstraint(
            "processos",
            "fk_processos_etapa_atual"
        );
    }
};