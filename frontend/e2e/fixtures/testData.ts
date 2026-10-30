export interface CategoryTestCase {
  readonly title: string;
  readonly expectedUrl: string;
}

export const CATEGORY_TEST_CASES: readonly CategoryTestCase[] = [
  { title: "hats", expectedUrl: "/shop/hats" },
  { title: "jackets", expectedUrl: "/shop/jackets" },
  { title: "sneakers", expectedUrl: "/shop/sneakers" },
  { title: "womens", expectedUrl: "/shop/womens" },
  { title: "mens", expectedUrl: "/shop/mens" },
];

export interface NavLinkTestCase {
  readonly name: string;
  readonly expectedPath: string;
}

export const NAV_LINK_TEST_CASES: readonly NavLinkTestCase[] = [
  { name: "SHOP", expectedPath: "/shop" },
  { name: "SIGN/SIGNUP", expectedPath: "/signin" },
];

export interface SidebarSwitchTestCase {
  readonly fromCategory: string;
  readonly toCategory: string;
  readonly expectedUrl: string;
}

export const SIDEBAR_SWITCH_TEST_CASES: readonly SidebarSwitchTestCase[] = [
  {
    fromCategory: "hats",
    toCategory: "jackets",
    expectedUrl: "/shop/jackets",
  },
  {
    fromCategory: "jackets",
    toCategory: "sneakers",
    expectedUrl: "/shop/sneakers",
  },
  {
    fromCategory: "sneakers",
    toCategory: "womens",
    expectedUrl: "/shop/womens",
  },
];

export interface UserAuthTestCase {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export const TEST_USERS = {
  validUser: {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "Password123!",
  },
  registeredUser: {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "Password123!",
  },
} as const;

export const generateUniqueE2EUser = (prefix = "e2e_user") => {
  const id = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    name: `${prefix} ${id.substring(0, 5)}`,
    email: `${prefix}_${id}@example.com`,
    password: "SecurePassword123!",
  };
};

export interface MultiItemCartTestCase {
  readonly category: string;
  readonly expectedInitialItemName: string;
  readonly price: number;
}

export const MULTI_ITEM_TEST_CASES: readonly MultiItemCartTestCase[] = [
  { category: "hats", expectedInitialItemName: "Brown Brim", price: 25 },
  { category: "jackets", expectedInitialItemName: "Black Jean Shearling", price: 125 },
];
