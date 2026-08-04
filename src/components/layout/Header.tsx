import {
  Box,
  Flex,
  Heading,
  Icon,
  Link,
  type SystemStyleObject,
  VisuallyHidden,
} from '@chakra-ui/react'
import { Link as RouterLink } from '@tanstack/react-router'
import ClerkHeader from '#/components/layout/ClerkHeader'
import ColorModeButton from '#/components/ui/ColorModeButton'

const demoLinkStyles: SystemStyleObject = {
  display: 'block',
  rounded: 'lg',
  px: '3',
  py: '2',
  fontSize: 'sm',
  color: 'var(--sea-ink-soft)',
  textDecoration: 'none',
  transition: 'all 0.15s ease',
  _hover: { bg: 'var(--link-bg-hover)', color: 'var(--sea-ink)' },
}

export default function Header() {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="50"
      borderBottomWidth="1px"
      borderColor="var(--line)"
      bg="var(--header-bg)"
      px="4"
      backdropFilter="blur(16px)"
    >
      <Flex
        as="nav"
        className="page-wrap"
        wrap="wrap"
        align="center"
        columnGap="3"
        rowGap="2"
        py={{ base: '3', sm: '4' }}
      >
        <Heading
          as="h2"
          m="0"
          flexShrink="0"
          fontSize="md"
          fontWeight="semibold"
          letterSpacing="tight"
        >
          <Link
            asChild
            display="inline-flex"
            alignItems="center"
            gap="2"
            rounded="full"
            borderWidth="1px"
            borderColor="var(--chip-line)"
            bg="var(--chip-bg)"
            px={{ base: '3', sm: '4' }}
            py={{ base: '1.5', sm: '2' }}
            fontSize="sm"
            color="var(--sea-ink)"
            textDecoration="none"
            boxShadow="0 8px 24px rgba(30,90,72,0.08)"
          >
            <RouterLink to="/">
              <Box
                as="span"
                boxSize="2"
                rounded="full"
                bgImage="linear-gradient(90deg,#56c6be,#7ed3bf)"
              />
              TanStack Start
            </RouterLink>
          </Link>
        </Heading>

        <Flex
          order={{ base: 3, sm: 0 }}
          w={{ base: 'full', sm: 'auto' }}
          wrap={{ base: 'wrap', sm: 'nowrap' }}
          align="center"
          columnGap="4"
          rowGap="1"
          pb={{ base: '1', sm: '0' }}
          fontSize="sm"
          fontWeight="semibold"
        >
          <RouterLink to="/" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
            Home
          </RouterLink>
          <RouterLink
            to="/about"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            About
          </RouterLink>
          <Link
            href="https://tanstack.com/start/latest/docs/framework/react/overview"
            className="nav-link"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </Link>
          <Box as="details" position="relative" w={{ base: 'full', sm: 'auto' }}>
            <Box as="summary" className="nav-link" listStyleType="none" cursor="pointer">
              Demos
            </Box>
            <Box
              mt="2"
              minW="56"
              rounded="xl"
              borderWidth="1px"
              borderColor="var(--line)"
              bg="var(--header-bg)"
              p="2"
              boxShadow="lg"
              position={{ sm: 'absolute' }}
              right={{ sm: '0' }}
            >
              <Link href="/demo/clerk" css={demoLinkStyles}>
                Clerk
              </Link>
              <Link href="/demo/db-chat" css={demoLinkStyles}>
                DB Chat
              </Link>
              <Link href="/demo/drizzle" css={demoLinkStyles}>
                Drizzle
              </Link>
              <Link href="/demo/form/simple" css={demoLinkStyles}>
                Simple Form
              </Link>
              <Link href="/demo/form/address" css={demoLinkStyles}>
                Address Form
              </Link>
              <Link href="/demo/tanstack-query" css={demoLinkStyles}>
                TanStack Query
              </Link>
            </Box>
          </Box>
        </Flex>

        <Flex ml="auto" align="center" gap={{ base: '3', sm: '4' }}>
          <Link
            href="https://x.com/tan_stack"
            target="_blank"
            rel="noreferrer"
            display={{ base: 'none', sm: 'block' }}
            rounded="xl"
            p="2"
            color="var(--sea-ink-soft)"
            transition="all 0.15s ease"
            _hover={{ bg: 'var(--link-bg-hover)', color: 'var(--sea-ink)' }}
          >
            <VisuallyHidden>Follow TanStack on X</VisuallyHidden>
            <Icon viewBox="0 0 16 16" boxSize="6" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12.6 1h2.2L10 6.48 15.64 15h-4.41L7.78 9.82 3.23 15H1l5.14-5.84L.72 1h4.52l3.12 4.73L12.6 1zm-.77 12.67h1.22L4.57 2.26H3.26l8.57 11.41z"
              />
            </Icon>
          </Link>
          <Link
            href="https://github.com/TanStack"
            target="_blank"
            rel="noreferrer"
            display={{ base: 'none', sm: 'block' }}
            rounded="xl"
            p="2"
            color="var(--sea-ink-soft)"
            transition="all 0.15s ease"
            _hover={{ bg: 'var(--link-bg-hover)', color: 'var(--sea-ink)' }}
          >
            <VisuallyHidden>Go to TanStack GitHub</VisuallyHidden>
            <Icon viewBox="0 0 16 16" boxSize="6" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </Icon>
          </Link>
          <ClerkHeader />

          <ColorModeButton />
        </Flex>
      </Flex>
    </Box>
  )
}
