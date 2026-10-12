import { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanStackRouter, type Router } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from '#/routeTree.gen'

export type AppRouterContext = {
  queryClient: QueryClient
}

export function getRouter(): Router<typeof routeTree> {
  const context: AppRouterContext = {
    queryClient: new QueryClient(),
  }

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

  return router
}

declare module '@tanstack/react-router' {
  // biome-ignore lint/style/useConsistentTypeDefinitions: module augmentation needs an interface to merge
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
