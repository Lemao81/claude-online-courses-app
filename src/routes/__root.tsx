import { createRootRouteWithContext } from '@tanstack/react-router'
import RootDocument from '#/components/layout/RootDocument'
import type { AppRouterContext } from '#/router'
import appCss from '#/styles.css?url'

export const Route = createRootRouteWithContext<AppRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Online Courses',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})
