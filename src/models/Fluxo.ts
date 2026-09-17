import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { database } from "../config/database.js";

class Fluxo extends Model<
    InferAttributes<Fluxo>,
    InferCreationAttributes<Fluxo>
> {
    declare id: number;
    declare nome: string;
    declare versao: number;
    declare descricao: string | null;
    declare ativo: boolean;
    declare tipoProcessoId: number;
}

Fluxo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        versao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        tipoProcessoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "tipo_processo_id"
        }
    },
    {
        sequelize: database,
        tableName: "fluxos",
        modelName: "Fluxo",
        timestamps: true,
        underscored: true
    }
);

export default Fluxo;