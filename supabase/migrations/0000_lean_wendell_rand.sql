CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" varchar,
	"title" varchar,
	"content" text,
	"cover" varchar,
	"workspace_id" uuid DEFAULT gen_random_uuid()
);
