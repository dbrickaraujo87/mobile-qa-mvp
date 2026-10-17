import Page from "./Page";

class ProductDetailsPage extends Page {
  // Locators usando Accessibility ID (content-desc no Android RN)
  get productTitle() {
    return $("~container header");
  }

  get productPrice() {
    return $("~product price");
  }

  get addToCartButton() {
    return $("~Add To Cart button");
  }

  get cartBadge() {
    return $("~cart badge");
  }

  get cartBadgeCount() {
    return $('//*[@content-desc="cart badge"]//android.widget.TextView');
  }

  get counterPlusButton() {
    return $("~counter plus button");
  }

  public async addToCart(quantity: number = 1): Promise<void> {
    await this.scrollIntoView(this.addToCartButton);
    if (quantity > 1) {
      for (let i = 1; i < quantity; i++) {
        await this.click(this.counterPlusButton);
      }
    }
    await this.click(this.addToCartButton);
  }

  public async getCartItemCount(): Promise<string> {
    await this.waitForIsDisplayed(this.cartBadgeCount, 5000);
    return this.cartBadgeCount.getText();
  }
}

export default new ProductDetailsPage();
