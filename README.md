# Mobile QA Engineering MVP — Senior Mobile QA Transition Portfolio

Este workspace contém a solução completa de Engenharia de Qualidade Mobile para Android utilizando **WebdriverIO + TypeScript + Appium 2.x (UiAutomator2)** sobre a aplicação **Sauce Labs My Demo App RN**.

👉 **O projeto principal de automação e documentação técnica encontra-se em [`./mobile-qa/`](./mobile-qa/README.md).**

## Atalhos Rápidos

```bash
cd mobile-qa

# Executar suíte de Autenticação
npm run test:auth

# Executar suíte E2E de Catálogo, Carrinho e Resiliência Mobile
npm run test:cart

# Executar todos os testes E2E
npm test
```

## Estrutura de Entregáveis
- **Código & Page Objects:** [`mobile-qa/test/`](./mobile-qa/test/)
- **Estratégia de Testes:** [`mobile-qa/docs/TEST_STRATEGY.md`](./mobile-qa/docs/TEST_STRATEGY.md)
- **Matriz de Riscos:** [`mobile-qa/docs/RISK_MATRIX.md`](./mobile-qa/docs/RISK_MATRIX.md)
- **Casos de Teste (BDD/Gherkin):** [`mobile-qa/docs/TEST_CASES.md`](./mobile-qa/docs/TEST_CASES.md)
- **Pipeline CI/CD (GitHub Actions KVM):** [`.github/workflows/e2e.yml`](./.github/workflows/e2e.yml)
