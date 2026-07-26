import { relations, sql } from 'drizzle-orm'
import {
  bigint,
  boolean,
  check,
  foreignKey,
  index,
  integer,
  numeric,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { timestamps } from '#/db/columns.helpers.ts'

export const coca = pgSchema('coca')

export const courseStatus = coca.enum('course_status', ['draft', 'published', 'archived'])

export const assetKind = coca.enum('asset_kind', ['video', 'image', 'attachment'])

export const assetStatus = coca.enum('asset_status', ['pending', 'ready', 'failed'])

export const todos = pgTable('todos', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  ...timestamps,
})

export const users = coca.table(
  'users',
  {
    id: text().primaryKey(),
    email: text(),
    firstName: text(),
    lastName: text(),
    imageUrl: text(),
    ...timestamps,
  },
  (table) => [uniqueIndex('users_email_idx').on(table.email)],
)

export const assets = coca.table(
  'assets',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    ownerId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    kind: assetKind().notNull(),
    status: assetStatus().notNull().default('pending'),
    bucket: text().notNull(),
    objectName: text().notNull(),
    contentType: text().notNull(),
    sizeBytes: bigint({ mode: 'number' }).notNull().default(0),
    checksum: text(),
    durationSec: integer(),
    width: integer(),
    height: integer(),
    deletedAt: timestamp({ withTimezone: true, mode: 'date' }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('assets_bucket_object_name_idx').on(table.bucket, table.objectName),
    index('assets_owner_id_idx').on(table.ownerId),
    index('assets_status_idx').on(table.status),
    index('assets_deleted_at_idx').on(table.deletedAt).where(sql`${table.deletedAt} IS NOT NULL`),
  ],
)

export const courses = coca.table(
  'courses',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    subtitle: text().notNull(),
    description: text().notNull(),
    authorId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    status: courseStatus().notNull().default('draft'),
    publishedAt: timestamp({ withTimezone: true, mode: 'date' }),
    thumbnailAssetId: integer().references(() => assets.id, { onDelete: 'set null' }),
    price: numeric({ precision: 10, scale: 2 }).notNull().default('0'),
    rating: numeric({ precision: 3, scale: 2 }),
    ratingCount: integer().notNull().default(0),
    durationSec: integer().notNull().default(0),
    ...timestamps,
  },
  (table) => [
    index('courses_author_id_idx').on(table.authorId),
    index('courses_thumbnail_asset_id_idx').on(table.thumbnailAssetId),
    index('courses_status_published_at_idx').on(table.status, table.publishedAt),
    check(
      'courses_published_at_check',
      sql`${table.status} <> 'published' OR ${table.publishedAt} IS NOT NULL`,
    ),
  ],
)

export const chapters = coca.table(
  'chapters',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer()
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    position: integer().notNull().default(0),
    title: text().notNull(),
    description: text().notNull(),
    durationSec: integer().notNull().default(0),
    ...timestamps,
  },
  (table) => [
    index('chapters_course_id_position_idx').on(table.courseId, table.position),
    unique('chapters_id_course_id_unique').on(table.id, table.courseId),
  ],
)

export const lessons = coca.table(
  'lessons',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    courseId: integer()
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    chapterId: integer(),
    position: integer().notNull().default(0),
    title: text().notNull(),
    videoAssetId: integer().references(() => assets.id, { onDelete: 'restrict' }),
    isFreePreview: boolean().notNull().default(false),
    durationSec: integer().notNull().default(0),
    ...timestamps,
  },
  (table) => [
    index('lessons_course_id_position_idx').on(table.courseId, table.position),
    index('lessons_chapter_id_position_idx').on(table.chapterId, table.position),
    index('lessons_video_asset_id_idx').on(table.videoAssetId),
    foreignKey({
      name: 'lessons_chapter_id_course_id_fk',
      columns: [table.chapterId, table.courseId],
      foreignColumns: [chapters.id, chapters.courseId],
    }),
  ],
)

export const reviews = coca.table(
  'reviews',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: text().references(() => users.id, { onDelete: 'set null' }),
    courseId: integer()
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    rating: integer().notNull(),
    comment: text(),
    ...timestamps,
  },
  (table) => [
    index('reviews_course_id_idx').on(table.courseId),
    uniqueIndex('reviews_user_id_course_id_idx').on(table.userId, table.courseId),
    check('reviews_rating_range_check', sql`${table.rating} BETWEEN 1 AND 5`),
  ],
)

export const enrollments = coca.table(
  'enrollments',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: integer()
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    pricePaid: numeric({ precision: 10, scale: 2 }).notNull(),
    ...timestamps,
  },
  (table) => [
    index('enrollments_course_id_idx').on(table.courseId),
    uniqueIndex('enrollments_user_id_course_id_idx').on(table.userId, table.courseId),
  ],
)

export const lessonProgress = coca.table(
  'lesson_progress',
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: integer()
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    courseId: integer()
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    watchedSec: integer().notNull().default(0),
    completedAt: timestamp({ withTimezone: true, mode: 'date' }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.lessonId] }),
    index('lesson_progress_user_id_course_id_idx').on(table.userId, table.courseId),
    index('lesson_progress_lesson_id_idx').on(table.lessonId),
  ],
)

export const tags = coca.table('tags', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  display: text().notNull(),
  normalized: text().notNull().unique(),
  ...timestamps,
})

export const courseTags = coca.table(
  'course_tags',
  {
    courseId: integer()
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    tagId: integer()
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.courseId, table.tagId] }),
    index('course_tags_tag_id_idx').on(table.tagId),
  ],
)

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
