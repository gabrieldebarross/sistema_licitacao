import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "sequelize";

import { database } from "../config/database.js";

class Processo extends Model<
    InferAttributes<Processo>,
    InferCreationAttributes<Processo>
> {
    declare id: CreationOptional<number>;

    declare numero: string;
    declare objeto: string;
    declare descricao: string | null;

    declare tipoProcessoId: number;
    declare fluxoId: number;

    declare status:
        | "RASCUNHO"
        | "EM_ANDAMENTO"
        | "SUSPENSO"
        | "CONCLUIDO"
        | "ANULADO"
        | "REVOGADO";

    declare dataInicio: Date | null;
    declare dataConclusao: Date | null;
    declare etapaAtualId: number | null;
}

Processo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        numero: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        objeto: {
            type: DataTypes.STRING(500),
            allowNull: false
        },

        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        tipoProcessoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "tipo_processo_id"
        },

        fluxoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "fluxo_id"
        },

        status: {
            type: DataTypes.ENUM(
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

        dataInicio: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "data_inicio"
        },

        dataConclusao: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "data_conclusao"
        },

        etapaAtualId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "etapa_atual_id"
        }
    },
    {
        sequelize: database,
        tableName: "processos",
        modelName: "Processo",
        timestamps: true,
        underscored: true
    }
);

export default Processo;