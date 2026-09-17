import {DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";

import { database } from "../config/database.js";

class Setor extends Model<
    InferAttributes<Setor>,
    InferCreationAttributes<Setor>
> {
    declare id: number;
    declare nome: string;
    declare sigla: string | null;
    declare ativo: boolean;
}

Setor.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nome: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },

        sigla: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true
        },

        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize: database,
        tableName: "setores",
        modelName: "Setor",
        timestamps: true,
        underscored: true
    }
);

export default Setor;