An online courses learning app built with TanStack Start, Drizzle ORM and PostgreSQL.

# Getting Started

Install dependencies:

```bash
pnpm install
```

Create a `.env.local` (see `.env.example`) with:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgres://<user>:<password>@localhost:5432/<database>
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
MINIO_ROOT_USER=
MINIO_ROOT_PASSWORD=
```

Start the backing services (PostgreSQL and MinIO), apply the migrations, then run the dev server on
port 3000:

```bash
pnpm docker:up
pnpm db:migrate
pnpm dev
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## Database

PostgreSQL is accessed through [Drizzle ORM](https://orm.drizzle.team/). The schema lives in
`src/server/db/schema.ts` and the connection is created in `src/server/db/index.ts`.

All domain tables live in a dedicated `coca` PostgreSQL schema.

```bash
pnpm db:generate   # generate a migration from schema changes
pnpm db:migrate    # apply pending migrations
pnpm db:push       # push the schema straight to the database (dev only)
pnpm db:pull       # introspect an existing database
pnpm db:studio     # open Drizzle Studio
```

Generated migrations are committed under `drizzle/`.

### Local services

`docker-compose.yml` provides PostgreSQL (port 5432) and MinIO (API on 9000, console on 9001).
Both read their credentials from `.env.local`:

```bash
pnpm docker:up     # start detached
pnpm docker:down   # stop, keeping the named volumes
```

## Styling

This project uses [Chakra UI](https://chakra-ui.com/) components with style props, alongside
[Tailwind CSS](https://tailwindcss.com/) and the shared classes and design tokens in
`src/styles.css`.

## Linting, Formatting & Types

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
pnpm bm:lint
pnpm bm:format
pnpm bm:format:write
pnpm bm:check
pnpm bm:check:write
```

`bm:check` runs the linter, the formatter and import sorting in one pass.

Biome does not type-check. Run TypeScript separately with:

```bash
pnpm typecheck
```


## Setting up Clerk

1. Sign up at [clerk.com](https://clerk.com) and create an application
2. Copy the **Publishable Key** from the Clerk dashboard
3. Set it in your `.env.local`:
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```
4. Visit the demo route at `/demo/clerk` once `pnpm dev` is running

### What's wired up

- **`<ClerkProvider>`** wrapped by `src/providers/AppClerkProvider.tsx` and rendered in `src/components/layout/RootDocument.tsx`, handling auth context for the whole tree
- **`<SignInButton>` / `<UserButton>`** in `src/components/layout/ClerkHeader.tsx` swap based on auth state
- **`/demo/clerk`** shows Clerk's prebuilt sign-in UI and a signed-in greeting

### Protecting a route

Wrap any component in `<SignedIn>` / `<SignedOut>`:

```tsx
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/tanstack-react-start'

function ProtectedPage() {
  return (
    <>
      <SignedIn>
        <YourPageContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
```

For server-side checks (route loaders, server functions), see the Clerk docs on [`auth()`](https://clerk.com/docs/references/backend/auth).

### Production checklist

- Replace the test keys with **production keys** from a dedicated production Clerk instance
- Configure your production domain under **Domains** in the Clerk dashboard
- Set up social providers (Google, GitHub, etc.) under **User & Authentication → Social Connections**



## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

The app routes are `/` (`index.tsx`), `/about` and `/courses`, plus the starter routes under
`src/routes/demo/`. Their page components live in `src/components/pages/`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you. If the generated
`src/routeTree.gen.ts` gets out of sync, regenerate it with:

```bash
pnpm generate-routes
```

Once you have more than one route you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here the root route is created with `createRootRouteWithContext<AppRouterContext>()` — the context
type is exported from `src/router.tsx`, where the `QueryClient` it carries is also created — and its
`shellComponent` is `src/components/layout/RootDocument.tsx`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    getServerTime().then(setTime)
  }, [])
  
  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
