import Page from "./Page";

class LoginPage extends Page {
  get usernameInput() {
    return $("~Username input field");
  }

  get passwordInput() {
    return $("~Password input field");
  }

  get loginButton() {
    return $("~Login button");
  }

  get errorMessage() {
    return $("~generic-error-message");
  }

  async login(username: string, password: string): Promise<void> {
    await this.setValue(this.usernameInput, username);
    await this.setValue(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}

export default new LoginPage();
