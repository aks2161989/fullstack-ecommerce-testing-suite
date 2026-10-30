# Full-Stack E-Commerce Platform & Automated Test Architecture

[![Backend Test Coverage: 100%](https://img.shields.io/badge/Backend%20Coverage-100%25-brightgreen.svg)](#backend-api-testing-jest--supertest)
[![Frontend Unit Coverage: 100%](https://img.shields.io/badge/Frontend%20Coverage-100%25-brightgreen.svg)](#frontend-unit--integration-testing-react-testing-library)
[![Playwright E2E: 23 Passing](https://img.shields.io/badge/Playwright%20E2E-23%2F23%20Passing-brightgreen.svg)](#end-to-end-testing-playwright--page-object-model)
[![Tech Stack: Node.js | React | Redux | Playwright | Jest](https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20%7C%20Redux%20%7C%20Playwright%20%7C%20Jest-blue.svg)](#technology-stack)

A full-stack MERN e-commerce application equipped with an enterprise-grade automated testing suite spanning backend REST APIs, frontend component & state integration, and end-to-end (E2E) browser workflows.

---

## 🎯 Project Highlights & Test Coverage Summary

| Test Layer | Framework / Tools | Scope & Architecture | Coverage / Results |
| :--- | :--- | :--- | :--- |
| **Backend REST APIs** | **Jest & Supertest** | Auth (register, login, JWT), product catalog, category routes, Joi validation schemas, and database error states | **100% Coverage** (Statements, Branches, Functions, Lines) |
| **Frontend Unit & Integration** | **React Testing Library & Jest** | 31 test suites across components, pages, Redux actions/reducers/selectors, and route guards using a parameterized Data-Driven Approach (`test.each`) | **100% Statements, Functions, & Lines** (97 / 97 Tests Passing) |
| **End-to-End (E2E)** | **Playwright & TypeScript** | Page Object Model (POM) pattern, accessible user-facing locators (`getByRole`, `getByLabel`), cross-page cart flows, authentication, and Stripe checkout | **100% Passing** (23 / 23 Tests Across Chromium) |

---

## 🏗️ Testing Pyramid & Architecture

```
                  ▲
                 / \
                /   \     End-to-End (Playwright)
               / E2E \    - Page Object Model (POM) architecture
              /-------\   - User-facing ARIA & semantic locators
             /         \  - Data-driven multi-browser test scenarios
            / Component \ 
           / & Redux Int \ Frontend Unit & Integration (RTL + Jest)
          /---------------\ - 31 Test Suites / 97 Tests (100% coverage)
         /   Backend API   \ - Centralized dataset (`testData.js`) & `test.each`
        / & Database Mocking\ Backend Integration (Jest + Supertest)
       /---------------------\ - REST API route coverage, Joi schema validation
```

### 1. Backend API Testing (Jest & Supertest)
- **Authentication Routes (`/api/user`)**: Registration payload validation, password hashing verification, duplicate user handling, login credential checks, and JWT token issuance.
- **Product & Category Routes (`/api/product`)**: Product listings, category-filtered queries, seed data retrieval, and fallback mechanisms.
- **Isolated State & Mocking**: Zero persistent database side-effects during test runs using in-memory / mocked database operations and deterministic test lifecycle hooks (`beforeEach`, `afterAll`).

### 2. Frontend Unit & Integration Testing (React Testing Library)
- **Data-Driven Architecture (`test.each`)**: Parameterized test matrices decoupled from assertions via [`testData.js`](file:///frontend/src/test-utils/testData.js).
- **Redux State Management**: Full coverage across user actions, product actions, cart actions/reducers, and reselect memoized selectors.
- **Form Validation & Component Accessibility**: Testing interactive form controls, dynamic cart dropdowns, directory navigation, and route redirection.

### 3. End-to-End Testing (Playwright + POM)
- **Page Object Model (POM)**: Modularity with structured page objects:
  - `HomePage`: Directory category navigation, responsive headers, branding landmarks.
  - `AuthPage`: Accessible sign-in/sign-up forms, validation alerts, authentication state.
  - `ShopPage`: Category switching, product grid, card interactions.
  - `CheckoutPage`: Table row verification, item quantity increments/decrements, line item removals, and Stripe integration triggers.
  - `CartDropdownComponent`: Dynamic badge counter updates, cart dropdown toggle, empty status handling.
- **Official Playwright Best Practices**: Built exclusively on user-facing semantic locators (`page.getByRole`, `page.getByLabel`, `page.getByText`) rather than brittle CSS/XPath selectors.

---

## 📁 Repository Structure

```
ecommerce-store/
├── backend/
│   ├── model/                  # Mongoose models (User, Product, Category)
│   ├── routes/                 # Express REST API routes (auth, product)
│   ├── tests/                  # Backend Jest & Supertest test suites
│   │   ├── auth.test.js        # Auth endpoint & validation tests
│   │   ├── product.test.js     # Catalog and category route tests
│   │   └── setup.js            # Test environment configuration
│   └── package.json
├── frontend/
│   ├── e2e/                    # Playwright E2E Test Suite
│   │   ├── pages/              # Page Object Models (POM)
│   │   │   ├── AuthPage.ts
│   │   │   ├── CheckoutPage.ts
│   │   │   ├── HomePage.ts
│   │   │   ├── ShopPage.ts
│   │   │   └── components/     # Component Page Objects (CartDropdownComponent.ts)
│   │   ├── fixtures/           # Data-driven test fixtures (users, items, categories)
│   │   └── app.spec.ts         # 23 E2E test scenarios
│   ├── src/
│   │   ├── components/         # React components + RTL test suites (*.test.jsx)
│   │   ├── pages/              # Route pages + RTL test suites (*.test.jsx)
│   │   ├── redux/              # Redux actions, reducers, selectors + test suites (*.test.js)
│   │   └── test-utils/         # Centralized test dataset (testData.js)
│   ├── playwright.config.ts    # Playwright runner configuration
│   └── package.json
└── README.md
```

---

## 🚀 Running the Tests

### Prerequisites
- Node.js (v16+ or modern LTS recommended; `--openssl-legacy-provider` enabled for React Scripts compatibility)
- npm or yarn

### 1. Backend Test Commands
```bash
cd backend
npm install

# Run all backend tests
npm test

# Run backend tests with 100% coverage report
npm run test:coverage
```

### 2. Frontend Unit & Integration Test Commands
```bash
cd frontend
npm install

# Run frontend tests in interactive watch mode
npm test

# Run all 31 test suites (97 tests) once with 100% coverage report
npm run test:coverage
```

### 3. Frontend End-to-End (Playwright) Test Commands
```bash
cd frontend

# Run all 23 Playwright E2E tests headless
npm run test:e2e

# Run Playwright E2E tests in visible browser (headed)
npm run test:e2e:headed

# Open interactive Playwright UI runner
npm run test:e2e:ui
```

---

## 📋 Technology Stack

- **Testing**: Playwright, Jest, Supertest, React Testing Library, `@testing-library/user-event`
- **Frontend**: React (Hooks, Context, Functional Components), Redux, Reselect, Redux Thunk, React Router, Sass
- **Backend**: Node.js, Express, MongoDB / Mongoose, JWT, Bcrypt.js, Joi

---

## 👤 Author & Attribution

- **Test Automation Architecture & 100% Coverage Implementation**: [Akshay Sharma](https://github.com/aks2161989)
- **Base Full-Stack E-Commerce Starter Application**: Originally forked from [hacetheworld/ecommerce-store](https://github.com/hacetheworld/ecommerce-store). All automated testing suites, Page Object Models, data-driven test datasets, and accessibility refactoring were engineered independently.
