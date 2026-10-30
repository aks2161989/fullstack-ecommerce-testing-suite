/**
 * Centralized Data-Driven Test Fixtures for Frontend Unit Tests
 */

export const MOCK_CART_ITEMS = {
  hat: {
    _id: "hat_001",
    name: "Brown Brim",
    price: 25,
    imageUrl: "https://i.ibb.co/ZYW3VTp/brown-brim.png",
  },
  beanie: {
    _id: "beanie_002",
    name: "Blue Beanie",
    price: 18,
    imageUrl: "https://i.ibb.co/ypkgK0X/blue-beanie.png",
  },
  jacket: {
    _id: "jacket_003",
    name: "Black Jean Jacket",
    price: 90,
    imageUrl: "https://i.ibb.co/XzCwL5s/black-shearling.png",
  },
};

export const CART_UTILS_ADD_CASES = [
  {
    scenario: "adding a brand new item to an empty cart",
    initialItems: [],
    itemToAdd: MOCK_CART_ITEMS.hat,
    expectedCount: 1,
    expectedItems: [{ ...MOCK_CART_ITEMS.hat, quantity: 1 }],
  },
  {
    scenario: "adding a second distinct item to an existing cart",
    initialItems: [{ ...MOCK_CART_ITEMS.hat, quantity: 1 }],
    itemToAdd: MOCK_CART_ITEMS.beanie,
    expectedCount: 2,
    expectedItems: [
      { ...MOCK_CART_ITEMS.hat, quantity: 1 },
      { ...MOCK_CART_ITEMS.beanie, quantity: 1 },
    ],
  },
  {
    scenario: "incrementing an already existing item quantity in cart",
    initialItems: [
      { ...MOCK_CART_ITEMS.hat, quantity: 1 },
      { ...MOCK_CART_ITEMS.beanie, quantity: 2 },
    ],
    itemToAdd: MOCK_CART_ITEMS.hat,
    expectedCount: 2,
    expectedItems: [
      { ...MOCK_CART_ITEMS.hat, quantity: 2 },
      { ...MOCK_CART_ITEMS.beanie, quantity: 2 },
    ],
  },
];

export const CART_UTILS_REMOVE_CASES = [
  {
    scenario: "decrementing item quantity when current quantity > 1",
    initialItems: [{ ...MOCK_CART_ITEMS.hat, quantity: 3 }],
    itemToRemove: MOCK_CART_ITEMS.hat,
    expectedCount: 1,
    expectedQuantity: 2,
  },
  {
    scenario: "decrementing item quantity when current quantity === 2",
    initialItems: [
      { ...MOCK_CART_ITEMS.hat, quantity: 2 },
      { ...MOCK_CART_ITEMS.beanie, quantity: 1 },
    ],
    itemToRemove: MOCK_CART_ITEMS.hat,
    expectedCount: 2,
    expectedQuantity: 1,
  },
  {
    scenario: "removing item completely when current quantity === 1",
    initialItems: [
      { ...MOCK_CART_ITEMS.hat, quantity: 1 },
      { ...MOCK_CART_ITEMS.beanie, quantity: 4 },
    ],
    itemToRemove: MOCK_CART_ITEMS.hat,
    expectedCount: 1,
    expectedRemainingIds: [MOCK_CART_ITEMS.beanie._id],
  },
];

export const CART_SELECTOR_COUNT_CASES = [
  {
    scenario: "empty cart returns 0 count",
    cartItems: [],
    expectedTotalItems: 0,
  },
  {
    scenario: "single item with multiple quantity",
    cartItems: [{ ...MOCK_CART_ITEMS.hat, quantity: 4 }],
    expectedTotalItems: 4,
  },
  {
    scenario: "multiple items with varied quantities",
    cartItems: [
      { ...MOCK_CART_ITEMS.hat, quantity: 2 },
      { ...MOCK_CART_ITEMS.beanie, quantity: 3 },
      { ...MOCK_CART_ITEMS.jacket, quantity: 1 },
    ],
    expectedTotalItems: 6,
  },
];

