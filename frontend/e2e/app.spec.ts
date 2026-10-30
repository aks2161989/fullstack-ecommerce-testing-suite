import { test, expect } from "./fixtures/testFixtures";
import {
  CATEGORY_TEST_CASES,
  NAV_LINK_TEST_CASES,
  SIDEBAR_SWITCH_TEST_CASES,
  TEST_USERS,
} from "./fixtures/testData";

// ==========================================
// 1. App Shell & Header Navigation
// ==========================================
test.describe("App Shell and Header Navigation", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("should render brand logo, navigation links, and initial cart badge", async ({
    header,
  }) => {
    await expect(header.logo).toBeVisible();
    await expect(header.navShopLink).toBeVisible();
    await expect(header.navSignInLink).toBeVisible();
    await expect(header.cartIcon).toBeVisible();
    await expect(header.cartItemCount).toHaveText("0");
  });

  // Data-Driven Header Links
  for (const navCase of NAV_LINK_TEST_CASES) {
    test(`should navigate correctly via header link: ${navCase.name}`, async ({
      page,
      header,
    }) => {
      const link = header.getNavLink(navCase.name);
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(new RegExp(navCase.expectedPath));
    });
  }

  test("should return to home page when clicking brand logo", async ({
    page,
    shopPage,
    header,
  }) => {
    await shopPage.goto();
    await header.clickLogo();
    await expect(page).toHaveURL(/\/$/);
  });
});

// ==========================================
// 2. Homepage Directory Categories (Data-Driven)
// ==========================================
test.describe("Homepage Directory Categories (Data-Driven)", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  for (const category of CATEGORY_TEST_CASES) {
    test(`should navigate to ${category.title} and render products`, async ({
      page,
      homePage,
      shopPage,
    }) => {
      const categoryButton = homePage.getCategoryButton(category.title);
      await expect(categoryButton).toBeVisible();
      await categoryButton.click();

      // Verify routing
      await expect(page).toHaveURL(new RegExp(category.expectedUrl));

      // Verify products are loaded and displayed as articles (web-first assertion)
      await expect(shopPage.productCards.first()).toBeVisible({ timeout: 5000 });
      await expect(shopPage.productCards).not.toHaveCount(0);
    });
  }
});

// ==========================================
// 3. Shop Sidebar Category Navigation (Data-Driven)
// ==========================================
test.describe("Shop Sidebar Category Switching (Data-Driven)", () => {
  for (const switchCase of SIDEBAR_SWITCH_TEST_CASES) {
    test(`should switch from ${switchCase.fromCategory} to ${switchCase.toCategory} via sidebar`, async ({
      page,
      shopPage,
    }) => {
      await shopPage.goto(`/shop/${switchCase.fromCategory}`);
      await expect(shopPage.productCards.first()).toBeVisible();

      // Click next category in sidebar
      await shopPage.selectSidebarCategory(switchCase.toCategory);

      // Verify URL changes and product list updates
      await expect(page).toHaveURL(new RegExp(switchCase.expectedUrl));
      await expect(shopPage.productCards.first()).toBeVisible();
    });
  }
});

// ==========================================
// 4. Mini-Cart Dropdown & Cart Counter
// ==========================================
test.describe("Shopping Cart Workflows", () => {
  test("should toggle empty cart dropdown and display empty status", async ({
    homePage,
    header,
    cartDropdown,
  }) => {
    await homePage.goto();

    await header.toggleCart();
    await expect(cartDropdown.cartDropdown).toBeVisible();
    await expect(cartDropdown.emptyCartMessage).toHaveText(/your cart is empty/i);
    await expect(cartDropdown.checkoutButton).toBeVisible();

    // Toggle close
    await header.toggleCart();
    await expect(cartDropdown.cartDropdown).not.toBeVisible();
  });

  test("should add product to cart, update badge count, and display item in dropdown", async ({
    shopPage,
    header,
    cartDropdown,
  }) => {
    await shopPage.goto("/shop/hats");

    await expect(shopPage.productCards.first()).toBeVisible();
    await shopPage.addFirstProductToCart();

    // Verify badge increment
    await expect(header.cartItemCount).toHaveText("1");

    // Verify item in dropdown
    await header.toggleCart();
    await expect(cartDropdown.cartDropdown).toBeVisible();
    await expect(cartDropdown.emptyCartMessage).not.toBeVisible();
  });
});

