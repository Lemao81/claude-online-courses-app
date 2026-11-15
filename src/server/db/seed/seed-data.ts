import type { CourseSeed } from '@/server/types'

export const fillerCourseTitles = [
  'React 19 Patterns in Practice',
  'PostgreSQL for Application Developers',
  'Shipping Full-Stack Apps with Docker',
  'Testing React Applications with Vitest',
  'Authentication Flows with Clerk',
]

export const fillerCourseSubtitles = [
  'A hands-on course built around a single real project',
  'From first principles to production-ready code',
  'Short lessons you can finish over a lunch break',
  'The concepts that come up in every code review',
  'Learn the tooling by rebuilding it yourself',
  'Practical recipes for everyday feature work',
  'Everything you need for your next side project',
  'A guided tour with exercises after every chapter',
]

export const fillerCoursePrices = ['0', '19.00', '29.00', '39.00', '49.00', '79.00']

export const courseSeeds: CourseSeed[] = [
  {
    title: 'TanStack Start from Scratch',
    subtitle: 'Build a full-stack React app with file-based routing, server functions and SSR',
    description:
      'Build a complete course catalogue app with TanStack Start, one feature at a time. You will set up file-based routing, load data in route loaders, move logic into server functions and ship the result to production. Every chapter ends with a working app you can run and change.',
    status: 'published',
    price: '49.00',
    rating: '4.72',
    ratingCount: 186,
    publishedAt: new Date('2025-10-14T09:00:00Z'),
    createdAt: new Date('2025-09-02T14:30:00Z'),
    updatedAt: new Date('2026-07-20T11:15:00Z'),
    thumbnailFile: 'thumbnail-1.jpg',
    lessons: [
      { title: 'Course trailer', durationSec: 150, isFreePreview: true },
      { title: 'Who this course is for', durationSec: 240, isFreePreview: true },
    ],
    chapters: [
      {
        title: 'Project Setup',
        description: 'Scaffold a TanStack Start app and get to know the files it generates.',
        lessons: [
          { title: 'Creating the project with the CLI', durationSec: 420, isFreePreview: true },
          { title: 'A tour of the generated files', durationSec: 540 },
          { title: 'Configuring TypeScript path aliases', durationSec: 360 },
          { title: 'Running the dev server and reading its output', durationSec: 300 },
        ],
      },
      {
        title: 'File-Based Routing',
        description: 'Turn files into routes, nest layouts and read params from the URL.',
        lessons: [
          { title: 'How the route tree is generated', durationSec: 480 },
          { title: 'Nested layouts with outlets', durationSec: 600 },
          { title: 'Dynamic segments and path params', durationSec: 540 },
          { title: 'Validating search params with Zod', durationSec: 720 },
          { title: 'Linking between routes type-safely', durationSec: 420 },
        ],
      },
      {
        title: 'Loading Data',
        description: 'Fetch data in route loaders and keep it fresh with TanStack Query.',
        lessons: [
          { title: 'Route loaders and the loader context', durationSec: 660 },
          { title: 'Integrating TanStack Query', durationSec: 780 },
          { title: 'Pending and error components', durationSec: 540 },
          { title: 'Preloading routes on hover', durationSec: 360 },
        ],
      },
      {
        title: 'Server Functions',
        description: 'Run code on the server and call it from the client like a regular function.',
        lessons: [
          { title: 'Your first server function', durationSec: 600 },
          { title: 'Validating input on the server', durationSec: 540 },
          { title: 'Mutations and cache invalidation', durationSec: 840 },
          { title: 'Middleware for authentication', durationSec: 720 },
        ],
      },
      {
        title: 'Deployment',
        description: 'Build the app for production and ship it to a Node host.',
        lessons: [
          { title: 'Production builds and the SSR output', durationSec: 480 },
          { title: 'Environment variables in production', durationSec: 420 },
          { title: 'Deploying with Docker', durationSec: 900 },
        ],
      },
    ],
  },
  {
    title: 'Type-Safe Data with Drizzle ORM',
    subtitle: 'Model, query and migrate PostgreSQL with TypeScript you can trust',
    description:
      'Learn to describe a PostgreSQL schema in TypeScript and query it without losing type safety. The course covers schema design, the query builder, the relational query API, migrations and transactions. You will finish with a tested data layer ready for a real application.',
    status: 'draft',
    price: '39.00',
    rating: null,
    ratingCount: 0,
    publishedAt: null,
    createdAt: new Date('2026-05-18T08:45:00Z'),
    updatedAt: new Date('2026-08-03T16:20:00Z'),
    thumbnailFile: 'thumbnail-2.jpg',
    lessons: [{ title: 'Course introduction', durationSec: 210, isFreePreview: true }],
    chapters: [
      {
        title: 'Getting Started',
        description: 'Connect Drizzle to PostgreSQL and run your first query.',
        lessons: [
          { title: 'Why a SQL-like ORM', durationSec: 360, isFreePreview: true },
          { title: 'Installing Drizzle and the Postgres driver', durationSec: 300 },
          { title: 'Defining the database client', durationSec: 420 },
        ],
      },
      {
        title: 'Modelling the Schema',
        description: 'Describe tables, columns and constraints in TypeScript.',
        lessons: [
          { title: 'Tables, columns and defaults', durationSec: 600 },
          { title: 'Enums and check constraints', durationSec: 480 },
          { title: 'Indexes that match your queries', durationSec: 540 },
          { title: 'Foreign keys and cascade rules', durationSec: 660 },
        ],
      },
      {
        title: 'Querying',
        description: 'Select, filter, join and aggregate with the query builder.',
        lessons: [
          { title: 'Select and where clauses', durationSec: 540 },
          { title: 'Joins versus the relational query API', durationSec: 780 },
          { title: 'Aggregates and raw SQL fragments', durationSec: 600 },
          { title: 'Pagination patterns', durationSec: 480 },
        ],
      },
      {
        title: 'Migrations',
        description: 'Generate migrations from the schema and apply them safely.',
        lessons: [
          { title: 'Generating migrations with drizzle-kit', durationSec: 420 },
          { title: 'Reviewing the generated SQL', durationSec: 360 },
          { title: 'Seeding a development database', durationSec: 540 },
        ],
      },
      {
        title: 'Transactions and Testing',
        description: 'Keep related writes consistent and test them against a real database.',
        lessons: [
          { title: 'Transactions and row locks', durationSec: 660 },
          { title: 'Testing queries with rollbacks', durationSec: 720 },
        ],
      },
    ],
  },
  {
    title: 'Designing Interfaces with Chakra UI v3',
    subtitle: 'Build accessible, themeable components with tokens and recipes',
    description:
      'Design a consistent interface with Chakra UI v3, from the first provider to a complete dashboard. You will define brand colours as tokens, support dark mode with semantic tokens and package component styles into recipes. The final chapters combine everything into forms, navigation and layouts.',
    status: 'archived',
    price: '29.00',
    rating: '4.38',
    ratingCount: 92,
    publishedAt: new Date('2025-07-01T10:00:00Z'),
    createdAt: new Date('2025-06-10T13:00:00Z'),
    updatedAt: new Date('2026-06-12T09:30:00Z'),
    thumbnailFile: 'thumbnail-3.jpg',
    lessons: [{ title: 'Course trailer', durationSec: 120, isFreePreview: true }],
    chapters: [
      {
        title: 'Foundations',
        description: 'Install Chakra UI v3 and learn how its style props work.',
        lessons: [
          { title: 'Setting up the provider', durationSec: 360, isFreePreview: true },
          { title: 'Style props and the styling system', durationSec: 540 },
          { title: 'Responsive values', durationSec: 420 },
        ],
      },
      {
        title: 'Theming with Tokens',
        description: 'Define brand colours, spacing and typography as design tokens.',
        lessons: [
          { title: 'Core tokens versus semantic tokens', durationSec: 600 },
          { title: 'Adding a brand colour palette', durationSec: 480 },
          { title: 'Dark mode with semantic tokens', durationSec: 540 },
          { title: 'Text styles and layer styles', durationSec: 420 },
        ],
      },
      {
        title: 'Recipes',
        description: 'Package component styles into recipes and slot recipes.',
        lessons: [
          { title: 'Writing your first recipe', durationSec: 660 },
          { title: 'Variants and compound variants', durationSec: 600 },
          { title: 'Slot recipes for multi-part components', durationSec: 720 },
          { title: 'Generating types with the CLI', durationSec: 300 },
        ],
      },
      {
        title: 'Building Real Layouts',
        description: 'Combine components into forms, navigation and dashboards.',
        lessons: [
          { title: 'An accessible sign-in form', durationSec: 780 },
          { title: 'A responsive navigation bar', durationSec: 660 },
          { title: 'A dashboard grid with cards', durationSec: 840 },
        ],
      },
    ],
  },
]
