-- Consulting cycle 1 now recruits for two divisions (Consulting and Knowledge
-- Team) with a role chosen inside each one, the way the functional form works.
-- Run this in the Supabase SQL editor before the form goes live.
--
-- The original flat columns are kept and still written to: "firstChoicePosition"
-- and "secondChoicePosition" hold the resolved role, "documentLink"/"cvLink"
-- hold the first choice's links. That keeps the admin dashboard and the NOT NULL
-- constraints working without a destructive migration.

-- No DEFAULTs on purpose: the submit route always sends these explicitly, and a
-- default would silently backfill pre-existing rows with an answer the
-- applicant never gave. NULL honestly means "not recorded".
ALTER TABLE "consulting-batch1-26-27-submissions"
  ADD COLUMN IF NOT EXISTS "onePosition" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "twoPositions" BOOLEAN,

  -- Division per choice
  ADD COLUMN IF NOT EXISTS "firstChoice" TEXT,
  ADD COLUMN IF NOT EXISTS "secondChoice" TEXT,

  -- Role per choice: Project Leader, Project Analyst or Knowledge Analyst.
  -- "openToAnalyst" is a Yes/No only Project Leader applicants are asked, so it
  -- is stored as text and left blank for everyone else.
  ADD COLUMN IF NOT EXISTS "first_role" TEXT,
  ADD COLUMN IF NOT EXISTS "first_openToAnalyst" TEXT,
  ADD COLUMN IF NOT EXISTS "first_documentLink" TEXT,
  ADD COLUMN IF NOT EXISTS "first_cvLink" TEXT,

  ADD COLUMN IF NOT EXISTS "second_role" TEXT,
  ADD COLUMN IF NOT EXISTS "second_openToAnalyst" TEXT,
  ADD COLUMN IF NOT EXISTS "second_documentLink" TEXT,
  ADD COLUMN IF NOT EXISTS "second_cvLink" TEXT;
