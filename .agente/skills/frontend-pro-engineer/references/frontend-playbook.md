# Frontend Playbook

## Escolha de Stack Rapida
- Escolher `Next.js` para projetos SEO-first, marketing pages e apps com SSR/ISR.
- Escolher `React + Vite` para SPAs de produto com deploy simples e alta velocidade de DX.
- Escolher `Vue/Nuxt` quando o time ja opera melhor nesse ecossistema.
- Escolher `Angular` para ambientes enterprise com padronizacao rigorosa.

## Padrao de Arquitetura Sugerido
- Organizar por feature, nao por tipo tecnico puro.
- Isolar dominio, UI, servicos de API e estado.
- Definir biblioteca de componentes compartilhados cedo.

## Performance Baseline
- Habilitar lazy load em rotas e modulos nao criticos.
- Otimizar imagens e fontes com preload seletivo.
- Evitar bibliotecas pesadas quando houver alternativa nativa.

## Qualidade Baseline
- Lint + format no pre-commit.
- Testes unitarios para logica de negocio e componentes criticos.
- E2E para fluxos de receita (login, compra, checkout, envio de formulario).

## Acessibilidade Baseline
- Garantir navegacao completa via teclado.
- Garantir contraste minimo e foco visivel.
- Usar elementos semanticos antes de ARIA customizada.
