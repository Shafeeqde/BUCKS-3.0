import { test, expect } from '@playwright/test';

test('User can log in and create a business profile', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'admin@bucks.app');
  await page.fill('input[type="password"]', '123456');
  await page.click('button:has-text("Sign In")');
  await expect(page).toHaveURL(/dashboard/);

  // Go to create business profile page
  await page.goto('/business-profiles/new');
  await page.fill('input[name="name"]', 'Test Business');
  // Fill other required fields as needed...
  await page.click('button:has-text("Save")');
  await expect(page.locator('text=Test Business')).toBeVisible();
});
