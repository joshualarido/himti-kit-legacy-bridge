INSERT INTO cohorts (name)
SELECT DISTINCT 'Binusian ' || left(nim, 2) FROM students
ON CONFLICT (name) DO NOTHING;

UPDATE students AS student
SET cohort_id = cohort.id
FROM cohorts AS cohort
WHERE cohort.name = 'Binusian ' || left(student.nim, 2)
  AND student.cohort_id <> cohort.id;
