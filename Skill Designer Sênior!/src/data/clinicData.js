export const clinicInfo = {
  name: "Clínica Sorriso & Arte",
  tagline: "Odontologia Estética & Harmonização Orofacial de Alto Padrão",
  slogan: "A perfeita harmonia entre a precisão científica e a arte do sorriso natural.",
  technicalDirector: "Dr. Rafael de Silveira — CRO-SP 104.892",
  directorTitle: "Membro da Sociedade Brasileira de Odontologia Estética (SBOE) & Especialista em Reabilitação Oral pela USP",
  whatsappNumber: "5511998765432",
  phoneDisplay: "(11) 3088-4200",
  whatsappDisplay: "(11) 99876-5432",
  email: "contato@sorrisoearte.com.br",
  address: "Av. Brigadeiro Faria Lima, 3477 — 14º Andar (Edifício Patio Victor Malzoni) — Itaim Bibi, São Paulo - SP",
  valet: "Estacionamento com serviço de manobrista cortesia para pacientes",
  hours: [
    { days: "Segunda a Sexta", time: "08:00 às 20:00" },
    { days: "Sábados", time: "08:30 às 14:00 (Exclusivo para consultas agendadas)" },
    { days: "Domingos e Feriados", time: "Plantão Emergencial VIP sob aviso" },
  ],
  stats: [
    { value: "+4.200", label: "Sorrisos Transformados", detail: "com naturalidade e harmonia" },
    { value: "14 Anos", label: "De Tradição & Excelência", detail: "referência no Itaim Bibi / Jardins" },
    { value: "99.8%", label: "Índice de Satisfação", detail: "avaliado por mais de 800 pacientes" },
    { value: "100%", label: "Planejamento 3D Digital", detail: "mockup prévio antes do procedimento" },
  ]
};

export const bentoProcedures = [
  {
    id: "lentes-porcelana",
    title: "Lentes de Contato em Porcelana",
    subtitle: "Facetas Ultra-finas de 0.2mm em Cerâmica Alemã",
    description: "Correção milimétrica de cor, formato, proporção e alinhamento dental. Esculpidas à mão por ceramistas mestres para proporcionar luminosidade, transparência e textura idêntica aos dentes naturais.",
    tag: "Procedimento Assinatura",
    badgeColor: "bg-gold-50 text-gold-700 border-gold-200",
    features: [
      "Cerâmica feldspática e dissilicato de lítio (E-max)",
      "Preservação biológica com desgaste dental mínimo ou nulo",
      "Mockup físico: teste o resultado no espelho antes de fixar",
      "Durabilidade superior a 15 anos com manutenção preventiva"
    ],
    highlight: "Simulação 3D Prévia",
    gridClass: "lg:col-span-8 lg:row-span-2",
    theme: "dark", // visual de destaque imersivo
  },
  {
    id: "harmonizacao-orofacial",
    title: "Harmonização Facial Full Face",
    subtitle: "Elegância, Rejuvenescimento e Proporção Áurea",
    description: "Abordagem médica conservadora que realça seus traços autênticos. Protocolos exclusivos com ácido hialurônico ultrapurificado, bioestimuladores de colágeno e relaxamento muscular pontual.",
    tag: "Estética Facial Avançada",
    badgeColor: "bg-emerald-tint text-emerald-deep border-emerald-subtle",
    features: [
      "Contorno mandibular e projeção sutil de mento",
      "Preenchimento labial com efeito gloss e hidratação profunda",
      "Bioestimuladores (Sculptra & Radiesse) para firmeza dérmica",
      "Zero efeito artificial: naturalidade imperceptível"
    ],
    highlight: "Protocolo Natural Look",
    gridClass: "lg:col-span-4 lg:row-span-2",
    theme: "light-luxury",
  },
  {
    id: "scanner-3d",
    title: "Scanner Intraoral 3D & Smile Design",
    subtitle: "Tecnologia iTero 5D & Adeus às Moldagens",
    description: "Captura de mais de 6.000 imagens por segundo em alta definição. O paciente visualiza a oclusão e o novo sorriso na tela antes mesmo de começar.",
    tag: "Tecnologia de Ponta",
    badgeColor: "bg-warmgray-100 text-obsidian-800 border-warmgray-200",
    features: [
      "Sem pastas desconfortáveis ou reflexo de náusea",
      "Detecção precoce de microfraturas e cáries interproximais",
      "Precisão digital de 20 micrômetros"
    ],
    highlight: "Conforto Instantâneo",
    gridClass: "lg:col-span-4 lg:row-span-1",
    theme: "light",
  },
  {
    id: "clareamento-laser",
    title: "Clareamento Dental Photo-Laser",
    subtitle: "Luminosidade Radiante sem Sensibilidade",
    description: "Combinação de laser de baixa intensidade com gel clareador nanoestruturado que age na dentina preservando a hidratação do esmalte.",
    tag: "Resultado Imediato",
    badgeColor: "bg-gold-50 text-gold-700 border-gold-200",
    features: [
      "Sessão única de consultório com protocolo dessensibilizante",
      "Até 6 tons mais claros na primeira consulta",
      "Acompanhamento personalizado pós-sessão"
    ],
    highlight: "Zero Sensibilidade",
    gridClass: "lg:col-span-4 lg:row-span-1",
    theme: "light",
  },
  {
    id: "implantes-guiados",
    title: "Implantes Guiados & Carga Imediata",
    subtitle: "Cirurgia Robótica Guiada sem Cortes com Bisturi",
    description: "Reabilitação total ou unitária com implantes de zircônia e titânio grau 4 suíço. Guias cirúrgicas impressas em 3D para procedimento rápido, minimamente invasivo e com recuperação imediata.",
    tag: "Reabilitação Oral",
    badgeColor: "bg-emerald-tint text-emerald-deep border-emerald-subtle",
    features: [
      "Planejamento por Tomografia Computadorizada HD",
      "Possibilidade de dente provisório fixo no mesmo dia",
      "Opção de sedação consciente com anestesiologista"
    ],
    highlight: "Recuperação Acelerada",
    gridClass: "lg:col-span-4 lg:row-span-1",
    theme: "light",
  },
];