export const CART_SELECTOR_TOTAL_PRICE_CASES = [
  {
    scenario: "empty cart calculates $0 total price",
    cartItems: [],
    expectedPrice: 0,
  },
  {
    scenario: "single item calculates correct price times quantity",
    cartItems: [{ ...MOCK_CART_ITEMS.hat, quantity: 3 }], // 3 * 25
    expectedPrice: 75,
  },
  {
    scenario: "multiple distinct items calculate combined cumulative price",
    cartItems: [
      { ...MOCK_CART_ITEMS.hat, quantity: 2 }, // 2 * 25 = 50
      { ...MOCK_CART_ITEMS.beanie, quantity: 2 }, // 2 * 18 = 36
      { ...MOCK_CART_ITEMS.jacket, quantity: 1 }, // 1 * 90 = 90
    ],
    expectedPrice: 176,
  },
];

export const MOCK_USERS = {
  customer: {
    id: "usr_cust_001",
    name: "Customer One",
    email: "customer1@example.com",
  },
  admin: {
    id: "usr_admin_002",
    name: "Administrator",
    email: "admin@example.com",
  },
};

export const USER_REDUCER_CASES = [
  {
    scenario: "sets customer user upon authentication",
    initialState: { currentUser: null },
    userPayload: MOCK_USERS.customer,
    expectedUser: MOCK_USERS.customer,
  },
  {
    scenario: "sets administrator user upon authentication",
    initialState: { currentUser: null },
    userPayload: MOCK_USERS.admin,
    expectedUser: MOCK_USERS.admin,
  },
  {
    scenario: "clears current user upon logout (null payload)",
    initialState: { currentUser: MOCK_USERS.customer },
    userPayload: null,
    expectedUser: null,
  },
];

export const PRODUCT_REDUCER_CASES = [
  {
    scenario: "hydrates empty store with fetched product category catalog",
    initialState: { product: [] },
    payload: [
      { id: 1, title: "Hats", routeName: "hats", items: [] },
      { id: 2, title: "Jackets", routeName: "jackets", items: [] },
    ],
    expectedLength: 2,
  },
  {
    scenario: "handles empty product list payload",
    initialState: { product: [{ id: 1, title: "Hats" }] },
    payload: [],
    expectedLength: 0,
  },
];

export const CUSTOM_BUTTON_CASES = [
  {
    scenario: "default standard button styling",
    props: { children: "Standard Button" },
    expectedClasses: ["custom-button"],
    unexpectedClasses: ["inverted", "google-sign-in"],
  },
  {
    scenario: "inverted theme styling",
    props: { inverted: true, children: "Inverted Button" },
    expectedClasses: ["custom-button", "inverted"],
    unexpectedClasses: ["google-sign-in"],
  },
  {
    scenario: "google authentication button styling",
    props: { isGoogleSignIn: true, children: "Google Sign In" },
    expectedClasses: ["custom-button", "google-sign-in"],
    unexpectedClasses: ["inverted"],
  },
  {
    scenario: "both inverted and google authentication styling flags",
    props: { inverted: true, isGoogleSignIn: true, children: "Multi Style" },
    expectedClasses: ["custom-button", "inverted", "google-sign-in"],
    unexpectedClasses: [],
  },
];

export const FORM_INPUT_CASES = [
  {
    scenario: "rendered with non-empty value and label triggers shrink class",
    props: {
      label: "Customer Email",
      name: "email",
      value: "user@example.com",
    },
    hasLabel: true,
    expectedLabelText: "Customer Email",
    shouldShrink: true,
  },
  {
    scenario: "rendered with empty value and label does not shrink",
    props: {
      label: "Customer Password",
      name: "password",
      value: "",
    },
    hasLabel: true,
    expectedLabelText: "Customer Password",
    shouldShrink: false,
  },
  {
    scenario: "rendered without label omits label element and uses explicit id",
    props: {
      name: "query",
      id: "search-input-id",
      value: "sneakers",
    },
    hasLabel: false,
    expectedId: "search-input-id",
    shouldShrink: false,
  },
];

