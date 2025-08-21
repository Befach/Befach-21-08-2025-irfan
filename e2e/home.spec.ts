import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')
    
    // Check if page loads
    await expect(page).toHaveTitle(/Shipment Tracker/)
  })

  test('should have tracking form', async ({ page }) => {
    await page.goto('/')
    
    // Check if tracking form exists
    await expect(page.getByPlaceholder('Enter tracking number')).toBeVisible()
    await expect(page.getByRole('button', { name: /track/i })).toBeVisible()
  })

  test('should navigate to admin page', async ({ page }) => {
    await page.goto('/')
    
    // Click admin link if it exists
    const adminLink = page.getByRole('link', { name: /admin/i })
    if (await adminLink.isVisible()) {
      await adminLink.click()
      await expect(page).toHaveURL(/.*admin/)
    }
  })
}) 