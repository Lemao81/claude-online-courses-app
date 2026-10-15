import { Heading, Stack } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import CourseDetailsForm, {
  type CourseDetailsFormValues,
  useCourseDetailsForm,
} from '@/components/courses/CourseDetailsForm'
import { updateCourse } from '@/server/functions/courses-functions'
import type { Course } from '@/types'

type CourseDetailsSectionProps = {
  course: Course
}

function toSavedValues(course: Course): CourseDetailsFormValues {
  return {
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    price: course.price,
  }
}

function isSameValues(value: CourseDetailsFormValues, other: CourseDetailsFormValues): boolean {
  return (
    value.title === other.title &&
    value.subtitle === other.subtitle &&
    value.description === other.description &&
    value.price === other.price
  )
}

export default function CourseDetailsSection({
  course,
}: CourseDetailsSectionProps): React.JSX.Element {
  const router = useRouter()
  const [autoSaveError, setAutoSaveError] = useState('')
  const savedValues = useRef(toSavedValues(course))
  const { form, formId } = useCourseDetailsForm(course)

  async function handleAutoSave(value: CourseDetailsFormValues): Promise<void> {
    if (isSameValues(value, savedValues.current)) {
      return
    }

    setAutoSaveError('')
    try {
      await updateCourse({ data: { id: course.id, ...value } })
    } catch (error) {
      console.error(error)
      setAutoSaveError(error instanceof Error ? error.message : 'Failed to save the course details')

      return
    }

    savedValues.current = value
    await router.invalidate()
  }

  return (
    <Stack as="section" gap="3">
      <Heading as="h2" m="0" textStyle="sectionHeading">
        Details
      </Heading>
      <CourseDetailsForm
        form={form}
        formId={formId}
        autoSaveError={autoSaveError}
        onAutoSave={handleAutoSave}
      />
    </Stack>
  )
}
