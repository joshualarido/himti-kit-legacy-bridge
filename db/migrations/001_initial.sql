CREATE TABLE IF NOT EXISTS cohorts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nim varchar(10) NOT NULL UNIQUE CHECK (nim ~ '^[0-9]{10}$'),
  name text NOT NULL,
  cohort_id bigint NOT NULL REFERENCES cohorts(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS lesson_summaries (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cohort_id bigint NOT NULL REFERENCES cohorts(id) ON DELETE RESTRICT,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  resource_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lesson_summaries_cohort_id_idx ON lesson_summaries(cohort_id);

CREATE TABLE IF NOT EXISTS software_resources (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cohort_id bigint NOT NULL REFERENCES cohorts(id) ON DELETE RESTRICT,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  resource_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS software_resources_cohort_id_idx ON software_resources(cohort_id);
