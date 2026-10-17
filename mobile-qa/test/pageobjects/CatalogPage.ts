import Page from "./Page";

class CatalogPage extends Page {
  get menuButton() {
    return $("~open menu");
  }

  get menuItemLogin() {
    return $("~menu item log in");
  }

  get catalogTitle() {
    return $('//android.widget.TextView[@text="Products"]');
  }

  get firstProductItem() {
    return $('(//*[@content-desc="store item"])[1]');
  }

  productByText(productName: string) {
    return $(
      `//*[@content-desc="store item text" and @text="${productName}"]`,
    );
  }

  public async selectFirstProduct(): Promise<void> {
    await this.waitForIsDisplayed(this.catalogTitle);
    await this.click(this.firstProductItem);
  }

  public async selectProductByName(productName: string): Promise<void> {
    await this.waitForIsDisplayed(this.catalogTitle);
    const product = this.productByText(productName);
    await this.scrollIntoView(product);
    await this.click(product);
  }

  async openLoginMenu(): Promise<void> {
    await this.click(this.menuButton);
    await this.click(this.menuItemLogin);
  }
}

export default new CatalogPage();
