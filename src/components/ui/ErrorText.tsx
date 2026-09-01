import { type SystemStyleObject, Text } from '@chakra-ui/react'
import { formErrorStyles } from '#/styles/formStyles'

type ErrorTextProps = {
  message: string
  css?: SystemStyleObject
}

export default function ErrorText({ message, css }: ErrorTextProps) {
  if (message === '') {
    return null
  }

  return (
    <Text css={{ ...formErrorStyles, ...css }} role="alert">
      {message}
    </Text>
  )
}
