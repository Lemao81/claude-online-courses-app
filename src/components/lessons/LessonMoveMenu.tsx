import { IconButton, Menu, Portal } from '@chakra-ui/react'
import { useEffect, useId, useRef } from 'react'
import { LuFolderInput } from 'react-icons/lu'
import Tooltip from '@/components/ui/Tooltip'
import { useLessonMove } from '@/hooks/use-lesson-move'
import type { LessonVideo } from '@/types'
import { toLessonGroup } from '@/utils/outline-helpers'

type LessonMoveMenuProps = {
  lesson: LessonVideo
  chapterId: number | null
}

export default function LessonMoveMenu({
  lesson,
  chapterId,
}: LessonMoveMenuProps): React.JSX.Element | null {
  const { targets, moveLesson, claimFocus } = useLessonMove()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const triggerId = useId()

  useEffect(() => {
    if (claimFocus(lesson.id)) {
      triggerRef.current?.focus()
    }
  }, [claimFocus, lesson.id])

  const otherTargets = targets.filter((t) => t.chapterId !== chapterId)
  if (otherTargets.length === 0) {
    return null
  }

  return (
    <Menu.Root ids={{ trigger: triggerId }}>
      <Tooltip ids={{ trigger: triggerId }} content="Move to…" showArrow>
        <Menu.Trigger asChild>
          <IconButton
            ref={triggerRef}
            size="sm"
            variant="quiet"
            _icon={{ boxSize: '5' }}
            aria-label={`Move ${lesson.title} to…`}
          >
            <LuFolderInput aria-hidden="true" />
          </IconButton>
        </Menu.Trigger>
      </Tooltip>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Move to</Menu.ItemGroupLabel>
              {otherTargets.map((t) => (
                <Menu.Item
                  key={toLessonGroup(t.chapterId)}
                  value={toLessonGroup(t.chapterId)}
                  onSelect={() => moveLesson(lesson.id, t.chapterId)}
                >
                  {t.label}
                </Menu.Item>
              ))}
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
