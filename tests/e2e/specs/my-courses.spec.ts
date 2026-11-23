import { insertCourse, insertEnrollment, insertUser } from '@/test/factories'
import { e2eUserId, e2eUsers } from '../e2e-users'
import { expect, test } from '../fixtures'

test.use({ storageState: e2eUsers.author.session })

test('empty state', async ({ page }) => {
  await page.goto('/mycourses')

  await expect(page.getByText('You have not created any courses yet.')).toBeVisible()
})

test('own courses only', async ({ page, database }) => {
  const authorId = await insertUser(database, e2eUserId('author'))
  await insertCourse(database, { authorId, title: 'Rust Basics' })
  await insertCourse(database, { authorId, title: 'Go Basics' })
  await insertCourse(database, { title: 'Foreign Course' })

  await page.goto('/mycourses')

  await expect(page.getByText('Rust Basics')).toBeVisible()
  await expect(page.getByText('Go Basics')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Edit course' })).toHaveCount(2)
  await expect(page.getByText('Foreign Course')).toBeHidden()
})

test('new course', async ({ page }) => {
  await page.goto('/mycourses')

  await page.getByRole('button', { name: 'Create Course' }).click()
  const dialog = page.getByRole('dialog', { name: 'Create Course' })
  await dialog.getByRole('textbox', { name: 'Title', exact: true }).fill('Rust Basics')
  await dialog.getByRole('textbox', { name: 'Subtitle' }).fill('Ownership and borrowing')
  await dialog.getByRole('button', { name: 'OK' }).click()

  await expect(page).toHaveURL(/\/editcourse\/\d+$/)

  await page.goto('/mycourses')
  await expect(page.getByText('Rust Basics')).toBeVisible()
  await expect(page.getByText('Ownership and borrowing')).toBeVisible()
})

test('blank title', async ({ page }) => {
  await page.goto('/mycourses')

  await page.getByRole('button', { name: 'Create Course' }).click()
  const dialog = page.getByRole('dialog', { name: 'Create Course' })
  await dialog.getByRole('textbox', { name: 'Title', exact: true }).fill('   ')
  await dialog.getByRole('textbox', { name: 'Subtitle' }).fill('Ownership and borrowing')
  await dialog.getByRole('textbox', { name: 'Title', exact: true }).press('Enter')

  await expect(dialog.getByRole('button', { name: 'OK' })).toBeDisabled()

  await dialog.getByRole('button', { name: 'Cancel' }).click()
  await page.reload()
  await expect(page.getByText('You have not created any courses yet.')).toBeVisible()
})

test('delete draft', async ({ page, database }) => {
  const authorId = await insertUser(database, e2eUserId('author'))
  await insertCourse(database, { authorId, title: 'Rust Basics' })

  await page.goto('/mycourses')

  await page.getByRole('button', { name: 'Delete course' }).click()
  const dialog = page.getByRole('alertdialog', { name: 'Delete Course' })
  await expect(dialog.getByText('Do you really want to delete "Rust Basics"?')).toBeVisible()
  await dialog.getByRole('button', { name: 'Delete' }).click()

  await expect(page.getByText('You have not created any courses yet.')).toBeVisible()

  await page.reload()
  await expect(page.getByText('You have not created any courses yet.')).toBeVisible()
})

test('cancel delete', async ({ page, database }) => {
  const authorId = await insertUser(database, e2eUserId('author'))
  await insertCourse(database, { authorId, title: 'Rust Basics' })

  await page.goto('/mycourses')

  await page.getByRole('button', { name: 'Delete course' }).click()
  const dialog = page.getByRole('alertdialog', { name: 'Delete Course' })
  await dialog.getByRole('button', { name: 'Cancel' }).click()

  await expect(dialog).toBeHidden()

  await page.reload()
  await expect(page.getByText('Rust Basics')).toBeVisible()
})

test('enrolled draft', async ({ page, database }) => {
  const authorId = await insertUser(database, e2eUserId('author'))
  const course = await insertCourse(database, { authorId, title: 'Rust Basics' })
  await insertEnrollment(database, { courseId: course.id })

  await page.goto('/mycourses')

  await page.getByRole('button', { name: 'Delete course' }).click()
  const dialog = page.getByRole('alertdialog', { name: 'Delete Course' })
  await dialog.getByRole('button', { name: 'Delete' }).click()

  await expect(dialog.getByText('A course with enrollments cannot be deleted')).toBeVisible()

  await dialog.getByRole('button', { name: 'Cancel' }).click()
  await page.reload()
  await expect(page.getByText('Rust Basics')).toBeVisible()
})

test('archive', async ({ page, database }) => {
  const authorId = await insertUser(database, e2eUserId('author'))
  const course = await insertCourse(database, { authorId, title: 'Rust Basics' })

  await page.goto(`/editcourse/${course.id}`)

  await page.getByRole('button', { name: 'More course actions' }).click()
  await page.getByRole('menuitem', { name: 'Archive course' }).click()
  const dialog = page.getByRole('alertdialog', { name: 'Archive Course' })
  await dialog.getByRole('button', { name: 'Archive' }).click()
  await expect(dialog).toBeHidden()

  await page.goto('/mycourses')
  await expect(page.getByText('archived', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View course' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Delete course' })).toBeHidden()

  await page.reload()
  await expect(page.getByText('archived', { exact: true })).toBeVisible()
})
