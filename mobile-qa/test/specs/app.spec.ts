import CatalogPage from "../pageobjects/CatalogPage";

describe("Verificação da Aplicação - My Demo App", () => {
  it("deve arrancar a aplicação e apresentar o ecrã inicial de catálogo", async () => {
    await CatalogPage.waitForIsDisplayed(CatalogPage.catalogTitle);
    await expect(CatalogPage.catalogTitle).toBeDisplayed();
  });
});
