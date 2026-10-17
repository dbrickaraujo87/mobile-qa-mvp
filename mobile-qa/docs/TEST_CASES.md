# Mobile Test Specifications & Scenarios (BDD / Gherkin)

## 1. Traceability & Execution Overview

This document maps all business behaviors for the critical paths of the Sauce Labs My Demo App RN (Android). Scenarios are tagged to enable selective test execution in the WebdriverIO test runner:

- `@smoke`: Critical sanity checks executed on every pull request / commit.
- `@regression`: Full regression test coverage executed nightly or pre-release.
- `@manual`: Scenarios requiring physical device hardware, sensory inputs, or exploratory edge validations.

---

## 2. Feature: User Authentication

**Risk Traceability:** `RSK-01` (Session Security & Invalidation)  
**Target Screen:** `LoginPage.ts`  
**Automated Spec:** `test/specs/auth.spec.ts`

```gherkin
@auth @regression
Feature: Authentication and Session Handling
  As a registered mobile customer
  I want to authenticate securely into the application
  So that I can access personalized checkout and account features

  Background:
    Given the app is launched on the initial catalog screen
    When I open the side navigation menu
    And I navigate to the "Log In" view
    Then the login screen elements should be fully displayed

  @smoke @happy-path
  Scenario: Successful login with valid credentials
    When I submit the username "bob@example.com"
    And I submit the password "10203040"
    And I tap the "Login" button
    Then I should be redirected back to the product catalog screen
    And the side navigation menu should display the "Log Out" option

  @negative @validation
  Scenario Outline: Unsuccessful login with invalid or locked credentials
    When I submit the username "<username>"
    And I submit the password "<password>"
    And I tap the "Login" button
    Then I should remain on the login screen
    And an error message "<error_message>" should be displayed

    Examples:
      | username           | password   | error_message                                               |
      | locked@example.com | 10203040   | Sorry, this user has been locked out.                       |
      | bob@example.com    | wrong_pass | Provided credentials do not match any user in this service. |
      |                    | 10203040   | Username is required                                        |
      | bob@example.com    |            | Password is required                                        |

  @manual @security
  Scenario: Session cleanup upon explicit logout
    Given I am authenticated as "bob@example.com"
    When I open the side navigation menu
    And I tap the "Log Out" button
    And I confirm the logout action on the native alert
    Then I should see the logout confirmation modal
    And the user token must be purged from local secure storage
```

---

## 3. Feature: Product Catalog Exploration

**Risk Traceability:** `RSK-02` (Catalog Sync), `RSK-04` (UI Layout & Density)  
**Target Screen:** `CatalogPage.ts`  
**Automated Spec:** `test/specs/catalog.spec.ts`

```gherkin
@catalog @regression
Feature: Product Catalog Exploration and Sorting
  As an app shopper
  I want to browse and sort available products
  So that I can find items of interest easily

  Background:
    Given the app is launched on the initial screen
    Then the catalog title "Products" should be visible

  @smoke
  Scenario: View product listing and details
    When the product list is displayed
    Then all visible items should display a title, price, and rating
    When I tap on the item "Sauce Labs Backpack"
    Then I should be navigated to the "Product Details" screen
    And the product title should be "Sauce Labs Backpack"
    And the product price should be "$ 29.99"

  @sorting
  Scenario Outline: Sort products by criteria
    When I tap the catalog sort button
    And I select sorting option "<sort_option>"
    Then the first visible product name should be "<expected_first_item>"
    And the first visible product price should be "<expected_first_price>"

    Examples:
      | sort_option         | expected_first_item      | expected_first_price |
      | Name - Ascending    | Sauce Labs Backpack      | $ 29.99              |
      | Name - Descending   | Sauce Labs Onesie        | $ 7.99               |
      | Price - Low to High | Sauce Labs Onesie        | $ 7.99               |
      | Price - High to Low | Sauce Labs Fleece Jacket | $ 49.99              |

  @manual @resilience
  Scenario: Catalog behavior under network latency or offline state
    Given the app is launched
    When the device switches to "Airplane Mode"
    And I pull to refresh the catalog list
    Then a user-friendly offline banner should be displayed
    And cached product entries should remain readable without crashing
```

---

## 4. Feature: Cart Management & Item Customization

**Risk Traceability:** `RSK-03` (Cart State & Race Conditions)  
**Target Screens:** `ProductDetailsPage.ts`, `CartPage.ts`  
**Automated Spec:** `test/specs/cart.spec.ts`

```gherkin
@cart @regression
Feature: Shopping Cart Management
  As a customer
  I want to configure product quantity and add items to my shopping cart
  So that my selected items are persisted for checkout

  Background:
    Given I am on the product details screen for "Sauce Labs Backpack"

  @smoke @happy-path
  Scenario: Add single product to cart and verify badge counter
    When I tap the "Add To Cart" button
    Then the shopping cart badge count should display "1"

  @happy-path @quantity
  Scenario: Increment product counter and add multiple units
    When I tap the counter increment button 2 times
    And I tap the "Add To Cart" button
    Then the shopping cart badge count should display "3"

  @edge-case @state
  Scenario: Cart persistence across app backgrounding
    When I tap the counter increment button 1 time
    And I tap the "Add To Cart" button
    Then the shopping cart badge count should display "2"
    When the application is sent to the background for 5 seconds
    And the application is brought back to the foreground
    Then the shopping cart badge count must remain "2"

  @regression @cart-removal
  Scenario: Remove item from cart view
    Given I have added 1 unit of "Sauce Labs Backpack" to the cart
    When I tap the shopping cart icon
    Then the cart screen should list "Sauce Labs Backpack" with quantity 1
    When I tap the "Remove Item" button
    Then the cart should become empty
    And the shopping cart badge should not be visible
```

---

## 5. Coverage Matrix

| Test ID    | Feature | Scenario Title                              | Priority | Automation Target     | Coverage Status |
| ---------- | ------- | ------------------------------------------- | -------- | --------------------- | --------------- |
| TC-AUTH-01 | Auth    | Successful login with valid credentials     | P0       | `auth.spec.ts`        | Automated       |
| TC-AUTH-02 | Auth    | Unsuccessful login (Validation & Lockout)   | P1       | `auth.spec.ts`        | Automated       |
| TC-AUTH-03 | Auth    | Session cleanup on logout                   | P2       | Exploratory / Manual  | Manual          |
| TC-CAT-01  | Catalog | View product listing & open details         | P0       | `cart.spec.ts`        | Automated       |
| TC-CAT-02  | Catalog | Product sorting criteria                    | P1       | `catalog.spec.ts`     | Backlog         |
| TC-CAT-03  | Catalog | Offline catalog behavior                    | P2       | Appium Network API    | Manual / Edge   |
| TC-CART-01 | Cart    | Add single product & check badge           | P0       | `cart.spec.ts`        | Automated       |
| TC-CART-02 | Cart    | Increment quantity & multi-unit add         | P0       | `cart.spec.ts`        | Automated       |
| TC-CART-03 | Cart    | Cart state persistence (backgrounding)      | P1       | `cart.spec.ts`        | Automated       |
| TC-CART-04 | Cart    | Remove item inside cart                     | P1       | `cart.spec.ts`        | Backlog         |
