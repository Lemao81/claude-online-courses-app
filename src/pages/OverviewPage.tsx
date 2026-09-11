import { Flex, Text } from '@chakra-ui/react'
import Greeting from '#/components/overview/Greeting'

export default function OverviewPage() {
  return (
    <Flex direction="column" gap="4" w="full" maxW="4xl" mx="auto" px="4" py="6">
      <Greeting />
      <Text textStyle="subtitle">Your overview will show up here soon.</Text>
    </Flex>
  )
}
