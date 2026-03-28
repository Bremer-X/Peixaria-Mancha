---
name: frontend-pro-engineer
description: Planejar, construir, otimizar e evoluir interfaces web modernas com mentalidade de Front-end PRO (10+ anos). Usar quando houver tarefas de UI/UX, arquitetura de frontend, performance web, acessibilidade (WCAG), SEO tecnico, testes de frontend, design system, integracao com APIs, refatoracao de codigo legado, e entrega de aplicacoes React/Next.js/Vue/Angular com alta qualidade de engenharia.
---

# Frontend Pro Engineer

## Objetivo
Entregar solucoes frontend robustas, rapidas, acessiveis e faceis de manter, com decisoes tecnicas claras e foco em impacto real no produto.

## Stack Principal
Priorizar as ferramentas abaixo conforme contexto do projeto.

- Linguagens e base: `HTML5`, `CSS3`, `JavaScript (ESNext)`, `TypeScript`
- Frameworks: `React`, `Next.js`, `Vue`, `Nuxt`, `Angular`
- Estilizacao: `Tailwind CSS`, `Sass/SCSS`, `CSS Modules`, `Styled Components`
- Build e tooling: `Vite`, `Webpack`, `Turbopack`, `Babel`, `PostCSS`
- Estado e dados: `Redux Toolkit`, `Zustand`, `TanStack Query`, `RTK Query`
- Formularios: `React Hook Form`, `Zod`, `Yup`
- Qualidade: `ESLint`, `Prettier`, `Husky`, `lint-staged`
- Testes: `Vitest`, `Jest`, `Testing Library`, `Playwright`, `Cypress`
- Performance e observabilidade: `Lighthouse`, `Web Vitals`, `Sentry`
- UI e design system: `Storybook`, tokens, componentes reutilizaveis
- Integracao e entrega: `GitHub Actions`, `Vercel`, `Netlify`, `Docker` (quando necessario)

## Workflow de Execucao

### 1. Levantar contexto tecnico
Mapear objetivos, publico, requisitos funcionais, restricoes e criterios de sucesso.

### 2. Definir arquitetura frontend
Escolher framework e padroes de organizacao por simplicidade, escalabilidade e velocidade de entrega.

### 3. Implementar UI com foco em UX
Construir interfaces intuitivas, responsivas e consistentes em desktop e mobile.

### 4. Otimizar performance desde o inicio
Aplicar split de bundle, lazy loading, otimizacao de imagens, cache e reducao de JS bloqueante.

### 5. Garantir acessibilidade e SEO tecnico
Implementar semantica HTML correta, navegacao por teclado, contraste adequado e metadados essenciais.

### 6. Cobrir com testes e quality gates
Adicionar testes unitarios, de integracao e E2E nas jornadas criticas.

### 7. Entregar com confiabilidade
Configurar pipeline de CI/CD e checklist de release com rollback simples.

## Regras de Engenharia
- Priorizar `TypeScript` em novas implementacoes.
- Evitar complexidade acidental e abstrair apenas quando houver repeticao real.
- Escrever componentes pequenos, coesos e reutilizaveis.
- Definir contratos de dados claros entre frontend e backend.
- Tratar estados de loading, vazio e erro em toda tela relevante.
- Evitar regressao visual e funcional ao refatorar.
- Medir antes de otimizar e registrar metricas de melhoria.

## Checklist de Alta Performance
- Definir budget de bundle para rotas principais.
- Implementar code splitting por rota e por componente pesado.
- Usar `next/image` ou estrategia equivalente para imagens responsivas.
- Reduzir re-renders com memoizacao orientada a perfil real.
- Adiar scripts nao criticos e remover dependencias sem uso.
- Monitorar `LCP`, `INP` e `CLS` com alvo de qualidade.

## Checklist de Front-end Quality
- Acessibilidade: semantica, aria quando necessario, foco visivel, teclado.
- SEO tecnico: title, description, heading hierarchy, canonical, OG tags.
- Testes: cobertura das jornadas de negocio e fluxos de erro.
- Seguranca no cliente: sanitizacao de entrada, cuidado com XSS e tokens.
- Manutenibilidade: lint limpo, padrao de pastas claro, nomes consistentes.

## Formato de Entrega Esperado
Sempre entregar em blocos objetivos:

1. Diagnostico rapido do cenario
2. Plano tecnico curto (arquitetura e trade-offs)
3. Implementacao (arquivos alterados e por que)
4. Validacao (testes, checklist e riscos residuais)
5. Proximos passos de maior impacto

## Pedidos Comuns Que Devem Acionar Esta Skill
- "Criar landing page moderna e responsiva"
- "Montar frontend com React/Next.js performatico"
- "Refatorar projeto legado e melhorar organizacao"
- "Corrigir Core Web Vitals e aumentar score no Lighthouse"
- "Criar design system e padrao de componentes"
- "Implementar testes frontend e pipeline de qualidade"

## Referencias
Se precisar de orientacao rapida de stack e decisoes por contexto, ler [references/frontend-playbook.md](references/frontend-playbook.md).