// ==========================================
// 5. Authentication & User Accounts (/signin)
// ==========================================
test.describe("User Authentication & Account Management", () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.goto();
  });

  test("should render sign in and sign up forms with accessible fields", async ({
    authPage,
  }) => {
    await expect(authPage.signInHeading).toBeVisible();
    await expect(authPage.signInEmailInput).toBeVisible();
    await expect(authPage.signInPasswordInput).toBeVisible();
    await expect(authPage.signInSubmitButton).toBeVisible();
    await expect(authPage.googleSignInButton).toBeVisible();

    await expect(authPage.signUpHeading).toBeVisible();
    await expect(authPage.signUpDisplayNameInput).toBeVisible();
    await expect(authPage.signUpEmailInput).toBeVisible();
    await expect(authPage.signUpPasswordInput).toBeVisible();
    await expect(authPage.signUpConfirmPasswordInput).toBeVisible();
    await expect(authPage.signUpSubmitButton).toBeVisible();
  });

  test("should alert when passwords do not match during registration", async ({
    authPage,
  }) => {
    const alertMessage = await authPage.signUpExpectingAlert(
      TEST_USERS.validUser.name,
      TEST_USERS.validUser.email,
      "Password123!",
      "DifferentPassword!"
    );

    expect(alertMessage.toLowerCase()).toContain("not match");
  });

  test("should allow submitting valid registration form with matching credentials", async ({
    page,
    authPage,
  }) => {
    const newCredentials = {
      name: "Alice Walker",
      email: `alice_${Date.now()}@example.com`,
      password: "SecurePassword123!",
    };

    await authPage.signUp(
      newCredentials.name,
      newCredentials.email,
      newCredentials.password,
      newCredentials.password
    );

    // Form submits cleanly and user remains on auth or redirects cleanly
    await expect(authPage.signUpHeading).toBeVisible();
  });

  test("should successfully sign in, show logout in navbar, and allow logging out", async ({
    page,
    authPage,
    header,
  }) => {
    await authPage.signIn(
      TEST_USERS.validUser.email,
      TEST_USERS.validUser.password
    );

    // Redirects to /shop after sign in
    await expect(page).toHaveURL(/\/shop/);

    // Navbar should now show LOGOUT button instead of SIGN/SIGNUP
    await expect(header.logoutButton).toBeVisible();
    await expect(header.navSignInLink).not.toBeVisible();

    // Clicking logout restores guest state
    await header.clickLogout();
    await expect(header.navSignInLink).toBeVisible();
    await expect(header.logoutButton).not.toBeVisible();
  });
});

// ==========================================
// 6. Route Guarding (PrivateRoute)
// ==========================================
test.describe("Route Guarding (/checkout)", () => {
  test("should redirect unauthenticated visitor from /checkout to /signin", async ({
    page,
    checkoutPage,
  }) => {
    await checkoutPage.goto();
    await expect(page).toHaveURL(/\/signin/);
  });

  test("should allow authenticated user to access /checkout", async ({
    page,
    authPage,
    checkoutPage,
  }) => {
    await authPage.goto();
    await authPage.signIn(
      TEST_USERS.validUser.email,
      TEST_USERS.validUser.password
    );
    await expect(page).toHaveURL(/\/shop/);

    await checkoutPage.goto();
    await expect(page).toHaveURL(/\/checkout/);
    await expect(checkoutPage.checkoutContainer).toBeVisible();
  });
});

