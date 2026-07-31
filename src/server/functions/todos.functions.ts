import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { db } from '#/server/db/index'
import { todos } from '#/server/db/schema'

export const getTodos = createServerFn({
  method: 'GET',
}).handler(
  async (): Promise<Array<typeof todos.$inferSelect>> =>
    await db.query.todos.findMany({
      orderBy: [desc(todos.createdAt)],
    }),
)

export const createTodo = createServerFn({
  method: 'POST',
})
  .validator((data: { title: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    await db.insert(todos).values({ title: data.title })

    return { success: true }
  })
