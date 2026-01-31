import { test, expect } from "@playwright/test";

test.describe("signin", () => {
  test("logs in user and redirects to /boards", async ({ page }) => {
    const email = process.env.TEST_USER;
    const password = process.env.TEST_PW;

    test.skip(!email || !password, "TEST_USER and TEST_PW must be set in .env");

    await page.goto("/signin");

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/boards/);
  });
});
