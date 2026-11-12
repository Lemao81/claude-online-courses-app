import { CloseButton, Grid, Heading } from '@chakra-ui/react'
import { Link as RouterLink } from '@tanstack/react-router'
import { LuArrowLeft } from 'react-icons/lu'
import CoursePublishControls from '@/components/courses/CoursePublishControls'
import { appbarHeightVariable } from '@/constants'
import type { CourseOutline } from '@/types'

type CourseEditorHeaderProps = {
  course: CourseOutline
}

export default function CourseEditorHeader({ course }: CourseEditorHeaderProps): React.JSX.Element {
  return (
    <Grid
      as="header"
      position="sticky"
      top={`var(${appbarHeightVariable}, 0px)`}
      zIndex="40"
      templateColumns="1fr auto 1fr"
      templateAreas={{
        base: '"back title ." "controls controls controls"',
        md: '"back title controls"',
      }}
      alignItems="center"
      columnGap="3"
      rowGap="2"
      py="3"
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg"
    >
      <CloseButton asChild gridArea="back" justifySelf="start" size="lg" variant="quiet">
        <RouterLink to="/mycourses" aria-label="Back to My Courses">
          <LuArrowLeft aria-hidden="true" />
        </RouterLink>
      </CloseButton>
      <Heading as="h1" gridArea="title" m="0" minW="0" fontSize="xl" color="fg" textAlign="center">
        {course.title}
      </Heading>
      <CoursePublishControls course={course} />
    </Grid>
  )
}
