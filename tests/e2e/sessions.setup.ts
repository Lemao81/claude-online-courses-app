import { clerk } from '@clerk/testing/playwright'
import { expect, test as setup } from '@playwright/test'
import { type E2eUser, e2eUserEmail, e2eUsers } from './e2e-users'

for (const user of Object.keys(e2eUsers) as E2eUser[]) {
  setup(`${user} session`, async ({ page }) => {
    await page.goto('/')
    await clerk.signIn({ page, emailAddress: e2eUserEmail(user) })
    await page.reload()
    await expect(page.getByText('Your overview will show up here soon.')).toBeVisible()
    await page.context().storageState({ path: e2eUsers[user].session })
  })
}
