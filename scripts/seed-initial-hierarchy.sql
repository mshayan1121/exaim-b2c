-- Seed Initial Data for Phase 3 — Admin Content Hierarchy
-- Run this in Supabase SQL Editor to create Qualifications, Exam Boards, and Subjects.
-- Then use the AI Course Setup page (/admin/content/setup) to generate topics and subtopics for each.

-- 1. Qualifications
INSERT INTO qualifications (name, display_order)
VALUES ('GCSE', 1), ('IGCSE', 2)
ON CONFLICT (name) DO NOTHING;

-- 2. Exam Boards
-- AQA under GCSE
INSERT INTO exam_boards (qualification_id, name, display_order)
SELECT q.id, 'AQA', 1 FROM qualifications q WHERE q.name = 'GCSE' AND NOT EXISTS (
  SELECT 1 FROM exam_boards eb WHERE eb.qualification_id = q.id AND eb.name = 'AQA'
);

-- Cambridge under IGCSE
INSERT INTO exam_boards (qualification_id, name, display_order)
SELECT q.id, 'Cambridge', 1 FROM qualifications q WHERE q.name = 'IGCSE' AND NOT EXISTS (
  SELECT 1 FROM exam_boards eb WHERE eb.qualification_id = q.id AND eb.name = 'Cambridge'
);

-- 3. Subjects
-- GCSE AQA: Chemistry, Biology, Physics, Maths
INSERT INTO subjects (exam_board_id, name, display_order)
SELECT eb.id, s.n, s.o
FROM exam_boards eb
CROSS JOIN (VALUES ('Chemistry', 1), ('Biology', 2), ('Physics', 3), ('Maths', 4)) AS s(n, o)
WHERE eb.name = 'AQA'
  AND eb.qualification_id = (SELECT id FROM qualifications WHERE name = 'GCSE' LIMIT 1)
  AND NOT EXISTS (
    SELECT 1 FROM subjects sb WHERE sb.exam_board_id = eb.id AND sb.name = s.n
  );

-- IGCSE Cambridge: Chemistry, Maths
INSERT INTO subjects (exam_board_id, name, display_order)
SELECT eb.id, s.n, s.o
FROM exam_boards eb
CROSS JOIN (VALUES ('Chemistry', 1), ('Maths', 2)) AS s(n, o)
WHERE eb.name = 'Cambridge'
  AND eb.qualification_id = (SELECT id FROM qualifications WHERE name = 'IGCSE' LIMIT 1)
  AND NOT EXISTS (
    SELECT 1 FROM subjects sb WHERE sb.exam_board_id = eb.id AND sb.name = s.n
  );

-- After running this, go to /admin/content/setup and generate hierarchies for:
-- - GCSE AQA Chemistry (Triple)
-- - GCSE AQA Chemistry (Combined)
-- - GCSE AQA Biology (Triple)
-- - GCSE AQA Biology (Combined)
-- - GCSE AQA Physics (Triple)
-- - GCSE AQA Physics (Combined)
-- - GCSE AQA Maths
-- - IGCSE Cambridge Chemistry
-- - IGCSE Cambridge Maths
