-- ============================================================
-- CURSO 3: Prompt Engineering Profesional
-- ============================================================
WITH c AS (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional')
INSERT INTO modules (course_id, title, order_index, is_published) VALUES
  ((SELECT id FROM c), 'MÓDULO 1: Fundamentos del Prompt Engineering', 1, true),
  ((SELECT id FROM c), 'MÓDULO 2: Técnicas core de prompting', 2, true),
  ((SELECT id FROM c), 'MÓDULO 3: Técnicas avanzadas 2026', 3, true),
  ((SELECT id FROM c), 'MÓDULO 4: Prompts para casos específicos', 4, true),
  ((SELECT id FROM c), 'MÓDULO 5: Optimización y evaluación', 5, true),
  ((SELECT id FROM c), 'MÓDULO 6: Sistema de prompts profesional', 6, true)
ON CONFLICT DO NOTHING;

-- MÓDULO 1
WITH m AS (
  SELECT mo.id FROM modules mo
  JOIN courses c ON c.id = mo.course_id
  WHERE c.slug = 'prompt-engineering-profesional'
  AND mo.title = 'MÓDULO 1: Fundamentos del Prompt Engineering'
)
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Qué es un prompt y para qué sirve', 1, 10, true, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Anatomía de un prompt efectivo', 2, 14, true, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Los errores más comunes al escribir prompts', 3, 12, true, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Mentalidad del prompt engineer profesional', 4, 10, false, true)
ON CONFLICT DO NOTHING;

-- MÓDULO 2
WITH m AS (
  SELECT mo.id FROM modules mo
  JOIN courses c ON c.id = mo.course_id
  WHERE c.slug = 'prompt-engineering-profesional'
  AND mo.title = 'MÓDULO 2: Técnicas core de prompting'
)
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Zero-shot prompting: pedir sin ejemplos', 1, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Few-shot prompting: guiar con ejemplos', 2, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Chain of Thought: razonamiento paso a paso', 3, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Role prompting: asignar un rol a la IA', 4, 14, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompt chaining: encadenar instrucciones', 5, 16, false, true)
ON CONFLICT DO NOTHING;

-- MÓDULO 3
WITH m AS (
  SELECT mo.id FROM modules mo
  JOIN courses c ON c.id = mo.course_id
  WHERE c.slug = 'prompt-engineering-profesional'
  AND mo.title = 'MÓDULO 3: Técnicas avanzadas 2026'
)
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Tree of Thoughts: explorar múltiples caminos', 1, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'ReAct prompting: razonar y actuar', 2, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Self-consistency: validar respuestas', 3, 14, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Meta-prompting: prompts que crean prompts', 4, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Structured outputs: JSON y formatos fijos', 5, 16, false, true)
ON CONFLICT DO NOTHING;

-- MÓDULO 4
WITH m AS (
  SELECT mo.id FROM modules mo
  JOIN courses c ON c.id = mo.course_id
  WHERE c.slug = 'prompt-engineering-profesional'
  AND mo.title = 'MÓDULO 4: Prompts para casos específicos'
)
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompts para generar y revisar código', 1, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompts para análisis de datos y tablas', 2, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompts para copywriting y anuncios', 3, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompts para investigación y resúmenes', 4, 14, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompts para imágenes con Midjourney y DALL·E', 5, 16, false, true)
ON CONFLICT DO NOTHING;

-- MÓDULO 5
WITH m AS (
  SELECT mo.id FROM modules mo
  JOIN courses c ON c.id = mo.course_id
  WHERE c.slug = 'prompt-engineering-profesional'
  AND mo.title = 'MÓDULO 5: Optimización y evaluación'
)
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Cómo medir si un prompt es bueno', 1, 14, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'A/B testing de prompts en producción', 2, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Iterar y mejorar prompts sistemáticamente', 3, 12, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Documentar prompts como activo del negocio', 4, 10, false, true)
ON CONFLICT DO NOTHING;

-- MÓDULO 6
WITH m AS (
  SELECT mo.id FROM modules mo
  JOIN courses c ON c.id = mo.course_id
  WHERE c.slug = 'prompt-engineering-profesional'
  AND mo.title = 'MÓDULO 6: Sistema de prompts profesional'
)
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Crear tu librería personal de prompts', 1, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompts colaborativos para equipos', 2, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Integrar prompts dentro de productos digitales', 3, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Proyecto final: construye tu sistema de prompts', 4, 30, false, true)
ON CONFLICT DO NOTHING;

-- VERIFICACION FINAL
SELECT
  c.title AS curso,
  m.title AS modulo,
  COUNT(l.id) AS total_lecciones,
  SUM(l.duration_min) AS duracion_total_min
FROM courses c
JOIN modules m ON m.course_id = c.id
LEFT JOIN lessons l ON l.module_id = m.id
WHERE c.slug = 'prompt-engineering-profesional'
AND m.deleted_at IS NULL
GROUP BY c.title, m.title, m.order_index
ORDER BY m.order_index;