export const CART_ITEM_DISPLAY_CASES = [
  {
    item: {
      _id: "ci_1",
      name: "Brown Brim",
      imageUrl: "https://i.ibb.co/ZYW3VTp/brown-brim.png",
      price: 25,
      quantity: 3,
    },
    expectedPriceText: "3 X $25",
  },
  {
    item: {
      _id: "ci_2",
      name: "Black Jean Jacket",
      imageUrl: "https://i.ibb.co/XzCwL5s/black-shearling.png",
      price: 90,
      quantity: 1,
    },
    expectedPriceText: "1 X $90",
  },
];

export const PRIVATE_ROUTE_AUTH_CASES = [
  {
    scenario: "authenticated customer accesses protected route",
    authenticatedUser: MOCK_USERS.customer,
    expectAccess: true,
  },
  {
    scenario: "authenticated administrator accesses protected route",
    authenticatedUser: MOCK_USERS.admin,
    expectAccess: true,
  },
  {
    scenario: "unauthenticated visitor is denied and redirected to signin",
    authenticatedUser: null,
    expectAccess: false,
  },
];


// ==========================================
// Centralized Data Fixtures for All UI Tests
// ==========================================

export const CART_DROPDOWN_CASES = [
  {
    scenario: "empty cart",
    cartItems: [],
    expectEmptyMessage: true,
  },
  {
    scenario: "single item populated in cart",
    cartItems: [
      {
        _id: "ci_dropdown_1",
        name: "Brown Brim",
        price: 25,
        quantity: 2,
        imageUrl: "https://i.ibb.co/ZYW3VTp/brown-brim.png",
      },
    ],
    expectEmptyMessage: false,
    expectedItemName: "Brown Brim",
  },
];

export const CHECKOUT_ITEM_CASES = [
  {
    scenario: "winter jacket line item",
    cartItem: {
      _id: "c_1",
      name: "Winter Jacket",
      imageUrl: "jacket.png",
      price: 120,
      quantity: 3,
    },
    expectedPriceText: "$ 120",
  },
  {
    scenario: "sneakers line item",
    cartItem: {
      _id: "c_2",
      name: "Runner Sneakers",
      imageUrl: "sneaker.png",
      price: 85,
      quantity: 1,
    },
    expectedPriceText: "$ 85",
  },
];

export const DIRECTORY_ITEM_CASES = [
  {
    scenario: "hats directory card",
    item: {
      title: "hats",
      imageUrl: "https://i.ibb.co/cvpntL1/hats.png",
      linkUrl: "shop/hats",
    },
    expectedButtonName: "hats",
  },
  {
    scenario: "jackets directory card",
    item: {
      title: "jackets",
      imageUrl: "https://i.ibb.co/px2tCc3/jackets.png",
      linkUrl: "shop/jackets",
    },
    expectedButtonName: "jackets",
  },
];

export const FOOTER_CASES = [
  {
    expectedCopyrightPattern: /Copyrights © 2020/i,
    authorName: "Ajay",
    authorUrl: "https://www.linkedin.com/in/ajay-meena1/",
  },
];

export const NAV_LINK_CASES = [
  {
    scenario: "category link to hats",
    to: "/shop/hats",
    text: "Hats Category",
  },
  {
    scenario: "category link to sneakers",
    to: "/shop/sneakers",
    text: "Sneakers Category",
  },
];

export const MAIN_NAVIGATION_CASES = [
  {
    scenario: "unauthenticated user state",
    currentUser: null,
    expectedVisibleLinks: ["SHOP", "SIGN/SIGNUP"],
    expectedHiddenRole: "Log Out",
  },
  {
    scenario: "authenticated customer user state",
    currentUser: { id: "u_nav_1", name: "Alice" },
    expectedVisibleLinks: ["SHOP"],
    expectedVisibleButton: "Log Out",
    expectedHiddenText: "SIGN/SIGNUP",
  },
];

