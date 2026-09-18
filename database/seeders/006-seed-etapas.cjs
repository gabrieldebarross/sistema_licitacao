module.exports = {
    async up(queryInterface) {
        const [fases] = await queryInterface.sequelize.query(`
            SELECT
                id,
                nome,
                fluxo_id
            FROM fases
        `);

        const [fluxos] = await queryInterface.sequelize.query(`
            SELECT
                id,
                nome
            FROM fluxos
        `);

        const fluxosPorNome = Object.fromEntries(
            fluxos.map((fluxo) => [fluxo.nome, fluxo.id])
        );

        const fasesDoFluxo = (nomeFluxo) => {
            const fluxoId = fluxosPorNome[nomeFluxo];

            if (!fluxoId) {
                throw new Error(
                    `Fluxo "${nomeFluxo}" não encontrado. Execute o seeder de fluxos primeiro.`
                );
            }

            return fases.filter((fase) => fase.fluxo_id === fluxoId);
        };

        const criarEtapas = (nomeFluxo, etapasPorFase) => {
            const fasesEncontradas = fasesDoFluxo(nomeFluxo);

            return etapasPorFase.flatMap((configuracao) => {
                const fase = fasesEncontradas.find(
                    (item) => item.nome === configuracao.fase
                );

                if (!fase) {
                    throw new Error(
                        `Fase "${configuracao.fase}" não encontrada no fluxo "${nomeFluxo}".`
                    );
                }

                return configuracao.etapas.map((etapa) => ({
                    nome: etapa.nome,
                    ordem: etapa.ordem,
                    descricao: etapa.descricao,
                    fase_id: fase.id,
                    prazo_gestao_dias: etapa.prazoGestaoDias,
                    obrigatoria: etapa.obrigatoria ?? true,
                    ativo: true,
                    created_at: new Date(),
                    updated_at: new Date()
                }));
            });
        };

        const etapas = [
            ...criarEtapas("Pregão - Rito comum", [
                {
                    fase: "Preparação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Formalização da demanda",
                            descricao: "Registro e formalização da necessidade da contratação.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Elaboração do estudo técnico",
                            descricao: "Elaboração do estudo técnico preliminar quando aplicável.",
                            prazoGestaoDias: 10
                        },
                        {
                            ordem: 3,
                            nome: "Elaboração do termo de referência",
                            descricao: "Definição do objeto, condições e requisitos da contratação.",
                            prazoGestaoDias: 7
                        },
                        {
                            ordem: 4,
                            nome: "Estimativa da despesa",
                            descricao: "Levantamento e registro da estimativa do valor da contratação.",
                            prazoGestaoDias: 7
                        },
                        {
                            ordem: 5,
                            nome: "Análise jurídica",
                            descricao: "Análise jurídica quando aplicável.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Divulgação do edital",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Elaboração do edital",
                            descricao: "Preparação do instrumento convocatório.",
                            prazoGestaoDias: 5
                        },
                        {
                            ordem: 2,
                            nome: "Aprovação do edital",
                            descricao: "Revisão e aprovação do edital pela autoridade competente.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 3,
                            nome: "Publicação do edital",
                            descricao: "Divulgação do edital nos meios exigidos.",
                            prazoGestaoDias: 2
                        }
                    ]
                },
                {
                    fase: "Propostas e lances",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Recebimento das propostas",
                            descricao: "Recebimento das propostas dos participantes.",
                            prazoGestaoDias: null
                        },
                        {
                            ordem: 2,
                            nome: "Sessão de lances",
                            descricao: "Realização da etapa competitiva por lances quando aplicável.",
                            prazoGestaoDias: null
                        }
                    ]
                },
                {
                    fase: "Julgamento",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Análise das propostas",
                            descricao: "Análise e classificação das propostas apresentadas.",
                            prazoGestaoDias: 5
                        },
                        {
                            ordem: 2,
                            nome: "Julgamento da proposta",
                            descricao: "Aplicação do critério de julgamento previsto no edital.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Habilitação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Análise da documentação",
                            descricao: "Verificação dos documentos de habilitação.",
                            prazoGestaoDias: 5
                        },
                        {
                            ordem: 2,
                            nome: "Verificação da habilitação",
                            descricao: "Registro do resultado da habilitação.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Recursal",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Recebimento de recursos",
                            descricao: "Registro das manifestações recursais.",
                            prazoGestaoDias: null
                        },
                        {
                            ordem: 2,
                            nome: "Análise dos recursos",
                            descricao: "Análise e encaminhamento das manifestações recursais.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Homologação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Encaminhamento para homologação",
                            descricao: "Preparação do processo para decisão da autoridade competente.",
                            prazoGestaoDias: 2
                        },
                        {
                            ordem: 2,
                            nome: "Homologação",
                            descricao: "Registro da decisão da autoridade competente.",
                            prazoGestaoDias: 3
                        }
                    ]
                }
            ]),

            ...criarEtapas("Concorrência - Rito comum", [
                {
                    fase: "Preparação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Formalização da demanda",
                            descricao: "Registro e formalização da necessidade da contratação.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Elaboração do estudo técnico",
                            descricao: "Elaboração do estudo técnico preliminar quando aplicável.",
                            prazoGestaoDias: 10
                        },
                        {
                            ordem: 3,
                            nome: "Elaboração do termo de referência ou projeto",
                            descricao: "Definição técnica do objeto e das condições da contratação.",
                            prazoGestaoDias: 10
                        },
                        {
                            ordem: 4,
                            nome: "Estimativa da despesa",
                            descricao: "Levantamento da estimativa do valor da contratação.",
                            prazoGestaoDias: 7
                        },
                        {
                            ordem: 5,
                            nome: "Análise jurídica",
                            descricao: "Análise jurídica quando aplicável.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Divulgação do edital",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Elaboração do edital",
                            descricao: "Preparação do instrumento convocatório.",
                            prazoGestaoDias: 5
                        },
                        {
                            ordem: 2,
                            nome: "Aprovação do edital",
                            descricao: "Revisão e aprovação do edital.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 3,
                            nome: "Publicação do edital",
                            descricao: "Divulgação do edital nos meios exigidos.",
                            prazoGestaoDias: 2
                        }
                    ]
                },
                {
                    fase: "Propostas e lances",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Recebimento das propostas",
                            descricao: "Recebimento das propostas dos participantes.",
                            prazoGestaoDias: null
                        },
                        {
                            ordem: 2,
                            nome: "Sessão pública",
                            descricao: "Realização da sessão competitiva quando aplicável.",
                            prazoGestaoDias: null
                        }
                    ]
                },
                {
                    fase: "Julgamento",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Análise das propostas",
                            descricao: "Análise e classificação das propostas.",
                            prazoGestaoDias: 5
                        },
                        {
                            ordem: 2,
                            nome: "Aplicação do critério de julgamento",
                            descricao: "Aplicação do critério previsto no edital.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Habilitação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Análise da documentação",
                            descricao: "Verificação dos documentos de habilitação.",
                            prazoGestaoDias: 5
                        },
                        {
                            ordem: 2,
                            nome: "Resultado da habilitação",
                            descricao: "Registro do resultado da habilitação.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Recursal",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Recebimento de recursos",
                            descricao: "Registro das manifestações recursais.",
                            prazoGestaoDias: null
                        },
                        {
                            ordem: 2,
                            nome: "Análise dos recursos",
                            descricao: "Análise das manifestações recursais.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Homologação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Encaminhamento para homologação",
                            descricao: "Encaminhamento do processo à autoridade competente.",
                            prazoGestaoDias: 2
                        },
                        {
                            ordem: 2,
                            nome: "Homologação",
                            descricao: "Registro da decisão da autoridade competente.",
                            prazoGestaoDias: 3
                        }
                    ]
                }
            ]),

            ...criarEtapas("Concurso", [
                {
                    fase: "Preparação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Formalização da demanda",
                            descricao: "Registro da necessidade do concurso.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Definição do objeto",
                            descricao: "Definição do trabalho técnico, científico ou artístico.",
                            prazoGestaoDias: 10
                        },
                        {
                            ordem: 3,
                            nome: "Elaboração do edital",
                            descricao: "Preparação do instrumento convocatório.",
                            prazoGestaoDias: 7
                        }
                    ]
                },
                {
                    fase: "Edital",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Revisão do edital",
                            descricao: "Revisão das regras e condições do concurso.",
                            prazoGestaoDias: 5
                        },
                        {
                            ordem: 2,
                            nome: "Aprovação do edital",
                            descricao: "Aprovação do edital pela autoridade competente.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Publicação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Publicação do edital",
                            descricao: "Divulgação do edital nos meios exigidos.",
                            prazoGestaoDias: 2
                        }
                    ]
                },
                {
                    fase: "Apresentação dos trabalhos",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Recebimento dos trabalhos",
                            descricao: "Recebimento dos trabalhos apresentados pelos participantes.",
                            prazoGestaoDias: null
                        }
                    ]
                },
                {
                    fase: "Julgamento",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Análise dos trabalhos",
                            descricao: "Avaliação dos trabalhos pela comissão competente.",
                            prazoGestaoDias: 10
                        },
                        {
                            ordem: 2,
                            nome: "Classificação",
                            descricao: "Classificação dos trabalhos conforme os critérios definidos.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Resultado",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Publicação do resultado",
                            descricao: "Divulgação do resultado do concurso.",
                            prazoGestaoDias: 2
                        }
                    ]
                },
                {
                    fase: "Recursos",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Recebimento de recursos",
                            descricao: "Registro dos recursos apresentados.",
                            prazoGestaoDias: null
                        },
                        {
                            ordem: 2,
                            nome: "Análise dos recursos",
                            descricao: "Análise dos recursos apresentados.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Homologação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Homologação do resultado",
                            descricao: "Registro da homologação do resultado.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Premiação ou remuneração",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Processamento da premiação",
                            descricao: "Processamento da premiação ou remuneração prevista.",
                            prazoGestaoDias: 10
                        }
                    ]
                }
            ]),

            ...criarEtapas("Leilão", [
                {
                    fase: "Preparação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Formalização da demanda",
                            descricao: "Registro da necessidade de alienação.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Identificação dos bens",
                            descricao: "Identificação e caracterização dos bens a serem alienados.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Avaliação dos bens",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Avaliação dos bens",
                            descricao: "Avaliação dos bens que serão objeto do leilão.",
                            prazoGestaoDias: 10
                        },
                        {
                            ordem: 2,
                            nome: "Definição do valor mínimo",
                            descricao: "Registro dos valores utilizados para a alienação.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Edital",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Elaboração do edital",
                            descricao: "Preparação do edital do leilão.",
                            prazoGestaoDias: 5
                        },
                        {
                            ordem: 2,
                            nome: "Aprovação do edital",
                            descricao: "Revisão e aprovação do edital.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Publicação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Publicação do edital",
                            descricao: "Divulgação do edital do leilão.",
                            prazoGestaoDias: 2
                        }
                    ]
                },
                {
                    fase: "Leilão e lances",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Realização do leilão",
                            descricao: "Realização da sessão de leilão.",
                            prazoGestaoDias: null
                        },
                        {
                            ordem: 2,
                            nome: "Registro dos lances",
                            descricao: "Registro dos lances apresentados.",
                            prazoGestaoDias: null
                        }
                    ]
                },
                {
                    fase: "Resultado",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Apuração do resultado",
                            descricao: "Apuração e registro do resultado do leilão.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Recursos",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Análise de manifestações",
                            descricao: "Análise das manifestações apresentadas.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Pagamento",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Acompanhamento do pagamento",
                            descricao: "Acompanhamento do pagamento pelo arrematante.",
                            prazoGestaoDias: 10
                        }
                    ]
                },
                {
                    fase: "Homologação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Homologação do resultado",
                            descricao: "Registro da homologação do resultado.",
                            prazoGestaoDias: 3
                        }
                    ]
                }
            ]),

            ...criarEtapas("Diálogo Competitivo", [
                {
                    fase: "Preparação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Formalização da demanda",
                            descricao: "Registro da necessidade da contratação.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Caracterização da necessidade",
                            descricao: "Definição do problema e das características da contratação.",
                            prazoGestaoDias: 10
                        }
                    ]
                },
                {
                    fase: "Pré-seleção",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Publicação do edital de pré-seleção",
                            descricao: "Divulgação das condições para participação no diálogo.",
                            prazoGestaoDias: 2
                        },
                        {
                            ordem: 2,
                            nome: "Recebimento das manifestações",
                            descricao: "Recebimento das manifestações de interesse.",
                            prazoGestaoDias: null
                        },
                        {
                            ordem: 3,
                            nome: "Análise dos participantes",
                            descricao: "Análise e pré-seleção dos participantes.",
                            prazoGestaoDias: 10
                        }
                    ]
                },
                {
                    fase: "Diálogo",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Início do diálogo",
                            descricao: "Início das reuniões e discussões com os participantes pré-selecionados.",
                            prazoGestaoDias: null
                        },
                        {
                            ordem: 2,
                            nome: "Registro das soluções discutidas",
                            descricao: "Registro das soluções e alternativas discutidas.",
                            prazoGestaoDias: null
                        }
                    ]
                },
                {
                    fase: "Definição da solução",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Encerramento do diálogo",
                            descricao: "Registro do encerramento da fase de diálogo.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Definição da solução",
                            descricao: "Formalização da solução que será submetida à fase competitiva.",
                            prazoGestaoDias: 10
                        }
                    ]
                },
                {
                    fase: "Fase competitiva",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Convocação dos participantes",
                            descricao: "Convocação para apresentação das propostas.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Recebimento das propostas",
                            descricao: "Recebimento das propostas da fase competitiva.",
                            prazoGestaoDias: null
                        }
                    ]
                },
                {
                    fase: "Julgamento",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Análise das propostas",
                            descricao: "Análise das propostas apresentadas.",
                            prazoGestaoDias: 10
                        },
                        {
                            ordem: 2,
                            nome: "Julgamento",
                            descricao: "Aplicação do critério de julgamento.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Recursal",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Recebimento de recursos",
                            descricao: "Registro das manifestações recursais.",
                            prazoGestaoDias: null
                        },
                        {
                            ordem: 2,
                            nome: "Análise dos recursos",
                            descricao: "Análise das manifestações recursais.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Homologação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Encaminhamento para homologação",
                            descricao: "Encaminhamento do processo para decisão da autoridade competente.",
                            prazoGestaoDias: 2
                        },
                        {
                            ordem: 2,
                            nome: "Homologação",
                            descricao: "Registro da decisão da autoridade competente.",
                            prazoGestaoDias: 3
                        }
                    ]
                }
            ]),

            ...criarEtapas("Dispensa", [
                {
                    fase: "Formalização da demanda",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Registro da necessidade",
                            descricao: "Formalização da demanda de contratação.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Definição do objeto",
                            descricao: "Definição do objeto e das condições da contratação.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Instrução",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Elaboração da documentação",
                            descricao: "Organização da documentação necessária à contratação.",
                            prazoGestaoDias: 7
                        },
                        {
                            ordem: 2,
                            nome: "Estudo técnico quando aplicável",
                            descricao: "Elaboração do estudo técnico quando aplicável.",
                            prazoGestaoDias: 7
                        },
                        {
                            ordem: 3,
                            nome: "Termo de referência ou projeto",
                            descricao: "Elaboração do documento técnico correspondente.",
                            prazoGestaoDias: 7
                        }
                    ]
                },
                {
                    fase: "Estimativa da despesa",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Pesquisa de preços",
                            descricao: "Levantamento dos preços de referência.",
                            prazoGestaoDias: 7
                        },
                        {
                            ordem: 2,
                            nome: "Estimativa da contratação",
                            descricao: "Registro da estimativa da despesa.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Habilitação e qualificação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Verificação da documentação",
                            descricao: "Verificação da documentação do fornecedor.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Justificativa da escolha",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Justificativa do fornecedor",
                            descricao: "Registro da justificativa da escolha do fornecedor.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Justificativa do preço",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Justificativa do preço",
                            descricao: "Registro dos fundamentos do preço contratado.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Parecer jurídico ou técnico",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Análise do processo",
                            descricao: "Análise jurídica ou técnica quando aplicável.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Recurso orçamentário",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Verificação da disponibilidade",
                            descricao: "Verificação da disponibilidade orçamentária.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Reserva orçamentária",
                            descricao: "Registro da reserva orçamentária quando aplicável.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Autorização",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Análise pela autoridade competente",
                            descricao: "Análise e decisão da autoridade competente.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Autorização da contratação",
                            descricao: "Registro da autorização da contratação.",
                            prazoGestaoDias: 2
                        }
                    ]
                },
                {
                    fase: "Divulgação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Publicação do ato",
                            descricao: "Divulgação do ato de contratação direta conforme aplicável.",
                            prazoGestaoDias: 2
                        }
                    ]
                },
                {
                    fase: "Contratação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Formalização da contratação",
                            descricao: "Formalização do instrumento de contratação.",
                            prazoGestaoDias: 5
                        }
                    ]
                }
            ]),

            ...criarEtapas("Inexigibilidade", [
                {
                    fase: "Formalização da demanda",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Registro da necessidade",
                            descricao: "Formalização da demanda de contratação.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Definição do objeto",
                            descricao: "Definição do objeto da contratação.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Caracterização da inviabilidade",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Análise do enquadramento",
                            descricao: "Análise da hipótese de inviabilidade de competição.",
                            prazoGestaoDias: 7
                        },
                        {
                            ordem: 2,
                            nome: "Comprovação da inviabilidade",
                            descricao: "Organização dos elementos que comprovam o enquadramento.",
                            prazoGestaoDias: 7
                        }
                    ]
                },
                {
                    fase: "Instrução",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Organização da documentação",
                            descricao: "Organização da documentação necessária à contratação.",
                            prazoGestaoDias: 7
                        },
                        {
                            ordem: 2,
                            nome: "Elaboração do termo de referência ou documento técnico",
                            descricao: "Elaboração do documento técnico correspondente.",
                            prazoGestaoDias: 7
                        }
                    ]
                },
                {
                    fase: "Estimativa e justificativa",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Estimativa da despesa",
                            descricao: "Definição da estimativa da contratação.",
                            prazoGestaoDias: 5
                        },
                        {
                            ordem: 2,
                            nome: "Justificativa da contratação",
                            descricao: "Registro das justificativas necessárias.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Comprovação do enquadramento",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Documentação do enquadramento",
                            descricao: "Registro dos elementos que sustentam o enquadramento da contratação.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Habilitação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Verificação da documentação",
                            descricao: "Verificação da documentação do contratado.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Justificativa da escolha",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Justificativa do fornecedor",
                            descricao: "Registro da justificativa da escolha do fornecedor.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Justificativa do preço",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Justificativa do preço",
                            descricao: "Registro dos fundamentos do preço contratado.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Parecer",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Análise jurídica ou técnica",
                            descricao: "Análise jurídica ou técnica quando aplicável.",
                            prazoGestaoDias: 5
                        }
                    ]
                },
                {
                    fase: "Recurso orçamentário",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Verificação da disponibilidade",
                            descricao: "Verificação da disponibilidade orçamentária.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Reserva orçamentária",
                            descricao: "Registro da reserva orçamentária quando aplicável.",
                            prazoGestaoDias: 3
                        }
                    ]
                },
                {
                    fase: "Autorização",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Análise pela autoridade competente",
                            descricao: "Análise e decisão da autoridade competente.",
                            prazoGestaoDias: 3
                        },
                        {
                            ordem: 2,
                            nome: "Autorização da contratação",
                            descricao: "Registro da autorização da contratação.",
                            prazoGestaoDias: 2
                        }
                    ]
                },
                {
                    fase: "Divulgação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Publicação do ato",
                            descricao: "Divulgação do ato de contratação direta conforme aplicável.",
                            prazoGestaoDias: 2
                        }
                    ]
                },
                {
                    fase: "Contratação",
                    etapas: [
                        {
                            ordem: 1,
                            nome: "Formalização da contratação",
                            descricao: "Formalização do instrumento de contratação.",
                            prazoGestaoDias: 5
                        }
                    ]
                }
            ])
        ];

        await queryInterface.bulkInsert("etapas", etapas);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("etapas", null, {});
    }
};