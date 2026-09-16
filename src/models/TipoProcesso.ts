import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { database } from "../config/database.js";

class TipoProcesso extends Model<
    InferAttributes<TipoProcesso>,
    InferCreationAttributes<TipoProcesso>
> {
    declare id: number;
    declare nome: string;
    declare descricao: string | null;
    declare ativo: boolean;
}

TipoProcesso.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize: database,
        tableName: "tipos_processo",
        modelName: "TipoProcesso",
        timestamps: true,
        underscored: true
    }
);

export default TipoProcesso;