CREATE SCHEMA "yanta";
--> statement-breakpoint
CREATE TABLE "yanta"."pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_modified" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" varchar,
	"title" varchar DEFAULT 'New Title' NOT NULL,
	"content" jsonb,
	"cover" varchar,
	"archived_on" timestamp with time zone,
	"workspace_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "yanta"."workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar DEFAULT 'New Workspace' NOT NULL,
	"pages" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" varchar NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "yanta"."pages" ADD CONSTRAINT "pages_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "yanta"."workspaces"("id") ON DELETE no action ON UPDATE no action;