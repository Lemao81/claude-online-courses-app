import { CloseButton, Grid, Heading } from '@chakra-ui/react'
import { Link as RouterLink } from '@tanstack/react-router'
import { LuArrowLeft } from 'react-icons/lu'

type CourseEditorTitleBarProps = {
  title: string
}

export default function CourseEditorTitleBar({ title }: CourseEditorTitleBarProps) {
  return (
    <Grid templateColumns="1fr auto 1fr" alignItems="center" gap="3">
      <CloseButton asChild justifySelf="start" size="lg" variant="quiet">
        <RouterLink to="/mycourses" aria-label="Back to My Courses">
          <LuArrowLeft aria-hidden="true" />
        </RouterLink>
      </CloseButton>
      <Heading as="h1" gridColumn="2" m="0" minW="0" fontSize="xl" color="fg" textAlign="center">
        {title}
      </Heading>
    </Grid>
  )
}
