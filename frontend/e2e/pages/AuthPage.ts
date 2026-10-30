import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AuthPage extends BasePage {
  readonly signInSection: Locator;
  readonly signInHeading: Locator;
  readonly signInEmailInput: Locator;
  readonly signInPasswordInput: Locator;
  readonly signInSubmitButton: Locator;
  readonly googleSignInButton: Locator;

  readonly signUpSection: Locator;
  readonly signUpHeading: Locator;
  readonly signUpDisplayNameInput: Locator;
  readonly signUpEmailInput: Locator;
  readonly signUpPasswordInput: Locator;
  readonly signUpConfirmPasswordInput: Locator;
  readonly signUpSubmitButton: Locator;

  constructor(page: Page) {
    super(page);

    // Sign In Section - Accessible Region Role
    this.signInSection = page.getByRole("region", { name: "Sign In" });
    this.signInHeading = this.signInSection.getByRole("heading", {
      name: /i already have an account/i,
    });
    this.signInEmailInput = this.signInSection.getByLabel("Email");
    this.signInPasswordInput = this.signInSection.getByLabel("Password");
    this.signInSubmitButton = this.signInSection.getByRole("button", {
      name: "SIGN IN",
      exact: true,
    });
    this.googleSignInButton = this.signInSection.getByRole("button", {
      name: /google/i,
    });

    // Sign Up Section - Accessible Region Role
    this.signUpSection = page.getByRole("region", { name: "Sign Up" });
    this.signUpHeading = this.signUpSection.getByRole("heading", {
      name: /i don't have an account/i,
    });
    this.signUpDisplayNameInput = this.signUpSection.getByLabel("Display Name");
    this.signUpEmailInput = this.signUpSection.getByLabel("Email");
    this.signUpPasswordInput = this.signUpSection.getByLabel("Password", {
      exact: true,
    });
    this.signUpConfirmPasswordInput =
      this.signUpSection.getByLabel("Confirm Password");
    this.signUpSubmitButton = this.signUpSection.getByRole("button", {
      name: "SIGN UP",
      exact: true,
    });
  }

  async goto(): Promise<void> {
    await this.page.goto("/signin", { waitUntil: "domcontentloaded" });
  }

  async signIn(
    credentialsOrEmail: string | { email: string; password?: string; pass?: string },
    password?: string
  ): Promise<void> {
    const email =
      typeof credentialsOrEmail === "object"
        ? credentialsOrEmail.email
        : credentialsOrEmail;
    const pass =
      typeof credentialsOrEmail === "object"
        ? credentialsOrEmail.password || credentialsOrEmail.pass || ""
        : password || "";

    await this.signInEmailInput.fill(email);
    await this.signInPasswordInput.fill(pass);
    await this.signInSubmitButton.click();
  }

  async signUp(
    userOrName:
      | string
      | {
          name?: string;
          displayName?: string;
          email: string;
          password?: string;
          pass?: string;
          confirmPassword?: string;
          confirmPass?: string;
        },
    email?: string,
    pass?: string,
    confirmPass?: string
  ): Promise<void> {
    const nameVal =
      typeof userOrName === "object"
        ? userOrName.displayName || userOrName.name || ""
        : userOrName;
    const emailVal =
      typeof userOrName === "object" ? userOrName.email : email || "";
    const passVal =
      typeof userOrName === "object"
        ? userOrName.password || userOrName.pass || ""
        : pass || "";
    const confirmVal =
      typeof userOrName === "object"
        ? userOrName.confirmPassword || userOrName.confirmPass || passVal
        : confirmPass || "";

    await this.signUpDisplayNameInput.fill(nameVal);
    await this.signUpEmailInput.fill(emailVal);
    await this.signUpPasswordInput.fill(passVal);
    await this.signUpConfirmPasswordInput.fill(confirmVal);
    await this.signUpSubmitButton.click();
  }

  async signUpExpectingAlert(
    userOrName:
      | string
      | {
          name?: string;
          displayName?: string;
          email: string;
          password?: string;
          pass?: string;
          confirmPassword?: string;
          confirmPass?: string;
        },
    email?: string,
    pass?: string,
    confirmPass?: string
  ): Promise<string> {
    return new Promise<string>((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
      this.signUp(userOrName, email, pass, confirmPass);
    });
  }
}
