import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";

import { database } from "../config/database.js";

class Usuario extends Model<
    InferAttributes<Usuario>,
    InferCreationAttributes<Usuario>
> {
    declare id: number;

    declare nome: string;
    declare email: string;
    declare senha: string;

    declare perfil:
        | "ADMIN"
        | "GESTOR"
        | "SERVIDOR";

    declare setorId: number | null;

    declare ativo: boolean;
}

Usuario.init(
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

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },

        senha: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        perfil: {
            type: DataTypes.ENUM(
                "ADMIN",
                "GESTOR",
                "SERVIDOR"
            ),
            allowNull: false,
            defaultValue: "SERVIDOR"
        },

        setorId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "setor_id"
        },

        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize: database,
        tableName: "usuarios",
        modelName: "Usuario",
        timestamps: true,
        underscored: true
    }
);

export default Usuario;