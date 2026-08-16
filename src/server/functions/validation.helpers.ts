import type { z } from 'zod'

export function validateInput<TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(data)

  if (!result.success) {
    throw new Error(result.error.issues[0].message)
  }

  return result.data
}