// ==========================================
// 7. Checkout Page Operations & Calculations
// ==========================================
test.describe("Checkout Page Workflow & Calculations", () => {
  test("should support adding items, quantity increment/decrement, line removal, and Stripe payment", async ({
    page,
    authPage,
    shopPage,
    checkoutPage,
    header,
    cartDropdown,
  }) => {
    // 1. Sign in to enable access to /checkout
    await authPage.goto();
    await authPage.signIn(
      TEST_USERS.validUser.email,
      TEST_USERS.validUser.password
    );
    await expect(page).toHaveURL(/\/shop/);

    // 2. Add an item from /shop/hats
    await shopPage.goto("/shop/hats");
    await expect(shopPage.productCards.first()).toBeVisible();

    // First hat is "Brown Brim" ($25)
    await shopPage.addFirstProductToCart();
    await expect(header.cartItemCount).toHaveText("1");

    // 3. Navigate to checkout via cart dropdown
    await header.toggleCart();
    await cartDropdown.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    await expect(checkoutPage.checkoutContainer).toBeVisible();
    await expect(checkoutPage.totalPrice).toHaveText(/TOTAL : \$25/);

    // 4. Increase quantity -> quantity 2, total $50
    await checkoutPage.increaseQuantity("Brown Brim");
    await expect(checkoutPage.getQuantityValue("Brown Brim")).toHaveText("2");
    await expect(checkoutPage.totalPrice).toHaveText(/TOTAL : \$50/);

    // 5. Decrease quantity -> quantity 1, total $25
    await checkoutPage.decreaseQuantity("Brown Brim");
    await expect(checkoutPage.getQuantityValue("Brown Brim")).toHaveText("1");
    await expect(checkoutPage.totalPrice).toHaveText(/TOTAL : \$25/);

    // 6. Stripe Pay Now button triggers payment alert (encapsulated POM action)
    const alertMessage = await checkoutPage.payWithStripe();
    expect(alertMessage.toLowerCase()).toContain("successful");

    // 7. Remove item -> row is removed, total $0
    await checkoutPage.removeItem("Brown Brim");
    await expect(checkoutPage.getCheckoutItem("Brown Brim")).not.toBeVisible();
    await expect(checkoutPage.totalPrice).toHaveText(/TOTAL : \$0/);
  });

  test("should handle multi-item purchases and display all line items in checkout", async ({
    page,
    authPage,
    shopPage,
    checkoutPage,
    header,
    cartDropdown,
  }) => {
    // 1. Sign in
    await authPage.goto();
    await authPage.signIn(
      TEST_USERS.validUser.email,
      TEST_USERS.validUser.password
    );
    await expect(page).toHaveURL(/\/shop/);

    // 2. Add first item from hats (Brown Brim, $25)
    await shopPage.goto("/shop/hats");
    await expect(shopPage.productCards.first()).toBeVisible();
    await shopPage.addFirstProductToCart();

    // 3. Switch to jackets and add first jacket (Black Jean Shearling, $125)
    await shopPage.selectSidebarCategory("jackets");
    await expect(page).toHaveURL(/\/shop\/jackets/);
    await expect(shopPage.productCards.first()).toBeVisible();
    await shopPage.addFirstProductToCart();

    // 4. Cart icon badge should now show 2
    await expect(header.cartItemCount).toHaveText("2");

    // 5. Open dropdown and proceed to checkout
    await header.toggleCart();
    await expect(cartDropdown.cartDropdown).toBeVisible();
    await cartDropdown.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    // 6. Verify checkout displays both line items and calculated total
    await expect(checkoutPage.checkoutContainer).toBeVisible();
    await expect(checkoutPage.checkoutItems).toHaveCount(2);
    // 25 + 125 = 150
    await expect(checkoutPage.totalPrice).toHaveText(/TOTAL : \$150/);
  });
});

// ==========================================
// 8. Footer Component
// ==========================================
test.describe("Footer Component", () => {
  test("should display copyright information across pages", async ({
    homePage,
    footer,
  }) => {
    await homePage.goto();
    await expect(footer.footer).toBeVisible();
    await expect(footer.copyrightText).toBeVisible();
  });
});
