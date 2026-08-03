import { relations } from 'drizzle-orm'
import {
  assets,
  chapters,
  courses,
  courseTags,
  enrollments,
  lessonProgress,
  lessons,
  reviews,
  tags,
  users,
} from '#/server/db/schema'

export const assetsRelations = relations(assets, ({ one, many }) => ({
  owner: one(users, {
    fields: [assets.ownerId],
    references: [users.id],
  }),
  lessons: many(lessons),
  courses: many(courses),
}))

export const usersRelations = relations(users, ({ many }) => ({
  authoredCourses: many(courses),
  assets: many(assets),
  reviews: many(reviews),
  enrollments: many(enrollments),
  lessonProgress: many(lessonProgress),
}))

export const coursesRelations = relations(courses, ({ one, many }) => ({
  author: one(users, {
    fields: [courses.authorId],
    references: [users.id],
  }),
  thumbnail: one(assets, {
    fields: [courses.thumbnailAssetId],
    references: [assets.id],
  }),
  chapters: many(chapters),
  lessons: many(lessons),
  reviews: many(reviews),
  enrollments: many(enrollments),
  lessonProgress: many(lessonProgress),
  courseTags: many(courseTags),
}))

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}))

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  chapter: one(chapters, {
    fields: [lessons.chapterId],
    references: [chapters.id],
  }),
  videoAsset: one(assets, {
    fields: [lessons.videoAssetId],
    references: [assets.id],
  }),
  lessonProgress: many(lessonProgress),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [reviews.courseId],
    references: [courses.id],
  }),
}))

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}))

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [lessonProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonProgress.lessonId],
    references: [lessons.id],
  }),
  course: one(courses, {
    fields: [lessonProgress.courseId],
    references: [courses.id],
  }),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  courseTags: many(courseTags),
}))

export const courseTagsRelations = relations(courseTags, ({ one }) => ({
  course: one(courses, {
    fields: [courseTags.courseId],
    references: [courses.id],
  }),
  tag: one(tags, {
    fields: [courseTags.tagId],
    references: [tags.id],
  }),
}))
