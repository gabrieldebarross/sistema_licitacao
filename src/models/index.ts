// R. por importar todos os models, registrar os relacionamentos, exportar os models e garantir que o Sequelize conheca todos eles

import TipoProcesso from "./TipoProcesso.js";
import Fluxo from "./Fluxo.js";
import Fase from "./Fase.js";
import Etapa from "./Etapa.js";
import Processo from "./Processo.js";
import ProcessoEtapa from "./ProcessoEtapa.js";
import Movimentacao from "./Movimentacao.js";
import Usuario from "./Usuario.js";
import Setor from "./Setor.js";

// TipoProcesso → Fluxo

TipoProcesso.hasMany(Fluxo, {
    foreignKey: "tipoProcessoId",
    as: "fluxos"
});

Fluxo.belongsTo(TipoProcesso, {
    foreignKey: "tipoProcessoId",
    as: "tipoProcesso"
});

// Fluxo → Fase

Fluxo.hasMany(Fase, {
    foreignKey: "fluxoId",
    as: "fases"
});

Fase.belongsTo(Fluxo, {
    foreignKey: "fluxoId",
    as: "fluxo"
});

// Fase → Etapa

Fase.hasMany(Etapa, {
    foreignKey: "faseId",
    as: "etapas"
});

Etapa.belongsTo(Fase, {
    foreignKey: "faseId",
    as: "fase"
});

// TipoProcesso → Processo

TipoProcesso.hasMany(Processo, {
    foreignKey: "tipoProcessoId",
    as: "processos"
});

Processo.belongsTo(TipoProcesso, {
    foreignKey: "tipoProcessoId",
    as: "tipoProcesso"
});

// Fluxo → Processo

Fluxo.hasMany(Processo, {
    foreignKey: "fluxoId",
    as: "processos"
});

Processo.belongsTo(Fluxo, {
    foreignKey: "fluxoId",
    as: "fluxo"
});

// Processo → ProcessoEtapa

Processo.hasMany(ProcessoEtapa, {
    foreignKey: "processoId",
    as: "etapas"
});

// Usuario → ProcessoEtapa
Usuario.hasMany(ProcessoEtapa, {
    foreignKey: "responsavelId",
    as: "processoEtapasResponsavel"
});

ProcessoEtapa.belongsTo(Usuario, {
    foreignKey: "responsavelId",
    as: "responsavel"
});

// Setor → ProcessoEtapa
Setor.hasMany(ProcessoEtapa, {
    foreignKey: "setorResponsavelId",
    as: "processoEtapas"
});

ProcessoEtapa.belongsTo(Setor, {
    foreignKey: "setorResponsavelId",
    as: "setorResponsavel"
});

// Processo → Etapa atual
Processo.belongsTo(ProcessoEtapa, {
    foreignKey: "etapaAtualId",
    as: "etapaAtual"
});

ProcessoEtapa.belongsTo(Processo, {
    foreignKey: "processoId",
    as: "processo"
});

// Etapa → ProcessoEtapa

Etapa.hasMany(ProcessoEtapa, {
    foreignKey: "etapaId",
    as: "execucoes"
});

ProcessoEtapa.belongsTo(Etapa, {
    foreignKey: "etapaId",
    as: "etapa"
});

// Processo → Movimentacao

Processo.hasMany(Movimentacao, {
    foreignKey: "processoId",
    as: "movimentacoes"
});

Movimentacao.belongsTo(Processo, {
    foreignKey: "processoId",
    as: "processo"
});

// ProcessoEtapa → Movimentacao

ProcessoEtapa.hasMany(Movimentacao, {
    foreignKey: "processoEtapaId",
    as: "movimentacoes"
});

Movimentacao.belongsTo(ProcessoEtapa, {
    foreignKey: "processoEtapaId",
    as: "processoEtapa"
});

// Setor → Usuario

Setor.hasMany(Usuario, {
    foreignKey: "setorId",
    as: "usuarios"
});

Usuario.belongsTo(Setor, {
    foreignKey: "setorId",
    as: "setor"
});

// Usuario → Movimentacao

Usuario.hasMany(Movimentacao, {
    foreignKey: "usuarioId",
    as: "movimentacoes"
});

Movimentacao.belongsTo(Usuario, {
    foreignKey: "usuarioId",
    as: "usuario"
});

// Setor → Movimentacao

Setor.hasMany(Movimentacao, {
    foreignKey: "setorId",
    as: "movimentacoes"
});

Movimentacao.belongsTo(Setor, {
    foreignKey: "setorId",
    as: "setor"
});

export {
    TipoProcesso,
    Fluxo,
    Fase,
    Etapa,
    Processo,
    ProcessoEtapa,
    Movimentacao,
    Usuario,
    Setor
};