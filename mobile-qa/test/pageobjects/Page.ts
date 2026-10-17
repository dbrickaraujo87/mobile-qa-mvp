import type { ChainablePromiseElement } from "webdriverio";

export default class Page {
  async waitForIsDisplayed(
    element: ChainablePromiseElement,
    timeout = 10000,
  ): Promise<void> {
    await element.waitForDisplayed({ timeout });
  }

  async click(element: ChainablePromiseElement): Promise<void> {
    await this.waitForIsDisplayed(element);
    await element.click();
  }

  async setValue(
    element: ChainablePromiseElement,
    value: string,
  ): Promise<void> {
    await this.waitForIsDisplayed(element);
    await element.setValue(value);
  }

  /**
   * Executa scroll vertical nativo usando W3C WebDriver Actions API (Pointer Touch)
   * para encontrar elementos abaixo da dobra do ecrã com determinismo.
   */
  async swipeUp(percentage = 0.5): Promise<void> {
    const { width, height } = await driver.getWindowRect();
    const anchorX = Math.floor(width * 0.5);
    const startY = Math.floor(height * 0.75);
    const endY = Math.floor(height * (0.75 - percentage));

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: anchorX, y: startY },
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 100 },
          { type: "pointerMove", duration: 500, x: anchorX, y: endY },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();
  }

  /**
   * Realiza scroll vertical incremental até o elemento ficar visível no viewport
   * ou atingir o limite máximo de tentativas (evita loops infinitos).
   */
  async scrollIntoView(
    element: ChainablePromiseElement,
    maxScrolls = 5,
  ): Promise<void> {
    for (let attempt = 0; attempt < maxScrolls; attempt++) {
      if (await element.isDisplayed()) {
        return;
      }
      await this.swipeUp();
    }
    await this.waitForIsDisplayed(element);
  }

  /**
   * Simula interrupção de ciclo de vida enviando a app para background e retomando ao foreground.
   */
  async sendAppToBackground(seconds = 3): Promise<void> {
    await driver.background(seconds);
  }
}
