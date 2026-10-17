# Mobile Quality Risk Assessment & Mitigation Matrix

## 1. Risk Evaluation Methodology

Risks are evaluated using a qualitative 2D scoring matrix factoring **Probability** (Likelihood of occurrence) and **Impact** (Severity on business, user trust, or system stability).

$$\text{Risk Level} = \text{Probability} \times \text{Impact}$$

- **Probability:** Low (1), Medium (2), High (3)
- **Impact:** Minor (1), Major (2), Critical (3)
- **Classification:** Low (1–2), Medium (3–4), High (6), Critical (9)

---

## 2. Risk Matrix

|  Risk ID   | Feature / Component         | Identified Risk Description                                                                                   |    Impact    |   Prob.    |   Risk Level   | Mitigation & Automation Strategy                                                                                             |
| :--------: | :-------------------------- | :------------------------------------------------------------------------------------------------------------ | :----------: | :--------: | :------------: | :--------------------------------------------------------------------------------------------------------------------------- |
| **RSK-01** | **Authentication**          | Brute force or session token leakage across app backgrounding / foregrounding.                                | Critical (3) | Medium (2) |  **High (6)**  | Validate secure storage integration, verify automatic session invalidation upon credential failure (`auth.spec.ts`).         |
| **RSK-02** | **Catalog / Inventory**     | Inconsistent catalog synchronization when switching between network states (Airplane mode/cellular).          |  Major (2)   |  High (3)  |  **High (6)**  | Network virtualization tests (offline caching & retry validation) via Appium Network Connection APIs.                        |
| **RSK-03** | **Cart & Checkout**         | Cart state mutation race conditions: adding/removing items simultaneously leads to incorrect total badge/sum. | Critical (3) | Medium (2) |  **High (6)**  | E2E synchronization assertions verifying cart badge updates after sequential mutations (`cart.spec.ts`).                     |
| **RSK-04** | **Device Compatibility**    | Visual truncation or unclickable touch targets across non-standard aspect ratios and DPIs.                    |  Major (2)   |  High (3)  |  **High (6)**  | Cross-device matrix validation on multiple Android API levels (API 30, 33, 34) and small vs large viewport emulators.        |
| **RSK-05** | **App Lifecycle**           | App crash or loss of state when killed in background by Android OS low-memory killer (LMK).                   |  Major (2)   |  Low (1)   | **Medium (2)** | Simulate activity destruction and verify state rehydration using `mobile: backgroundApp`.                                    |
| **RSK-06** | **Performance & Rendering** | High frame drops (jank) and memory leaks during infinite scrolling of catalog items.                          |  Major (2)   | Medium (2) | **Medium (4)** | Perform automated profiling (Systrace / Android Profiler) and UI scrolling benchmarks using W3C gesture actions.             |
| **RSK-07** | **Test Flakiness**          | Asynchronous animations in React Native causing false-negative test failures in CI.                           |  Minor (1)   |  High (3)  | **Medium (3)** | Enforce explicit element visibility predicates (`waitForDisplayed`) and disable emulator window animations via adb commands. |

---

## 3. Mitigation Execution & Traceability

### High-Priority Focus for Automation (Sprint / Milestone Scope):

- **RSK-01 & RSK-03** are directly covered by our automated suites (`test/specs/auth.spec.ts` and `test/specs/cart.spec.ts`).
- **RSK-07** is mitigated at the architectural level in `Page.ts` via dynamic wait abstractions, preventing brittle pipeline runs.
