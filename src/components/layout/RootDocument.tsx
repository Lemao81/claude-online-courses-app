import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import MainLayout from '#/components/layout/MainLayout'
import TanStackQueryDevtools from '#/integrations/tanstack-query/devtools'
import AppChakraProvider from '#/providers/AppChakraProvider.tsx'
import AppClerkProvider from '#/providers/AppClerkProvider.tsx'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');if(stored==='light'||stored==='dark'){document.documentElement.setAttribute('data-theme',stored)}}catch(e){}})();`

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
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
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
                TanStackQueryDevtools,
              ]}
            />
          </AppClerkProvider>
        </AppChakraProvider>
        <Scripts />
      </body>
    </html>
  )
}
