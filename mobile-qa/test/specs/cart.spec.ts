import CatalogPage from "../pageobjects/CatalogPage";
import ProductDetailsPage from "../pageobjects/ProductDetailsPage";

describe("Fluxo Principal de Negócio E2E - Catálogo, Carrinho e Resiliência Mobile", () => {
  it("MOB-003: deve selecionar produto abaixo da dobra via scroll nativo W3C, alterar quantidade para 2, adicionar ao carrinho e persistir estado após backgrounding", async () => {
    // 1. Seleciona um produto abaixo da dobra do ecrã ("Sauce Labs Onesie") exercitando W3C Pointer Touch Scroll
    await CatalogPage.selectProductByName("Sauce Labs Onesie");

    // 2. Valida que a tela de detalhes do produto carregou sem esperas estáticas
    await expect(ProductDetailsPage.productTitle).toBeDisplayed();

    // 3. Incrementa quantidade para 2 unidades e adiciona ao carrinho
    await ProductDetailsPage.addToCart(2);

    // 4. Valida atualização imediata do contador (badge) do carrinho para "2"
    const initialBadgeCount = await ProductDetailsPage.getCartItemCount();
    expect(initialBadgeCount).toBe("2");

    // 5. Resiliência Mobile (RSK-03 / RSK-05): envia a app para segundo plano por 3s e retoma ao foreground
    await ProductDetailsPage.sendAppToBackground(3);

    // 6. Valida persistência de estado do carrinho após retomar do background
    const persistedBadgeCount = await ProductDetailsPage.getCartItemCount();
    expect(persistedBadgeCount).toBe("2");
  });
});
