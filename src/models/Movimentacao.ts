import { DataTypes, Model,InferAttributes, InferCreationAttributes } from "sequelize";

import { database } from "../config/database.js";

class Movimentacao extends Model<
    InferAttributes<Movimentacao>,
    InferCreationAttributes<Movimentacao>
> {
    declare id: number;
    declare processoId: number;
    declare processoEtapaId: number | null;
    declare usuarioId: number | null;
    declare setorId: number | null;

    declare tipo:
        | "CRIACAO"
        | "INICIO_ETAPA"
        | "CONCLUSAO_ETAPA"
        | "ENCAMINHAMENTO"
        | "DEVOLUCAO"
        | "ALTERACAO"
        | "SUSPENSAO"
        | "RETOMADA"
        | "OBSERVACAO";

    declare descricao: string;

    declare dataMovimentacao: Date;
}

Movimentacao.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        processoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "processo_id"
        },

        processoEtapaId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "processo_etapa_id"
        },

        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "usuario_id"
        },

        setorId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "setor_id"
        },

        tipo: {
            type: DataTypes.ENUM(
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
            type: DataTypes.TEXT,
            allowNull: false
        },

        dataMovimentacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "data_movimentacao"
        }
    },
    {
        sequelize: database,
        tableName: "movimentacoes",
        modelName: "Movimentacao",
        timestamps: true,
        underscored: true
    }
);

export default Movimentacao;