export const differentials = [
  {
    icon: "Scan",
    title: "Odontologia 100% Digital",
    description: "Scanners 3D, tomógrafo de feixe cônico de baixa radiação e impressoras 3D integradas. Você vê a evolução do seu tratamento em tempo real com precisão de mícron."
  },
  {
    icon: "Sparkles",
    title: "Conforto & Spa Dental",
    description: "Salas com isolamento acústico, poltronas ergonômicas de couro com massagem relaxante, fones com cancelamento de ruído e aromaterapia com óleos essenciais calmantes."
  },
  {
    icon: "ShieldCheck",
    title: "Sedação Consciente Opcional",
    description: "Para pacientes com fobia ou sensibilidade dental: sedação inalatória com óxido nitroso ou venosa conduzida por médico anestesiologista da equipe."
  },
  {
    icon: "Clock",
    title: "Atendimento Dedicado Exclusivo",
    description: "Limitamos a agenda a um número reduzido de atendimentos por dia. Sem salas de espera cheias, sem atrasos e com todo o tempo do mundo reservado para você."
  },
  {
    icon: "Award",
    title: "Materiais Nobres Importados",
    description: "Utilizamos exclusivamente cerâmicas da Ivoclar Vivadent (Liechtenstein), implantes Straumann (Suíça) e ácido hialurônico Juvederm/Restylane."
  },
  {
    icon: "KeyRound",
    title: "Privacidade & Discrição Total",
    description: "Acesso por elevador privativo, lounge de espera VIP e protocolos rígidos de sigilo médico para figuras públicas, executivos e seus familiares."
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Dra. Carolina Albuquerque",
    role: "Dermatologista & Palestrante",
    city: "São Paulo, SP",
    treatment: "Lentes de Contato em Porcelana & Harmonização Sutil",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1594824813580-77a83d73f443?auto=format&fit=crop&w=200&q=80",
    quote: "Como médica, sou extremamente criteriosa com proporção e naturalidade. O Dr. Rafael e a equipe da Sorriso & Arte superaram qualquer expectativa. Meu sorriso continua parecendo meu, mas com uma luminosidade e elegância que transformaram minha presença profissional.",
    verified: "Paciente há 3 anos",
    date: "Agosto de 2026"
  },
  {
    id: 2,
    name: "Guilherme Mendonça",
    role: "Sócio de Fundo de Investimentos",
    city: "São Paulo / NY",
    treatment: "Implante Guiado Straumann & Clareamento Photo-Laser",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote: "Sempre tive pavor de dentista por traumas de infância. O protocolo de sedação e o conforto da clínica fizeram eu não sentir absolutamente nada. Saí no mesmo dia com o dente pronto e sem dor nenhuma no pós-operatório. Atendimento impecável.",
    verified: "Tratamento Concluído",
    date: "Julho de 2026"
  },
  {
    id: 3,
    name: "Beatriz Nogueira Sanches",
    role: "Empresária de Moda & Designer",
    city: "Campinas, SP",
    treatment: "Facetas Cerâmicas & Preenchimento Labial com Bioestimulador",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    quote: "O que mais me impressionou foi o teste de Mockup 3D antes de qualquer desgaste. Pude me olhar no espelho e pedir pequenos ajustes de curvatura. O resultado final ficou mil vezes mais bonito do que imaginei. Elegância pura.",
    verified: "Avaliação Verificada",
    date: "Setembro de 2026"
  }
];

export const faqList = [
  {
    question: "O desgaste para colocação de lentes de contato desgasta muito o dente?",
    answer: "Não. Na Clínica Sorriso & Arte trabalhamos com lâminas cerâmicas ultrafinas (entre 0.2mm e 0.4mm). Em muitos casos, o preparo é mínimo ou mesmo sem nenhum desgaste estrutural, preservando 100% da vitalidade do dente natural."
  },
  {
    question: "Como funciona a simulação digital 3D (Mockup)?",
    answer: "Realizamos o escaneamento intraoral em alta definição e uma sessão fotográfica de estúdio. Com esses dados, planejamos o formato ideal e imprimimos uma réplica física temporária que você experimenta na boca antes de qualquer procedimento definitivo."
  },
  {
    question: "A harmonização facial pode deixar meu rosto com aspecto artificial?",
    answer: "Nossa filosofia é o 'Quiet Luxury': jamais exagerar em volumes. Valorizamos a restauração de suporte ósseo e a estimulação do seu próprio colágeno. O objetivo é que as pessoas percebam que você está radiante e descansado, sem identificar qualquer intervenção."
  },
  {
    question: "Como funciona a sedação para quem tem medo ou ansiedade?",
    answer: "Dispomos de sedação consciente inalatória ou venosa conduzida por médico anestesiologista. Você permanece em estado de relaxamento profundo e sonolência agradável durante todo o procedimento, sem ansiedade ou memória de dor."
  }
];
