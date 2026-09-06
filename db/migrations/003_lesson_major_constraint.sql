ALTER TABLE lesson_summaries
ADD CONSTRAINT lesson_summaries_major_check CHECK (major IN (
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
));
