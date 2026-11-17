import { expect, test } from '@playwright/test'

test('landing when signed out', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Landing Page')).toBeVisible()
})
