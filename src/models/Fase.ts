import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { database } from "../config/database.js";

class Fase extends Model<
    InferAttributes<Fase>,
    InferCreationAttributes<Fase>
> {
    declare id: number;
    declare nome: string;
    declare ordem: number;
    declare descricao: string | null;
    declare fluxoId: number;
    declare ativo: boolean;
}

Fase.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(150),
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
        fluxoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "fluxo_id"
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize: database,
        tableName: "fases",
        modelName: "Fase",
        timestamps: true,
        underscored: true
    }
);

export default Fase;