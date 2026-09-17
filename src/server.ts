import "./models/index.js";
import app from "./app.js"
import { env } from "./config/env.js";

async function IniciarServidor(): Promise<void>{

    app.listen(env.port, () => {
        console.log(`Servidor rodando na porta: ${env.port}`);
    });
};

IniciarServidor();