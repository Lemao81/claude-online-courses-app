import { Box, Code, Flex, Heading, Link, List, SimpleGrid, Text } from '@chakra-ui/react'

export default function LandingPage() {
  return (
    <Box px="4" pb="8" pt="14">
      <Box
        as="section"
        className="island-shell rise-in"
        position="relative"
        overflow="hidden"
        rounded="2rem"
        px={{ base: '6', sm: '10' }}
        py={{ base: '10', sm: '14' }}
      >
        <Box
          pointerEvents="none"
          position="absolute"
          left="-5rem"
          top="-6rem"
          boxSize="14rem"
          rounded="full"
          bgImage="radial-gradient(circle, rgba(79,184,178,0.32), transparent 66%)"
        />
        <Box
          pointerEvents="none"
          position="absolute"
          bottom="-5rem"
          right="-5rem"
          boxSize="14rem"
          rounded="full"
          bgImage="radial-gradient(circle, rgba(47,106,74,0.18), transparent 66%)"
        />
        <Text className="island-kicker" mb="3">
          TanStack Start Base Template
        </Text>
        <Heading
          as="h1"
          className="display-title"
          mb="5"
          maxW="3xl"
          fontSize={{ base: '4xl', sm: '6xl' }}
          lineHeight="1.02"
          fontWeight="bold"
          letterSpacing="tight"
          color="var(--sea-ink)"
        >
          Start simple, ship quickly.
        </Heading>
        <Text mb="8" maxW="2xl" fontSize={{ base: 'md', sm: 'lg' }} color="var(--sea-ink-soft)">
          This base starter intentionally keeps things light: two routes, clean structure, and the
          essentials you need to build from scratch.
        </Text>
        <Flex wrap="wrap" gap="3">
          <Link
            href="/about"
            rounded="full"
            borderWidth="1px"
            borderColor="rgba(50,143,151,0.3)"
            bg="rgba(79,184,178,0.14)"
            px="5"
            py="2.5"
            fontSize="sm"
            fontWeight="semibold"
            color="var(--lagoon-deep)"
            textDecoration="none"
            transition="all 0.15s ease"
            _hover={{ transform: 'translateY(-0.125rem)', bg: 'rgba(79,184,178,0.24)' }}
          >
            About This Starter
          </Link>
          <Link
            href="https://tanstack.com/router"
            target="_blank"
            rel="noopener noreferrer"
            rounded="full"
            borderWidth="1px"
            borderColor="rgba(23,58,64,0.2)"
            bg="rgba(255,255,255,0.5)"
            px="5"
            py="2.5"
            fontSize="sm"
            fontWeight="semibold"
            color="var(--sea-ink)"
            textDecoration="none"
            transition="all 0.15s ease"
            _hover={{ transform: 'translateY(-0.125rem)', borderColor: 'rgba(23,58,64,0.35)' }}
          >
            Router Guide
          </Link>
        </Flex>
      </Box>

      <SimpleGrid as="section" mt="8" gap="4" columns={{ base: 1, sm: 2, lg: 4 }}>
        {[
          ['Type-Safe Routing', 'Routes and links stay in sync across every page.'],
          ['Server Functions', 'Call server code from your UI without creating API boilerplate.'],
          ['Streaming by Default', 'Ship progressively rendered responses for faster experiences.'],
          ['Tailwind Native', 'Design quickly with utility-first styling and reusable tokens.'],
        ].map(([title, desc], index) => (
          <Box
            as="article"
            key={title}
            className="island-shell feature-card rise-in"
            rounded="2xl"
            p="5"
            animationDelay={`${index * 90 + 80}ms`}
          >
            <Heading as="h2" mb="2" fontSize="md" fontWeight="semibold" color="var(--sea-ink)">
              {title}
            </Heading>
            <Text m="0" fontSize="sm" color="var(--sea-ink-soft)">
              {desc}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Box as="section" className="island-shell" mt="8" rounded="2xl" p="6">
        <Text className="island-kicker" mb="2">
          Quick Start
        </Text>
        <List.Root
          m="0"
          gap="2"
          ps="5"
          listStyleType="disc"
          fontSize="sm"
          color="var(--sea-ink-soft)"
        >
          <List.Item>
            Edit <Code>src/routes/index.tsx</Code> to customize the home page.
          </List.Item>
          <List.Item>
            Update <Code>src/components/layout/Header.tsx</Code> and{' '}
            <Code>src/components/layout/Footer.tsx</Code> for brand links.
          </List.Item>
          <List.Item>
            Add routes in <Code>src/routes</Code> and tweak visual tokens in{' '}
            <Code>src/styles.css</Code>.
          </List.Item>
        </List.Root>
      </Box>
    </Box>
  )
}
