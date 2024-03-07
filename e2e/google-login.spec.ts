/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';
test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveScreenshot();
  await page.getByRole('button', { name: 'Sign in with GitHub' }).click();
  await page.getByLabel('Username or email address').fill('eric-nichols-nyc');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('DefLeppard1983!');
  await page.getByRole('button', { name: 'Sign in' }).click();
});