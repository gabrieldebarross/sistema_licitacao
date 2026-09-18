module.exports = {
    async up(queryInterface) {
        const [fluxos] = await queryInterface.sequelize.query(`
            SELECT id, nome
            FROM fluxos
        `);

        const fluxosPorNome = Object.fromEntries(
            fluxos.map((fluxo) => [fluxo.nome, fluxo.id])
        );

        const nomesObrigatorios = [
            "Pregão - Rito comum",
            "Concorrência - Rito comum",
            "Concurso",
            "Leilão",
            "Diálogo Competitivo",
            "Dispensa",
            "Inexigibilidade"
        ];

        for (const nome of nomesObrigatorios) {
            if (!fluxosPorNome[nome]) {
                throw new Error(
                    `Fluxo "${nome}" não encontrado. Execute o seeder de fluxos primeiro.`
                );
            }
        }

        await queryInterface.bulkInsert("fases", [
            // ============================================================
            // PREGÃO
            // ============================================================

            {
                nome: "Preparação",
                ordem: 1,
                descricao: "Fase preparatória do processo de pregão.",
                fluxo_id: fluxosPorNome["Pregão - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Divulgação do edital",
                ordem: 2,
                descricao: "Fase de divulgação do instrumento convocatório.",
                fluxo_id: fluxosPorNome["Pregão - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Propostas e lances",
                ordem: 3,
                descricao: "Recebimento das propostas e realização dos lances quando aplicável.",
                fluxo_id: fluxosPorNome["Pregão - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Julgamento",
                ordem: 4,
                descricao: "Análise e julgamento das propostas.",
                fluxo_id: fluxosPorNome["Pregão - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Habilitação",
                ordem: 5,
                descricao: "Análise da documentação de habilitação.",
                fluxo_id: fluxosPorNome["Pregão - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Recursal",
                ordem: 6,
                descricao: "Fase relacionada à manifestação e análise de recursos.",
                fluxo_id: fluxosPorNome["Pregão - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Homologação",
                ordem: 7,
                descricao: "Fase de decisão final da autoridade competente.",
                fluxo_id: fluxosPorNome["Pregão - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },

            // ============================================================
            // CONCORRÊNCIA
            // ============================================================

            {
                nome: "Preparação",
                ordem: 1,
                descricao: "Fase preparatória do processo de concorrência.",
                fluxo_id: fluxosPorNome["Concorrência - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Divulgação do edital",
                ordem: 2,
                descricao: "Fase de divulgação do instrumento convocatório.",
                fluxo_id: fluxosPorNome["Concorrência - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Propostas e lances",
                ordem: 3,
                descricao: "Recebimento das propostas e realização dos lances quando aplicável.",
                fluxo_id: fluxosPorNome["Concorrência - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Julgamento",
                ordem: 4,
                descricao: "Análise e julgamento das propostas.",
                fluxo_id: fluxosPorNome["Concorrência - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Habilitação",
                ordem: 5,
                descricao: "Análise da documentação de habilitação.",
                fluxo_id: fluxosPorNome["Concorrência - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Recursal",
                ordem: 6,
                descricao: "Fase relacionada à manifestação e análise de recursos.",
                fluxo_id: fluxosPorNome["Concorrência - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Homologação",
                ordem: 7,
                descricao: "Fase de decisão final da autoridade competente.",
                fluxo_id: fluxosPorNome["Concorrência - Rito comum"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },

            // ============================================================
            // CONCURSO
            // ============================================================

            {
                nome: "Preparação",
                ordem: 1,
                descricao: "Preparação e definição das condições do concurso.",
                fluxo_id: fluxosPorNome["Concurso"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Edital",
                ordem: 2,
                descricao: "Elaboração e formalização do edital.",
                fluxo_id: fluxosPorNome["Concurso"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Publicação",
                ordem: 3,
                descricao: "Divulgação do edital do concurso.",
                fluxo_id: fluxosPorNome["Concurso"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Apresentação dos trabalhos",
                ordem: 4,
                descricao: "Recebimento dos trabalhos dos participantes.",
                fluxo_id: fluxosPorNome["Concurso"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Julgamento",
                ordem: 5,
                descricao: "Avaliação e julgamento dos trabalhos.",
                fluxo_id: fluxosPorNome["Concurso"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Resultado",
                ordem: 6,
                descricao: "Formalização e divulgação do resultado.",
                fluxo_id: fluxosPorNome["Concurso"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Recursos",
                ordem: 7,
                descricao: "Análise das manifestações e recursos cabíveis.",
                fluxo_id: fluxosPorNome["Concurso"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Homologação",
                ordem: 8,
                descricao: "Homologação do resultado pela autoridade competente.",
                fluxo_id: fluxosPorNome["Concurso"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Premiação ou remuneração",
                ordem: 9,
                descricao: "Etapa relacionada à premiação ou remuneração prevista.",
                fluxo_id: fluxosPorNome["Concurso"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },

            // ============================================================
            // LEILÃO
            // ============================================================

            {
                nome: "Preparação",
                ordem: 1,
                descricao: "Preparação do processo de alienação.",
                fluxo_id: fluxosPorNome["Leilão"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Avaliação dos bens",
                ordem: 2,
                descricao: "Avaliação e preparação dos bens para alienação.",
                fluxo_id: fluxosPorNome["Leilão"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Edital",
                ordem: 3,
                descricao: "Elaboração e formalização do edital.",
                fluxo_id: fluxosPorNome["Leilão"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Publicação",
                ordem: 4,
                descricao: "Divulgação do edital.",
                fluxo_id: fluxosPorNome["Leilão"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Leilão e lances",
                ordem: 5,
                descricao: "Realização do leilão e recebimento dos lances.",
                fluxo_id: fluxosPorNome["Leilão"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Resultado",
                ordem: 6,
                descricao: "Formalização do resultado do leilão.",
                fluxo_id: fluxosPorNome["Leilão"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Recursos",
                ordem: 7,
                descricao: "Tratamento dos recursos cabíveis.",
                fluxo_id: fluxosPorNome["Leilão"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Pagamento",
                ordem: 8,
                descricao: "Acompanhamento do pagamento.",
                fluxo_id: fluxosPorNome["Leilão"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Homologação",
                ordem: 9,
                descricao: "Homologação do resultado pela autoridade competente.",
                fluxo_id: fluxosPorNome["Leilão"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },

            // ============================================================
            // DIÁLOGO COMPETITIVO
            // ============================================================

            {
                nome: "Preparação",
                ordem: 1,
                descricao: "Preparação da contratação e definição das condições iniciais.",
                fluxo_id: fluxosPorNome["Diálogo Competitivo"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Pré-seleção",
                ordem: 2,
                descricao: "Divulgação e análise para pré-seleção dos participantes.",
                fluxo_id: fluxosPorNome["Diálogo Competitivo"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Diálogo",
                ordem: 3,
                descricao: "Realização dos diálogos destinados à definição da solução.",
                fluxo_id: fluxosPorNome["Diálogo Competitivo"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Definição da solução",
                ordem: 4,
                descricao: "Formalização da solução que será submetida à fase competitiva.",
                fluxo_id: fluxosPorNome["Diálogo Competitivo"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Fase competitiva",
                ordem: 5,
                descricao: "Recebimento das propostas na fase competitiva.",
                fluxo_id: fluxosPorNome["Diálogo Competitivo"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Julgamento",
                ordem: 6,
                descricao: "Análise e julgamento das propostas.",
                fluxo_id: fluxosPorNome["Diálogo Competitivo"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Recursal",
                ordem: 7,
                descricao: "Tratamento das manifestações e recursos cabíveis.",
                fluxo_id: fluxosPorNome["Diálogo Competitivo"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Homologação",
                ordem: 8,
                descricao: "Homologação do procedimento.",
                fluxo_id: fluxosPorNome["Diálogo Competitivo"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },

            // ============================================================
            // DISPENSA
            // ============================================================

            {
                nome: "Formalização da demanda",
                ordem: 1,
                descricao: "Registro e formalização da necessidade da contratação.",
                fluxo_id: fluxosPorNome["Dispensa"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Instrução",
                ordem: 2,
                descricao: "Reunião e análise dos documentos necessários à contratação.",
                fluxo_id: fluxosPorNome["Dispensa"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Estimativa da despesa",
                ordem: 3,
                descricao: "Apuração e justificativa do valor estimado da contratação.",
                fluxo_id: fluxosPorNome["Dispensa"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Habilitação e qualificação",
                ordem: 4,
                descricao: "Verificação da documentação de habilitação e qualificação.",
                fluxo_id: fluxosPorNome["Dispensa"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Justificativa da escolha",
                ordem: 5,
                descricao: "Formalização da justificativa para escolha do contratado.",
                fluxo_id: fluxosPorNome["Dispensa"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Justificativa do preço",
                ordem: 6,
                descricao: "Formalização da justificativa do preço contratado.",
                fluxo_id: fluxosPorNome["Dispensa"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Parecer jurídico ou técnico",
                ordem: 7,
                descricao: "Análise jurídica ou técnica quando aplicável.",
                fluxo_id: fluxosPorNome["Dispensa"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Recurso orçamentário",
                ordem: 8,
                descricao: "Verificação da disponibilidade orçamentária.",
                fluxo_id: fluxosPorNome["Dispensa"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Autorização",
                ordem: 9,
                descricao: "Autorização da contratação pela autoridade competente.",
                fluxo_id: fluxosPorNome["Dispensa"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Divulgação",
                ordem: 10,
                descricao: "Publicação ou divulgação dos atos conforme aplicabilidade.",
                fluxo_id: fluxosPorNome["Dispensa"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Contratação",
                ordem: 11,
                descricao: "Formalização da contratação.",
                fluxo_id: fluxosPorNome["Dispensa"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },

            // ============================================================
            // INEXIGIBILIDADE
            // ============================================================

            {
                nome: "Formalização da demanda",
                ordem: 1,
                descricao: "Registro e formalização da necessidade da contratação.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Caracterização da inviabilidade",
                ordem: 2,
                descricao: "Caracterização da inviabilidade de competição.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Instrução",
                ordem: 3,
                descricao: "Reunião e análise dos documentos necessários.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Estimativa e justificativa",
                ordem: 4,
                descricao: "Estimativa da despesa e documentação justificativa.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Comprovação do enquadramento",
                ordem: 5,
                descricao: "Verificação dos elementos que caracterizam a hipótese de inexigibilidade.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Habilitação",
                ordem: 6,
                descricao: "Verificação da documentação de habilitação.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Justificativa da escolha",
                ordem: 7,
                descricao: "Formalização da justificativa para escolha do contratado.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Justificativa do preço",
                ordem: 8,
                descricao: "Formalização da justificativa do preço contratado.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Parecer",
                ordem: 9,
                descricao: "Análise jurídica ou técnica quando aplicável.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Recurso orçamentário",
                ordem: 10,
                descricao: "Verificação da disponibilidade orçamentária.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Autorização",
                ordem: 11,
                descricao: "Autorização da contratação pela autoridade competente.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Divulgação",
                ordem: 12,
                descricao: "Publicação ou divulgação dos atos conforme aplicabilidade.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nome: "Contratação",
                ordem: 13,
                descricao: "Formalização da contratação.",
                fluxo_id: fluxosPorNome["Inexigibilidade"],
                ativo: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("fases", null, {});
    }
};