# DESIGN SYSTEM MASTER — CLÍNICA SORRISO & ARTE
> **Especialidade:** Odontologia Estética & Harmonização Orofacial de Alto Padrão
> **Diretriz Visual:** Editorial Luxury & Clinical Excellence (Acabamento de Agência, Sem Cara de IA)
> **Stack:** React 18, Vite, Tailwind CSS, Lucide Icons

---

## 1. Identidade e Filosofia de Design

A **Clínica Sorriso & Arte** combina a precisão científica da odontologia digital contemporânea com a sensibilidade artística da harmonização orofacial. A linguagem visual rejeita os clichês genéricos de IA (gradientes roxo/pink neon, emojis, sombras pesadas e designs pasteurizados) em favor de uma estética **quiet luxury médica**:
- Elegância atemporal, tons quentes de alabastro e ouro champanhe;
- Tipografia editorial refinada com serifas de alta legibilidade nos títulos e sans-serif geométrica para dados e UI;
- Microinterações fluidas, cartões com bordas sutis (hairlines) e elevação suave;
- Foco em autoridade médica (CRO visível, tecnologia 3D de ponta, depoimentos com fotos e procedimentos detalhados).

---

## 2. Paleta de Cores e Tokens CSS

```css
:root {
  /* Bases Claras & Superfícies */
  --color-bg-base: #FAF8F5;          /* Alabaster Warm Ivory */
  --color-bg-surface: #FFFFFF;       /* Pura Porcelana */
  --color-bg-subtle: #F4EFE6;        /* Sand Silk suave */
  --color-bg-dark: #121316;          /* Deep Obsidian Noir */
  --color-bg-dark-card: #1C1D21;     /* Charcoal Luxury */

  /* Cores de Texto e Contraste (WCAG AAA/AA) */
  --color-text-primary: #18181B;     /* Obsidian Charcoal */
  --color-text-secondary: #52525B;   /* Slate Muted */
  --color-text-tertiary: #71717A;    /* Warm Gray */
  --color-text-inverse: #FFFFFF;     /* Branco puro para fundos escuros */

  /* Acentos de Luxo (Ouro Champanhe e Esmeralda Prestige) */
  --color-gold-primary: #C5A880;     /* Champagne Gold Nobre */
  --color-gold-hover: #B5956A;       /* Burnished Gold */
  --color-gold-light: #F7F3EC;       /* Gold Whisper / Tint */
  --color-emerald-accent: #1D3A34;   /* Deep Medical Emerald */
  --color-emerald-light: #EBF3F0;    /* Sage Light Whisper */

  /* Bordas e Divisores */
  --color-border-subtle: #EBE5DB;    /* Hairline Sand */
  --color-border-gold: #DFD3C3;      /* Hairline Gold */

  /* Sombras de Alta Fidelidade */
  --shadow-sm: 0 1px 3px rgba(24, 24, 27, 0.04);
  --shadow-md: 0 4px 14px rgba(24, 24, 27, 0.06), 0 1px 3px rgba(24, 24, 27, 0.03);
  --shadow-lg: 0 12px 30px rgba(24, 24, 27, 0.08), 0 4px 10px rgba(24, 24, 27, 0.04);
  --shadow-luxury: 0 20px 40px -15px rgba(197, 168, 128, 0.25);
}
```

---

## 3. Tipografia Editorial & Escala Hierárquica

- **Títulos e Destaques (Display):** `Playfair Display`, serif. Confere o prestígio editorial, delicadeza e precisão estética das melhores publicações de design e dermatologia/odontologia europeias.
- **Corpo e Interface (UI/Body):** `Plus Jakarta Sans`, sans-serif. Clareza máxima, leitura fluida, legibilidade exemplar para descrições clínicas e formulários.
- **Tags, CRO, Badges e Eyebrows:** `Plus Jakarta Sans` ou `Inter`, uppercase, `letter-spacing: 0.15em`, `font-semibold`.

| Nível | Família | Tamanho / Line-Height | Peso | Uso |
|---|---|---|---|---|
| Display Hero | Playfair Display | `text-4xl sm:text-6xl lg:text-7xl` | 500 / 600 | Título da dobra principal |
| H2 Seções | Playfair Display | `text-3xl sm:text-4xl lg:text-5xl` | 600 | Títulos de Bento Grid, Depoimentos, etc. |
| H3 Cards | Playfair Display | `text-xl sm:text-2xl` | 600 | Título de procedimentos e benefícios |
| Body Lead | Plus Jakarta Sans | `text-lg sm:text-xl / 1.7` | 400 | Subtítulos de apoio |
| Body Text | Plus Jakarta Sans | `text-base / 1.65` | 400 / 500 | Descrições e depoimentos |
| Microcopy / Badges | Plus Jakarta Sans | `text-xs / 1.2` | 600 | Chips de status, CRO, etiquetas |

---

## 4. Bento Grid de Procedimentos — Arquitetura de Destaque

O Bento Grid organiza a excelência dos tratamentos em módulos visuais assimétricos e escaneáveis:
1. **Destaque 1 (Span 2x2 ou Grande Proeminência):** *Lentes de Contato em Porcelana & Facetas Ultra-Finas* — visual antes/depois, simulação digital 3D.
2. **Destaque 2 (Span 2x1 Horizontal):** *Harmonização Orofacial Full Face* — preenchimento com ácido hialurônico de alta pureza, bioestimuladores e botox preventivo.
3. **Card 3 (Span 1x1):** *Scanner Intraoral 3D & Mockup Digital* — sem moldagens desconfortáveis, precisão micrométrica.
4. **Card 4 (Span 1x1):** *Clareamento a Laser Photo-Acelerado* — resultado imediato, proteção de esmalte e zero sensibilidade.
5. **Card 5 (Span 2x1 Horizontal):** *Implantes Guiados por Computador & Sedação Consciente* — reabilitação rápida e indolor em ambiente spa.

---

## 5. Prova Social e Confiança

- Depoimentos reais estruturados com nome, profissão, procedimento realizado, nota (5 estrelas), data e citação em aspas editoriais.
- Selos de segurança clínica e certificações:
  - Registro CRO-SP ativo
  - Scanner Intraoral iTero / 3Shape Trios
  - Sedação Consciente com Médico Anestesista
  - Atendimento individualizado (máximo 4 pacientes/dia por especialista para dedicação total)

---

## 6. Diferenciais e Atmosfera Spa

- **Tecnologia 3D:** Planejamento digital do sorriso antes de qualquer intervenção física.
- **Biossegurança Hospitalar:** Esterilização padrão ouro em ambiente de clínica boutique.
- **Sala VIP & Conforto Acústico:** Cardápio de chás especiais, aromaterapia personalizada e fones com cancelamento de ruído durante o atendimento.
- **Estacionamento com Valet Cortesia:** Conveniência e discrição do início ao fim.

---

## 7. Conversão e Pontos de Contato

1. **Header Fixo:** Navegação suave, botão "Agendar Avaliação VIP" com destaque sutil.
2. **Hero Section:** Proposta de valor inconfundível, métricas de credibilidade (+3.800 sorrisos transformados, 99.4% satisfação, 14 anos de tradição).
3. **Modal de Agendamento Interativo:** Escolha do procedimento desejado, data/período preferido, nome e WhatsApp para retorno imediato da concierge.
4. **Botão WhatsApp Flutuante:** Botão fixo com efeito de pulso luminoso suave em ouro e tooltip contextual ("Converse com nossa Concierge").
5. **Rodapé Completo:** Horários de atendimento, endereço físico privilegiado (Jardins / Faria Lima), mapa, credenciamentos e contatos diretos.
