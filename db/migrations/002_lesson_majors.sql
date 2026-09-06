ALTER TABLE lesson_summaries
ADD COLUMN major text NOT NULL DEFAULT 'Computer Science';

ALTER TABLE lesson_summaries
ALTER COLUMN major DROP DEFAULT;

CREATE INDEX lesson_summaries_cohort_major_idx ON lesson_summaries(cohort_id, major);
CREATE UNIQUE INDEX lesson_summaries_cohort_major_title_idx ON lesson_summaries(cohort_id, major, title);
CREATE UNIQUE INDEX software_resources_cohort_title_idx ON software_resources(cohort_id, title);
