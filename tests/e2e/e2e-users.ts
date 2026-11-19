import path from 'node:path'

const clerkApiUrl = 'https://api.clerk.com/v1'

export const e2eUsers = {
  author: {
    emailVariable: 'E2E_AUTHOR_EMAIL',
    idVariable: 'E2E_AUTHOR_ID',
    session: path.join(import.meta.dirname, '.auth', 'author.json'),
  },
  other: {
    emailVariable: 'E2E_OTHER_EMAIL',
    idVariable: 'E2E_OTHER_ID',
    session: path.join(import.meta.dirname, '.auth', 'other.json'),
  },
} as const

export type E2eUser = keyof typeof e2eUsers

function readVariable(variable: string): string {
  const value = process.env[variable]

  if (!value) {
    throw new Error(`${variable} is not set; name the Clerk test user's email in .env.local`)
  }

  return value
}

export function e2eUserEmail(user: E2eUser): string {
  return readVariable(e2eUsers[user].emailVariable)
}

export function e2eUserId(user: E2eUser): string {
  return readVariable(e2eUsers[user].idVariable)
}

async function findClerkUserId(user: E2eUser): Promise<string> {
  const { emailVariable } = e2eUsers[user]
  const email = e2eUserEmail(user)
  const query = new URLSearchParams({ email_address: email })
  const response = await fetch(`${clerkApiUrl}/users?${query}`, {
    headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
  })

  if (!response.ok) {
    throw new Error(`Looking up ${emailVariable} on Clerk failed with status ${response.status}`)
  }

  const [clerkUser] = (await response.json()) as { id: string }[]

  if (!clerkUser) {
    throw new Error(`${emailVariable} names ${email}, but the Clerk instance has no such user`)
  }

  return clerkUser.id
}

export async function lookUpE2eUsers(): Promise<void> {
  for (const user of Object.keys(e2eUsers) as E2eUser[]) {
    process.env[e2eUsers[user].idVariable] = await findClerkUserId(user)
  }
}
