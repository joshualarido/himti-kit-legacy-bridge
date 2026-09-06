INSERT INTO cohorts (name) VALUES ('Binusian 25') ON CONFLICT (name) DO NOTHING;

INSERT INTO students (nim, name, cohort_id)
SELECT '2500000000', 'HIMTI Student', id FROM cohorts WHERE name = 'Binusian 25'
ON CONFLICT (nim) DO UPDATE SET name = EXCLUDED.name, cohort_id = EXCLUDED.cohort_id;

INSERT INTO lesson_summaries (cohort_id, major, title, description, image_url, resource_url)
SELECT id, 'Computer Science', 'Algorithm and Programming', 'Core programming concepts, flow control, arrays, and problem solving.', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80', 'https://en.wikipedia.org/wiki/Computer_programming' FROM cohorts WHERE name = 'Binusian 25'
ON CONFLICT (cohort_id, major, title) DO NOTHING;

INSERT INTO lesson_summaries (cohort_id, major, title, description, image_url, resource_url)
SELECT id, 'Computer Science', 'Discrete Mathematics', 'Logic, sets, relations, combinatorics, graphs, and proof techniques.', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80', 'https://en.wikipedia.org/wiki/Discrete_mathematics' FROM cohorts WHERE name = 'Binusian 25'
ON CONFLICT (cohort_id, major, title) DO NOTHING;

INSERT INTO software_resources (cohort_id, title, description, image_url, resource_url)
SELECT id, 'Git', 'Version control software for tracking changes and collaborating on source code.', 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png', 'https://git-scm.com/downloads' FROM cohorts WHERE name = 'Binusian 25'
ON CONFLICT (cohort_id, title) DO NOTHING;

INSERT INTO software_resources (cohort_id, title, description, image_url, resource_url)
SELECT id, 'Visual Studio Code', 'A flexible source-code editor with extensions for common languages and tools.', 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg', 'https://code.visualstudio.com/download' FROM cohorts WHERE name = 'Binusian 25'
ON CONFLICT (cohort_id, title) DO NOTHING;
