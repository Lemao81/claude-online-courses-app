import { expect, test } from './fixtures'

test('landing when signed out', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Landing Page')).toBeVisible()
})
