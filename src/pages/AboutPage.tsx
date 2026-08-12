import { Box, Heading, Text } from '@chakra-ui/react'

export default function AboutPage() {
  return (
    <Box px="4" py="12">
      <Box as="section" className="island-shell" rounded="card" p={{ base: '6', sm: '8' }}>
        <Text className="island-kicker" mb="2">
          About
        </Text>
        <Heading
          as="h1"
          className="display-title"
          mb="3"
          fontSize={{ base: '4xl', sm: '5xl' }}
          fontWeight="bold"
          color="fg"
        >
          Learn at your own pace.
        </Heading>
        <Text m="0" maxW="3xl" fontSize="md" lineHeight="2rem" color="fg.muted">
          Browse courses taught by people who work in the field, follow along chapter by chapter,
          and pick up exactly where you left off. Every lesson tracks your progress, so a short
          session on the train counts just as much as a long evening at your desk.
        </Text>
      </Box>
    </Box>
  )
}
