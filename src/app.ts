import express from "express";
import cors from "cors";

import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({
        sucesso: true,
        mensagem:
            "API do sistema de licitações funcionando"
    });
});

app.use(
    "/api",
    routes
);

export default app;