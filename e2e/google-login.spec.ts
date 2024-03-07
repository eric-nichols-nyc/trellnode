/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';
test('test', async ({ page }) => {
  await page.goto(process.env.NEXTAUTH_URL!);
  await expect(page).toHaveScreenshot();
  await page.getByRole('button', { name: 'Sign in with GitHub' }).click();
  await page.getByLabel('Username or email address').fill(process.env.GITHUB_USERNAME!);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(process.env.GITHUB_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
});