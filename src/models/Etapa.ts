import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from "sequelize";

import { database } from "../config/database.js";
import Fase from "./Fase.js";

class Etapa extends Model<
    InferAttributes<Etapa>,
    InferCreationAttributes<Etapa>
> {
    declare id: number;

    declare nome: string;
    declare ordem: number;
    declare descricao: string | null;

    declare faseId: number;

    declare prazoGestaoDias: number | null;
    declare obrigatoria: boolean;
    declare ativo: boolean;

    /*
     * Relacionamento carregado através do include.
     */
    declare fase?: NonAttribute<Fase>;
}

Etapa.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nome: {
            type: DataTypes.STRING(200),
            allowNull: false
        },

        ordem: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        faseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "fase_id"
        },

        prazoGestaoDias: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "prazo_gestao_dias"
        },

        obrigatoria: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },

        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize: database,
        tableName: "etapas",
        modelName: "Etapa",
        timestamps: true,
        underscored: true
    }
);

export default Etapa;
