# REGRAS DO PROJETO — LANDING PAGE DE PASSAGENS AÉREAS (SEM CARA DE IA)

Landing page de altíssima conversão para venda de passagens aéreas (agência de viagens).

## 1. CONTEXTO DO PRODUTO

- Categoria: Travel / Booking & Appointment (reasoning rules da skill para o setor de viagens/turismo).
- Público: viajantes buscando passagens com confiança, preço claro e resposta rápida.
- Objetivo: gerar leads/reservas via WhatsApp ou formulário de cotação.

## 2. DIRETRIZES DE DESIGN SYSTEM (UI UX PRO MAX SKILL)

- Acionar a skill `ui-ux-pro-max` para geração automática do design system (padrão de página, paleta, tipografia, efeitos) a partir do prompt "agência de venda de passagens aéreas".
- Rodar o gerador de design system antes de codar:
  `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "travel agency flight booking" --design-system -p "NomeDoCliente"`
- Persistir o resultado em `design-system/[projeto]/MASTER.md` para reuso entre páginas (Home, Cotação, Sobre, Contato).
- Proibido terminantemente: Gradientes roxos/rosa genéricos de IA e botões amadores.
- Proibido: Emojis como ícones (usar apenas ícones SVG profissionais — Phosphor/Lucide).
- Paleta e tipografia devem vir da recomendação da skill para o setor de viagens (céu/confiança: azuis, aviação; evitar paletas "fintech neon" ou "saúde pastel", que não combinam com o segmento).
- Padrão de página recomendado: Hero-Centric + Social Proof (hero com busca/CTA, benefícios, destinos/ofertas, depoimentos, prova social, CTA de cotação repetido).

## 3. ESTRUTURA VISUAL

- Hero com CTA principal acima da dobra (cotar/buscar passagem).
- Seções em Bento Grid ou cards para destinos/ofertas em destaque.
- Prova social: depoimentos, selos de agência regularizada (ex. CADASTUR), avaliações.
- Bloco de confiança: formas de pagamento, parcelamento, cancelamento/remarcação.

## 4. MOBILE-FIRST E INTERAÇÃO

- Botões com altura mínima de 48px para clique fácil do polegar.
- `cursor-pointer` em todos os elementos clicáveis.
- Responsivo obrigatório em 375px, 768px, 1024px e 1440px.
- Textos, chips e badges (ex. "Promoção", "Últimas vagas") devem quebrar linha sem cortar ou distorcer o layout.
- Respeitar `prefers-reduced-motion` nas animações.

## 5. PONTO DE CONVERSÃO

- Botão flutuante de WhatsApp fixo com animação de pulso.
- CTA de cotação repetido após a seção de depoimentos e no rodapé.
- Formulário de cotação curto (origem, destino, datas, contato) sem fricção.

## 6. CHECKLIST DE PRÉ-ENTREGA

- [ ] Sem emojis como ícones (usar SVG: Phosphor/Lucide).
- [ ] Contraste de texto mínimo 4.5:1 no modo claro.
- [ ] Estados de foco visíveis para navegação por teclado.
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Textos, chips e badges sem corte ou quebra malformada.
- [ ] Responsivo testado em 375px, 768px, 1024px, 1440px.
- [ ] Sem gradientes roxos/rosa genéricos de IA.
- [ ] Botão de WhatsApp e CTA de cotação visíveis em todas as seções-chave.

## 7. ANTI-PADRÕES A EVITAR

- Paleta "fintech/crypto" ou "healthcare pastel" fora de contexto.
- Excesso de animação/urgência falsa (contadores fake, "só restam 2 vagas" sem lastro).
- Formulários longos demais antes do primeiro CTA.
