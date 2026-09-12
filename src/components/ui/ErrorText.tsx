import { type SystemStyleObject, Text } from '@chakra-ui/react'

type ErrorTextProps = {
  message: string
  css?: SystemStyleObject
}

export default function ErrorText({ message, css }: ErrorTextProps) {
  if (message === '') {
    return null
  }

  return (
    <Text textStyle="errorText" css={css} role="alert">
      {message}
    </Text>
  )
}
