import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import AppToaster from '#/components/ui/AppToaster'
import MainLayout from '#/layouts/MainLayout'
import AppChakraProvider from '#/providers/AppChakraProvider.tsx'
import AppClerkProvider from '#/providers/AppClerkProvider.tsx'
import {ReactQueryDevtoolsPanel} from "@tanstack/react-query-devtools";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');if(stored==='light'||stored==='dark'){document.documentElement.classList.add(stored)}}catch(e){}})();`

type RootDocumentProps = {
  children: React.ReactNode
}

export default function RootDocument({ children }: RootDocumentProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: trusted scaffold script */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="antialiased wrap-anywhere selection:bg-[color-mix(in_oklab,var(--lagoon)_24%,transparent)]">
        <AppChakraProvider>
          <AppClerkProvider>
            <MainLayout>{children}</MainLayout>
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                {
                  name: 'Tanstack Query',
                  render: <ReactQueryDevtoolsPanel />,
                },
              ]}
            />
          </AppClerkProvider>
          <AppToaster />
        </AppChakraProvider>
        <Scripts />
      </body>
    </html>
  )
}
