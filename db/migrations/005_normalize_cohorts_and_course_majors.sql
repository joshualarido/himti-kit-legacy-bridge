ALTER TABLE cohorts ADD COLUMN batch smallint;

UPDATE cohorts
SET batch = substring(lower(trim(name)) FROM '^binusian\s+b?([0-9]{2})$')::smallint
WHERE substring(lower(trim(name)) FROM '^binusian\s+b?([0-9]{2})$')::int BETWEEN 1 AND 99;

DELETE FROM cohorts AS cohort
WHERE batch IS NULL
  AND NOT EXISTS (SELECT 1 FROM students WHERE cohort_id = cohort.id)
  AND NOT EXISTS (SELECT 1 FROM lesson_summaries WHERE cohort_id = cohort.id)
  AND NOT EXISTS (SELECT 1 FROM software_resources WHERE cohort_id = cohort.id);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cohorts WHERE batch IS NULL) THEN
    RAISE EXCEPTION 'Referenced cohorts must be renamed to Binusian XX before migration';
  END IF;
END $$;

ALTER TABLE lesson_summaries DROP CONSTRAINT lesson_summaries_major_check;
DROP INDEX lesson_summaries_cohort_major_idx;
DROP INDEX lesson_summaries_cohort_major_title_idx;
ALTER TABLE lesson_summaries ALTER COLUMN major TYPE text[] USING ARRAY[major];
ALTER TABLE lesson_summaries RENAME COLUMN major TO majors;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM lesson_summaries first
    JOIN cohorts first_cohort ON first_cohort.id = first.cohort_id
    JOIN lesson_summaries second ON second.id > first.id AND second.title = first.title
    JOIN cohorts second_cohort ON second_cohort.id = second.cohort_id AND second_cohort.batch = first_cohort.batch
    WHERE (first.description, first.image_url, first.resource_url)
      IS DISTINCT FROM (second.description, second.image_url, second.resource_url)
  ) THEN
    RAISE EXCEPTION 'Same-title courses in a cohort batch have conflicting content';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM software_resources first
    JOIN cohorts first_cohort ON first_cohort.id = first.cohort_id
    JOIN software_resources second ON second.id > first.id AND second.title = first.title
    JOIN cohorts second_cohort ON second_cohort.id = second.cohort_id AND second_cohort.batch = first_cohort.batch
    WHERE (first.description, first.image_url, first.resource_url)
      IS DISTINCT FROM (second.description, second.image_url, second.resource_url)
  ) THEN
    RAISE EXCEPTION 'Same-title software in a cohort batch has conflicting content';
  END IF;
END $$;

WITH survivor AS (
  SELECT DISTINCT ON (cohort.batch, lesson.title)
    lesson.id,
    cohort.batch,
    lesson.title
  FROM lesson_summaries lesson
  JOIN cohorts cohort ON cohort.id = lesson.cohort_id
  ORDER BY cohort.batch, lesson.title, lesson.id
)
UPDATE lesson_summaries lesson
SET majors = merged.majors
FROM (
  SELECT survivor.id, array_agg(DISTINCT major ORDER BY major) AS majors
  FROM survivor
  JOIN cohorts cohort ON cohort.batch = survivor.batch
  JOIN lesson_summaries source ON source.cohort_id = cohort.id AND source.title = survivor.title
  CROSS JOIN LATERAL unnest(source.majors) AS major
  GROUP BY survivor.id
) merged
WHERE lesson.id = merged.id;

WITH ranked AS (
  SELECT lesson.id, row_number() OVER (PARTITION BY cohort.batch, lesson.title ORDER BY lesson.id) AS position
  FROM lesson_summaries lesson
  JOIN cohorts cohort ON cohort.id = lesson.cohort_id
)
DELETE FROM lesson_summaries
WHERE id IN (SELECT id FROM ranked WHERE position > 1);

WITH ranked AS (
  SELECT software.id, row_number() OVER (PARTITION BY cohort.batch, software.title ORDER BY software.id) AS position
  FROM software_resources software
  JOIN cohorts cohort ON cohort.id = software.cohort_id
)
DELETE FROM software_resources
WHERE id IN (SELECT id FROM ranked WHERE position > 1);

WITH canonical AS (SELECT batch, min(id) AS id FROM cohorts GROUP BY batch)
UPDATE students student SET cohort_id = canonical.id
FROM cohorts cohort JOIN canonical USING (batch)
WHERE student.cohort_id = cohort.id AND student.cohort_id <> canonical.id;

WITH canonical AS (SELECT batch, min(id) AS id FROM cohorts GROUP BY batch)
UPDATE lesson_summaries lesson SET cohort_id = canonical.id
FROM cohorts cohort JOIN canonical USING (batch)
WHERE lesson.cohort_id = cohort.id AND lesson.cohort_id <> canonical.id;

WITH canonical AS (SELECT batch, min(id) AS id FROM cohorts GROUP BY batch)
UPDATE software_resources software SET cohort_id = canonical.id
FROM cohorts cohort JOIN canonical USING (batch)
WHERE software.cohort_id = cohort.id AND software.cohort_id <> canonical.id;

DELETE FROM cohorts cohort
USING cohorts canonical
WHERE canonical.batch = cohort.batch AND canonical.id < cohort.id;

ALTER TABLE cohorts DROP COLUMN name;
ALTER TABLE cohorts ALTER COLUMN batch SET NOT NULL;
ALTER TABLE cohorts ADD CONSTRAINT cohorts_batch_check CHECK (batch BETWEEN 1 AND 99);
ALTER TABLE cohorts ADD CONSTRAINT cohorts_batch_key UNIQUE (batch);

ALTER TABLE lesson_summaries ADD CONSTRAINT lesson_summaries_majors_check CHECK (
  cardinality(majors) > 0 AND majors <@ ARRAY[
    'Computer Science',
    'Mobile Application and Technology',
    'Game Application and Technology',
    'Data Science',
    'Cyber Security',
    'Computer Science & Mathematics',
    'Computer Science & Statistics',
    'Computer Science - Software Engineering',
    'Artificial Intelligence',
    'Digital Psychology'
  ]::text[]
);
CREATE UNIQUE INDEX lesson_summaries_cohort_title_idx ON lesson_summaries(cohort_id, title);
