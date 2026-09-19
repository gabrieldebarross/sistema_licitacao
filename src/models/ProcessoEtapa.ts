import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional} from "sequelize";

import { database } from "../config/database.js";

class ProcessoEtapa extends Model<
    InferAttributes<ProcessoEtapa>,
    InferCreationAttributes<ProcessoEtapa>
> {
    declare id: CreationOptional<number>;
    declare processoId: number;
    declare etapaId: number;

    declare status:
        | "PENDENTE"
        | "EM_ANDAMENTO"
        | "CONCLUIDA"
        | "BLOQUEADA"
        | "PULADA";

    declare ordem: number;
    declare responsavelId: number | null;
    declare setorResponsavelId: number | null;
    declare dataInicio: Date | null;
    declare dataConclusao: Date | null;
    declare prazoPrevisto: Date | null;
    declare observacao: string | null;
}

ProcessoEtapa.init(
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

        etapaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "etapa_id"
        },

        status: {
            type: DataTypes.ENUM(
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
            type: DataTypes.INTEGER,
            allowNull: false
        },

        responsavelId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "responsavel_id"
        },

        setorResponsavelId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "setor_responsavel_id"
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

        prazoPrevisto: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "prazo_previsto"
        },

        observacao: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize: database,
        tableName: "processo_etapas",
        modelName: "ProcessoEtapa",
        timestamps: true,
        underscored: true
    }
);

export default ProcessoEtapa;