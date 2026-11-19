import { insertCourse } from '@/test/factories'
import { e2eUsers } from '../e2e-users'
import { expect, test } from '../fixtures'

const guardedPaths = ['/mycourses', '/overview']

test.describe('signed out', () => {
  test('landing at the root', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Landing Page')).toBeVisible()
  })

  for (const path of guardedPaths) {
    test(`redirect from ${path}`, async ({ page }) => {
      await page.goto(path)

      await expect(page).toHaveURL('/')
      await expect(page.getByText('Landing Page')).toBeVisible()
    })
  }

  test('redirect from the course editor', async ({ page, database }) => {
    const course = await insertCourse(database)

    await page.goto(`/editcourse/${course.id}`)

    await expect(page).toHaveURL('/')
    await expect(page.getByText('Landing Page')).toBeVisible()
  })

  test('color mode toggle', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Toggle color mode' })

    await toggle.click()
    await toggle.click()
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)

    await page.reload()
    await expect(page.locator('html')).toHaveClass(/\bdark\b/)

    await toggle.click()
    await expect(page.locator('html')).toHaveClass(/\blight\b/)
  })
})

test.describe('signed in', () => {
  test.use({ storageState: e2eUsers.author.session })

  test('overview at the root', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Your overview will show up here soon.')).toBeVisible()
  })

  test('sidebar navigation', async ({ page }) => {
    await page.goto('/')
    const sidebar = page.getByRole('complementary')

    await sidebar.getByRole('link', { name: 'Overview' }).click()
    await expect(page).toHaveURL('/overview')
    await expect(page.getByText('Your overview will show up here soon.')).toBeVisible()

    await sidebar.getByRole('link', { name: 'Courses', exact: true }).click()
    await expect(page).toHaveURL('/courses')
    await expect(page.getByText('Courses coming soon.')).toBeVisible()

    await sidebar.getByRole('link', { name: 'My Courses' }).click()
    await expect(page).toHaveURL('/mycourses')
    await expect(page.getByRole('heading', { name: 'My Courses' })).toBeVisible()

    await sidebar.getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL('/about')
    await expect(page.getByRole('heading', { name: 'Learn at your own pace.' })).toBeVisible()
  })
})

test.describe('other user', () => {
  test.use({ storageState: e2eUsers.other.session })

  test('editor of a foreign course', async ({ page, database }) => {
    const course = await insertCourse(database)

    await page.goto(`/editcourse/${course.id}`)

    await expect(page).toHaveURL('/courses')
    await expect(page.getByText('Courses coming soon.')).toBeVisible()
  })
})