export const SHOP_ITEM_CARD_CASES = [
  {
    scenario: "red sneakers card",
    item: {
      _id: "prod_123",
      name: "Red Sneakers",
      price: 110,
      imageUrl: "sneakers.jpg",
    },
  },
  {
    scenario: "blue beanie card",
    item: {
      _id: "prod_456",
      name: "Blue Beanie",
      price: 18,
      imageUrl: "beanie.jpg",
    },
  },
];

export const SHOP_ITEMS_CASES = [
  {
    scenario: "valid hats category with multiple items",
    category: {
      id: 1,
      title: "Hats",
      routeName: "hats",
      items: [
        { _id: "h1", name: "Brown Brim", price: 25, imageUrl: "hat.png" },
        { _id: "h2", name: "Blue Beanie", price: 18, imageUrl: "beanie.png" },
      ],
    },
    catParam: "hats",
    expectedItemNames: ["Brown Brim", "Blue Beanie"],
    expectedItemCount: 2,
  },
  {
    scenario: "empty products list gracefully renders no articles",
    category: null,
    catParam: null,
    expectedItemNames: [],
    expectedItemCount: 0,
  },
  {
    scenario: "category with numeric id fallback instead of _id",
    category: {
      id: 2,
      routeName: "sneakers",
      items: [{ id: "sneaker_1", name: "Runner", price: 110, imageUrl: "run.png" }],
    },
    catParam: "sneakers",
    expectedItemNames: ["Runner"],
    expectedItemCount: 1,
  },
];

export const SIGN_IN_FORM_CASES = [
  {
    scenario: "valid customer login input",
    credentials: {
      email: "customer@example.com",
      password: "CustomerPassword123!",
    },
  },
  {
    scenario: "admin login input",
    credentials: {
      email: "admin@example.com",
      password: "AdminPassword123!",
    },
  },
];

export const SIGN_UP_FORM_CASES = [
  {
    scenario: "mismatched passwords triggering alert",
    formData: {
      displayName: "New User",
      email: "new@example.com",
      password: "Password123!",
      confirmPassword: "DifferentPassword123!",
    },
    shouldAlert: true,
  },
  {
    scenario: "matching passwords successfully submitting registration",
    formData: {
      displayName: "Valid User",
      email: "valid@example.com",
      password: "SecurePassword123!",
      confirmPassword: "SecurePassword123!",
    },
    shouldAlert: false,
  },
];

export const STRIPE_BUTTON_CASES = [
  {
    scenario: "$50 checkout payment",
    price: 50,
    expectedAlertText: "Payment Successful",
    expectedButtonLabel: "Pay Now with Stripe",
  },
  {
    scenario: "$120 checkout payment",
    price: 120,
    expectedAlertText: "Payment Successful",
    expectedButtonLabel: "Pay Now with Stripe",
  },
];

export const CHECKOUT_PAGE_CASES = [
  {
    scenario: "single item checkout calculation",
    cartItems: [
      { _id: "item_1", name: "Brown Hat", price: 25, quantity: 2, imageUrl: "hat.png" },
    ],
    expectedTotalText: "TOTAL : $50",
    expectedItemNames: ["Brown Hat"],
  },
  {
    scenario: "multi-item checkout calculation",
    cartItems: [
      { _id: "item_1", name: "Brown Hat", price: 25, quantity: 1, imageUrl: "hat.png" },
      { _id: "item_2", name: "Blue Beanie", price: 18, quantity: 2, imageUrl: "beanie.png" },
    ],
    expectedTotalText: "TOTAL : $61",
    expectedItemNames: ["Brown Hat", "Blue Beanie"],
  },
];

