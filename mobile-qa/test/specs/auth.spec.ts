import CatalogPage from "../pageobjects/CatalogPage";
import LoginPage from "../pageobjects/LoginPage";

describe("Suíte de Autenticação Mobile (E2E)", () => {
  beforeEach(async () => {
    // Abre o menu lateral e entra na tela de login
    await CatalogPage.openLoginMenu();
  });

  it("MOB-002: deve apresentar erro para um usuário bloqueado", async () => {
    await LoginPage.login("alice@example.com", "10203040");
    await expect(LoginPage.errorMessage).toBeDisplayed();
  });

  it("MOB-001: deve efetuar login com sucesso e regressar ao catálogo", async () => {
    // Credencial padrão da aplicação: bob@example.com / 10203040
    await LoginPage.login("bob@example.com", "10203040");
    await expect(CatalogPage.catalogTitle).toBeDisplayed();
  });
});
