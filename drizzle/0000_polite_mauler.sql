CREATE SCHEMA "coca";
--> statement-breakpoint
CREATE TYPE "coca"."asset_kind" AS ENUM('video', 'image', 'attachment');--> statement-breakpoint
CREATE TYPE "coca"."asset_status" AS ENUM('pending', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "coca"."course_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "coca"."assets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "coca"."assets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"owner_id" text NOT NULL,
	"kind" "coca"."asset_kind" NOT NULL,
	"status" "coca"."asset_status" DEFAULT 'pending' NOT NULL,
	"bucket" text NOT NULL,
	"object_name" text NOT NULL,
	"content_type" text NOT NULL,
	"size_bytes" bigint DEFAULT 0 NOT NULL,
	"checksum" text,
	"duration_sec" integer,
	"width" integer,
	"height" integer,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coca"."chapters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "coca"."chapters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"course_id" integer NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"duration_sec" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chapters_id_course_id_unique" UNIQUE("id","course_id")
);
--> statement-breakpoint
CREATE TABLE "coca"."course_tags" (
	"course_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_tags_course_id_tag_id_pk" PRIMARY KEY("course_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "coca"."courses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "coca"."courses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"description" text NOT NULL,
	"author_id" text NOT NULL,
	"status" "coca"."course_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"thumbnail_asset_id" integer,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"rating" numeric(3, 2),
	"rating_count" integer DEFAULT 0 NOT NULL,
	"duration_sec" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "courses_published_at_check" CHECK ("coca"."courses"."status" <> 'published' OR "coca"."courses"."published_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "coca"."enrollments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "coca"."enrollments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"course_id" integer NOT NULL,
	"price_paid" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coca"."lesson_progress" (
	"user_id" text NOT NULL,
	"lesson_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"watched_sec" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lesson_progress_user_id_lesson_id_pk" PRIMARY KEY("user_id","lesson_id")
);
--> statement-breakpoint
CREATE TABLE "coca"."lessons" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "coca"."lessons_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"course_id" integer NOT NULL,
	"chapter_id" integer,
	"position" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"video_asset_id" integer,
	"is_free_preview" boolean DEFAULT false NOT NULL,
	"duration_sec" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coca"."reviews" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "coca"."reviews_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text,
	"course_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_rating_range_check" CHECK ("coca"."reviews"."rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "coca"."tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "coca"."tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"display" text NOT NULL,
	"normalized" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_normalized_unique" UNIQUE("normalized")
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "todos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coca"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"first_name" text,
	"last_name" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coca"."assets" ADD CONSTRAINT "assets_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "coca"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."chapters" ADD CONSTRAINT "chapters_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "coca"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."course_tags" ADD CONSTRAINT "course_tags_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "coca"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."course_tags" ADD CONSTRAINT "course_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "coca"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."courses" ADD CONSTRAINT "courses_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "coca"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."courses" ADD CONSTRAINT "courses_thumbnail_asset_id_assets_id_fk" FOREIGN KEY ("thumbnail_asset_id") REFERENCES "coca"."assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "coca"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "coca"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."lesson_progress" ADD CONSTRAINT "lesson_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "coca"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "coca"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."lesson_progress" ADD CONSTRAINT "lesson_progress_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "coca"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "coca"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."lessons" ADD CONSTRAINT "lessons_video_asset_id_assets_id_fk" FOREIGN KEY ("video_asset_id") REFERENCES "coca"."assets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."lessons" ADD CONSTRAINT "lessons_chapter_id_course_id_fk" FOREIGN KEY ("chapter_id","course_id") REFERENCES "coca"."chapters"("id","course_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "coca"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coca"."reviews" ADD CONSTRAINT "reviews_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "coca"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "assets_bucket_object_name_idx" ON "coca"."assets" USING btree ("bucket","object_name");--> statement-breakpoint
CREATE INDEX "assets_owner_id_idx" ON "coca"."assets" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "assets_status_idx" ON "coca"."assets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "assets_deleted_at_idx" ON "coca"."assets" USING btree ("deleted_at") WHERE "coca"."assets"."deleted_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "chapters_course_id_position_idx" ON "coca"."chapters" USING btree ("course_id","position");--> statement-breakpoint
CREATE INDEX "course_tags_tag_id_idx" ON "coca"."course_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "courses_author_id_idx" ON "coca"."courses" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "courses_thumbnail_asset_id_idx" ON "coca"."courses" USING btree ("thumbnail_asset_id");--> statement-breakpoint
CREATE INDEX "courses_status_published_at_idx" ON "coca"."courses" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "enrollments_course_id_idx" ON "coca"."enrollments" USING btree ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "enrollments_user_id_course_id_idx" ON "coca"."enrollments" USING btree ("user_id","course_id");--> statement-breakpoint
CREATE INDEX "lesson_progress_user_id_course_id_idx" ON "coca"."lesson_progress" USING btree ("user_id","course_id");--> statement-breakpoint
CREATE INDEX "lesson_progress_lesson_id_idx" ON "coca"."lesson_progress" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lessons_course_id_position_idx" ON "coca"."lessons" USING btree ("course_id","position");--> statement-breakpoint
CREATE INDEX "lessons_chapter_id_position_idx" ON "coca"."lessons" USING btree ("chapter_id","position");--> statement-breakpoint
CREATE INDEX "lessons_video_asset_id_idx" ON "coca"."lessons" USING btree ("video_asset_id");--> statement-breakpoint
CREATE INDEX "reviews_course_id_idx" ON "coca"."reviews" USING btree ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_user_id_course_id_idx" ON "coca"."reviews" USING btree ("user_id","course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "coca"."users" USING btree ("email");