# Mobile QA Engineering Architecture — Android E2E Automation Framework

![Platform](https://img.shields.io/badge/Platform-Android_UiAutomator2-3DDC84?logo=android&logoColor=white)
![Framework](https://img.shields.io/badge/Framework-WebdriverIO_v10_%2B_Appium_2.x-EA5906?logo=webdriverio&logoColor=white)
![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)
![CI](https://img.shields.io/badge/CI%2FCD-GitHub_Actions_KVM-2088FF?logo=githubactions&logoColor=white)

## 1. Resumo Executivo

Este repositório apresenta uma arquitetura de Engenharia de Qualidade Mobile (**Senior Mobile QA Engineer**) desenhada para validar a aplicação **Sauce Labs My Demo App RN** em Android. O projeto combina **Engenharia de Software aplicada a Testes** (Page Object Model tipado, sincronização explícita determinística, gestos nativos W3C e resiliência de ciclo de vida) com **Governança de Qualidade Formal** (Estratégia Shift-Left, Matriz de Riscos e Especificações BDD/Gherkin rastreáveis).

---

## 2. Arquitetura do Projeto

```text
mobile-qa/
├── .github/workflows/
│   └── e2e.yml                      # Pipeline CI/CD com emulador Android headless + aceleração KVM
├── apps/
│   └── demo-app.apk                 # Binário Android sob teste (Sauce Labs My Demo App RN)
├── docs/
│   ├── TEST_STRATEGY.md             # Estratégia Shift-Left, Pirâmide Mobile e Mitigação de Flakiness
│   ├── RISK_MATRIX.md               # Matriz Probabilidade x Impacto (RSK-01 a RSK-07)
│   └── TEST_CASES.md                # Especificações formais em Gherkin/BDD e Matriz de Rastreabilidade
├── test/
│   ├── pageobjects/
│   │   ├── Page.ts                  # Abstração base: esperas explícitas, W3C Scroll e Backgrounding
│   │   ├── CatalogPage.ts           # Encapsulamento do catálogo e pesquisa visual via scroll nativo
│   │   ├── LoginPage.ts             # Encapsulamento do fluxo de autenticação
│   │   └── ProductDetailsPage.ts    # Encapsulamento de detalhes do produto, contador e badge do carrinho
│   └── specs/
│       ├── app.spec.ts              # Smoke test de inicialização da aplicação
│       ├── auth.spec.ts             # Cenários E2E de autenticação (sucesso e utilizador bloqueado)
│       └── cart.spec.ts             # Jornada principal de negócio (Catálogo -> Scroll -> Carrinho -> Background)
├── reports/                         # Relatórios JUnit XML gerados automaticamente após cada execução
├── wdio.conf.ts                     # Configuração central do runner WebdriverIO + Appium UiAutomator2
├── tsconfig.json                    # Configuração TypeScript estrita para WebdriverIO Async + Mocha
└── package.json                     # Dependências e scripts de execução rápida
```

---

## 3. Decisões de Engenharia (Diferenciais Sénior)

1. **Zero Esperas Estáticas (`driver.pause` banido nas specs):**
   - Todas as interações passam pela classe base [`Page.ts`](./test/pageobjects/Page.ts), que aplica sincronização explícita (`waitForDisplayed`) acoplada ao estado real da árvore UI do Android.
2. **Priorização de Seletores Multiplataforma (`Accessibility ID`):**
   - Uso preferencial de `~accessibilityId` (`content-desc` no Android / `accessibilityLabel` no iOS), garantindo baixa fragilidade a mudanças estruturais de layout e alinhamento com práticas de acessibilidade.
3. **Gestos Nativos com W3C Actions API (`swipeUp` & `scrollIntoView`):**
   - Em vez de depender de APIs legadas depreciadas (`TouchAction`), o scroll vertical em [`Page.ts`](./test/pageobjects/Page.ts) implementa o protocolo **W3C Pointer Touch Actions** calculando coordenadas relativas ao viewport real (`driver.getWindowRect()`), garantindo compatibilidade entre diferentes densidades de ecrã (DPIs).
4. **Resiliência de Ciclo de Vida Mobile (`driver.background`):**
   - A suíte [`cart.spec.ts`](./test/specs/cart.spec.ts) valida não apenas a mutação de estado na UI, mas a preservação de estado da sessão (Redux/AsyncStorage) quando a Activity sofre interrupção de segundo plano pelo sistema operativo (`RSK-03` e `RSK-05`).
5. **Execução CI/CD Headless com Aceleração por Hardware (KVM):**
   - O workflow [`.github/workflows/e2e.yml`](./.github/workflows/e2e.yml) provisiona um emulador Android API 33 (Pixel 7) com animações de janela desativadas (`disable-animations: true`) para eliminar _flakiness_ de renderização e recolhe relatórios **JUnit XML** e logs do Appium como artefactos.

---

## 4. Comandos de Execução Rápida

### Pré-requisitos Locais

- **Android SDK** com emulador ativo (`adb devices` listando `emulator-5554`).
- **Servidor Appium 2.x** em execução na porta `4723` (`npx appium`).

### Executar Suítes de Teste (a partir da pasta `mobile-qa/`)

```bash
# Executar toda a suíte E2E (App + Auth + Cart)
npm test

# Executar apenas a suíte de Autenticação (MOB-001 e MOB-002)
npm run test:auth

# Executar apenas a jornada E2E de Catálogo, Carrinho, Scroll W3C e Resiliência Background (MOB-003)
npm run test:cart

# Executar smoke test de arranque da aplicação
npm run test:app
```

---

## 5. Governança e Rastreabilidade de Qualidade

| ID Teste    | Especificação                             | Cenário Validado                                                                                                         | Risco Mitigado               | Status   |
| :---------- | :---------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- | :--------------------------- | :------- |
| **MOB-001** | `auth.spec.ts`(./test/specs/auth.spec.ts) | Login com sucesso (`bob@example.com`) e redirecionamento ao catálogo                                                     | `RSK-01`                     | Passando |
| **MOB-002** | `auth.spec.ts`(./test/specs/auth.spec.ts) | Bloqueio de acesso e validação de mensagem para conta bloqueada (`alice@example.com`)                                    | `RSK-01`                     | Passando |
| **MOB-003** | `cart.spec.ts`(./test/specs/cart.spec.ts) | Scroll nativo W3C no catálogo, incremento para 2 unidades, adição ao carrinho e persistência após `driver.background(3)` | `RSK-03`, `RSK-05`, `RSK-06` | Passando |

Consulte a documentação detalhada em:

- [`docs/TEST_STRATEGY.md`](./docs/TEST_STRATEGY.md)
- [`docs/RISK_MATRIX.md`](./docs/RISK_MATRIX.md)
- [`docs/TEST_CASES.md`](./docs/TEST_CASES.md)
