import { Sequelize } from "sequelize";
import { env } from "./env.js";

export const database = new Sequelize(
    env.database.name,
    env.database.user,
    env.database.password,
    {
        host: env.database.host,
        port: env.database.port,
        dialect: "mysql",

        logging: false,

        define: {
            timestamps: true,
            underscored: true
        }
    }
);

export async function conectarBanco(): Promise<void> {
    try {
        await database.authenticate();

        console.log("Banco de dados conectado com sucesso.")
    } catch (error) {
        console.log("Erro ao conectar no banco de dados")
        process.exit(1);
    }
}