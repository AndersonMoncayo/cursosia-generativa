-- ============================================================
-- CURSO 1: IA Generativa desde Cero (slug: ia-generativa-desde-cero)
-- ============================================================
WITH c AS (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero')
INSERT INTO modules (course_id, title, order_index, is_published) VALUES
  ((SELECT id FROM c), 'MÓDULO 1: Fundamentos de la IA Generativa 2026', 1, true),
  ((SELECT id FROM c), 'MÓDULO 2: ChatGPT al máximo nivel', 2, true),
  ((SELECT id FROM c), 'MÓDULO 3: Claude 3.7 Sonnet en profundidad', 3, true),
  ((SELECT id FROM c), 'MÓDULO 4: Gemini 2.0 y el ecosistema Google', 4, true),
  ((SELECT id FROM c), 'MÓDULO 5: Flujos de trabajo con IA', 5, true),
  ((SELECT id FROM c), 'MÓDULO 6: Proyecto Final — Tu asistente personal con IA', 6, true)
ON CONFLICT DO NOTHING;

-- Lecciones Curso 1 — Módulo 1
WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 1: Fundamentos de la IA Generativa 2026')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Qué es la IA generativa hoy', 1, 12, true, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Modelos actuales: GPT-4o, Claude 3.7, Gemini 2.0', 2, 18, true, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Diferencias entre modelos y cuándo usar cada uno', 3, 15, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Cómo funcionan los tokens', 4, 10, false, true)
ON CONFLICT DO NOTHING;

-- Lecciones Curso 1 — Módulo 2
WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 2: ChatGPT al máximo nivel')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Interface avanzada de ChatGPT', 1, 14, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'GPTs personalizados', 2, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Memory y Projects en ChatGPT', 3, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'ChatGPT con búsqueda web en tiempo real', 4, 12, false, true)
ON CONFLICT DO NOTHING;

-- Lecciones Curso 1 — Módulo 3
WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 3: Claude 3.7 Sonnet en profundidad')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Cuándo usar Claude vs ChatGPT', 1, 14, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Extended Thinking de Claude', 2, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Análisis de documentos largos', 3, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Claude para código y razonamiento', 4, 20, false, true)
ON CONFLICT DO NOTHING;

-- Lecciones Curso 1 — Módulo 4
WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 4: Gemini 2.0 y el ecosistema Google')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Gemini en Google Workspace', 1, 14, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Gemini Advanced', 2, 12, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Multimodalidad: texto, imagen y audio', 3, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Deep Research con Gemini', 4, 20, false, true)
ON CONFLICT DO NOTHING;

-- Lecciones Curso 1 — Módulo 5
WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 5: Flujos de trabajo con IA')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Construir un flujo de trabajo real', 1, 22, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Combinar varios modelos de IA', 2, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Automatizar tareas repetitivas con IA', 3, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Casos de uso por industria', 4, 16, false, true)
ON CONFLICT DO NOTHING;

-- Lecciones Curso 1 — Módulo 6
WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 6: Proyecto Final — Tu asistente personal con IA')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Diseño del asistente', 1, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Configuración y prompts base', 2, 25, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Pruebas y ajustes', 3, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-generativa-desde-cero'), 'Entrega y presentación', 4, 15, false, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CURSO 2: Automatización con N8N e IA (slug: automatizacion-n8n-ia)
-- ============================================================
WITH c AS (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia')
INSERT INTO modules (course_id, title, order_index, is_published) VALUES
  ((SELECT id FROM c), 'MÓDULO 1: Introducción a N8N 2026', 1, true),
  ((SELECT id FROM c), 'MÓDULO 2: Nodos esenciales de N8N', 2, true),
  ((SELECT id FROM c), 'MÓDULO 3: Conectar IA a N8N', 3, true),
  ((SELECT id FROM c), 'MÓDULO 4: Automatizaciones de negocio reales', 4, true),
  ((SELECT id FROM c), 'MÓDULO 5: Agentes de IA autónomos', 5, true),
  ((SELECT id FROM c), 'MÓDULO 6: Integración con apps populares', 6, true),
  ((SELECT id FROM c), 'MÓDULO 7: Despliegue y producción', 7, true),
  ((SELECT id FROM c), 'MÓDULO 8: Proyecto Final — Negocio automatizado', 8, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 1: Introducción a N8N 2026')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Qué es N8N y por qué usarlo hoy', 1, 12, true, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Instalación local y en la nube', 2, 20, true, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Interface y conceptos clave', 3, 15, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Primer workflow en 15 minutos', 4, 18, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 2: Nodos esenciales de N8N')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'HTTP Request y Webhooks', 1, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Schedule Trigger', 2, 12, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Code Node con JavaScript', 3, 22, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Error handling en workflows', 4, 16, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 3: Conectar IA a N8N')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Nodo OpenAI y Anthropic en N8N', 1, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Nodo Google Gemini', 2, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Agentes de IA en N8N', 3, 25, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Memoria conversacional en flujos', 4, 18, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 4: Automatizaciones de negocio reales')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'CRM automático con IA', 1, 25, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Respuestas automáticas en email', 2, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Pipeline de ventas automatizado', 3, 22, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Reportes automáticos con IA', 4, 18, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 5: Agentes de IA autónomos')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Qué es un agente de IA', 1, 15, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Construir un agente con N8N', 2, 28, false, true)
ON CONFLICT DO NOTHING;
