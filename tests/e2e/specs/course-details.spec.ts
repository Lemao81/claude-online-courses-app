import { insertCourse, insertUser } from '@/test/factories'
import { e2eUserId, e2eUsers } from '../e2e-users'
import { expect, test } from '../fixtures'

test.use({ storageState: e2eUsers.author.session })

test('saved details', async ({ page, database }) => {
  const authorId = await insertUser(database, e2eUserId('author'))
  const course = await insertCourse(database, { authorId, title: 'Rust Basics' })

  await page.goto(`/editcourse/${course.id}`)

  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Rust in Depth')
  await page.getByRole('textbox', { name: 'Subtitle' }).fill('Ownership and borrowing')
  await page.getByRole('textbox', { name: 'Price' }).fill('19.99')
  await page.getByRole('textbox', { name: 'Price' }).press('Enter')

  await expect(page.getByRole('heading', { level: 1, name: 'Rust in Depth' })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('textbox', { name: 'Title', exact: true })).toHaveValue(
    'Rust in Depth',
  )

  await expect(page.getByRole('textbox', { name: 'Subtitle' })).toHaveValue(
    'Ownership and borrowing',
  )

  await expect(page.getByRole('textbox', { name: 'Price' })).toHaveValue('19.99')
})

test('empty title', async ({ page, database }) => {
  const authorId = await insertUser(database, e2eUserId('author'))
  const course = await insertCourse(database, {
    authorId,
    title: 'Rust Basics',
    subtitle: 'Systems programming',
  })

  await page.goto(`/editcourse/${course.id}`)

  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('')

  await expect(page.getByRole('alert')).toHaveText('Title is required')

  await page.reload()
  await expect(page.getByRole('textbox', { name: 'Title', exact: true })).toHaveValue('Rust Basics')
})

test('price out of range', async ({ page, database }) => {
  const authorId = await insertUser(database, e2eUserId('author'))
  const course = await insertCourse(database, {
    authorId,
    title: 'Rust Basics',
    subtitle: 'Systems programming',
    price: '19.99',
  })

  await page.goto(`/editcourse/${course.id}`)

  await page.getByRole('textbox', { name: 'Price' }).fill('100000000')
  await page.getByRole('textbox', { name: 'Price' }).press('Enter')

  await expect(page.getByRole('alert')).toHaveText('Price must be below 100,000,000')

  await page.reload()
  await expect(page.getByRole('textbox', { name: 'Price' })).toHaveValue('19.99')
})

test('thumbnail placeholder', async ({ page, database }) => {
  const authorId = await insertUser(database, e2eUserId('author'))
  const course = await insertCourse(database, { authorId })

  await page.goto(`/editcourse/${course.id}`)

  await expect(page.getByText('JPEG, PNG or WebP, up to 5 MB')).toBeVisible()
  await expect(page.getByRole('img', { name: 'Course thumbnail' })).toHaveCount(0)
})

test('thumbnail upload', async ({ page, database }) => {
  const authorId = await insertUser(database, e2eUserId('author'))
  const course = await insertCourse(database, { authorId })

  await page.goto(`/editcourse/${course.id}`)

  const fileChooser = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Upload thumbnail' }).click()
  await (await fileChooser).setFiles('src/server/db/seed/assets/thumbnail-1.jpg')

  await expect(page.getByRole('img', { name: 'Course thumbnail' })).toHaveJSProperty(
    'naturalWidth',
    1280,
  )

  await expect(page.getByRole('button', { name: 'Replace' })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('img', { name: 'Course thumbnail' })).toHaveJSProperty(
    'naturalWidth',
    1280,
  )
})