export const SHOP_PAGE_CASES = [
  {
    scenario: "navigating to hats category via shop page route",
    category: {
      routeName: "hats",
      items: [{ _id: "h1", name: "Brown Brim", price: 25, imageUrl: "hat.png" }],
    },
    initialPath: "/shop/hats",
    expectedProductName: "Brown Brim",
  },
  {
    scenario: "navigating to jackets category via shop page route",
    category: {
      routeName: "jackets",
      items: [{ _id: "j1", name: "Black Jacket", price: 90, imageUrl: "jacket.png" }],
    },
    initialPath: "/shop/jackets",
    expectedProductName: "Black Jacket",
  },
];

export const SIGN_IN_AND_SIGN_UP_PAGE_CASES = [
  {
    expectedRegions: ["Sign In", "Sign Up"],
  },
];

export const USER_ACTIONS_THUNK_CASES = [
  {
    scenario: "successful user registration",
    user: { name: "Alice", email: "alice@example.com" },
    apiResponse: { data: { user: "u123" } },
    expectedRedirect: "/signin",
  },
  {
    scenario: "registration failure with network error offline fallback",
    user: { name: "Bob", email: "bob@example.com" },
    apiError: new Error("Network Error"),
    expectedRedirect: "/signin",
  },
  {
    scenario: "successful user login",
    credentials: { email: "alice@example.com", password: "Password123!" },
    apiResponse: {
      data: {
        token: "jwt_token_123",
        user: { _id: "u1", name: "Alice", email: "alice@example.com" },
      },
    },
    expectedToken: "jwt_token_123",
    expectedRedirect: "/shop",
  },
  {
    scenario: "login failure with offline fallback",
    credentials: { email: "offline@example.com", password: "Password123!" },
    apiError: new Error("API Offline"),
    expectedToken: "offline_token",
    expectedRedirect: "/shop",
  },
];

export const USER_SELECTOR_CASES = [
  {
    scenario: "extracts currentUser when user is logged in",
    state: {
      user: {
        currentUser: { id: "u123", name: "Alice" },
      },
    },
    expectedResult: { id: "u123", name: "Alice" },
  },
  {
    scenario: "returns null when user is logged out",
    state: {
      user: {
        currentUser: null,
      },
    },
    expectedResult: null,
  },
];

export const PRODUCT_ACTIONS_THUNK_CASES = [
  {
    scenario: "API returns empty array fallback to local category",
    categoryParam: "hats",
    apiResponse: { data: [] },
    expectedRouteName: "hats",
  },
  {
    scenario: "falls back to local catalog for hats on network error",
    categoryParam: "hats",
    apiError: new Error("Network Down"),
    expectedRouteName: "hats",
  },
  {
    scenario: "returns empty array for invalid fallback category",
    categoryParam: "non-existent-cat",
    apiError: new Error("Not found"),
    expectedEmptyPayload: true,
  },
  {
    scenario: "returns empty array for null category param",
    categoryParam: null,
    apiError: new Error("Not found"),
    expectedEmptyPayload: true,
  },
  {
    scenario: "handles API product objects with existing _id field",
    categoryParam: "hats",
    apiResponse: {
      data: [
        {
          _id: "mongo_id_1",
          routeName: "hats",
          items: [{ _id: "mongo_item_1", name: "Hat", price: 20 }],
        },
      ],
    },
    expectedFirstId: "mongo_id_1",
  },
];

export const ROOT_REDUCER_CASES = [
  {
    action: { type: "@@INIT" },
    expectedKeys: ["products", "cart", "user"],
    expectedCartInitial: { cartItems: [], hidden: true },
    expectedUserInitial: { currentUser: null },
  },
];

export const APP_ROOT_CASES = [
  {
    scenario: "valid jwtToken existing in localStorage",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ1X3ZhbGlkIiwibmFtZSI6IkFsaWNlIn0.signature",
    expectedUser: { _id: "u_valid", name: "Alice" },
  },
  {
    scenario: "invalid/expired jwtToken falling back to cached user",
    token: "invalid_token_string",
    expectedUser: { _id: "user_cached" },
  },
];
