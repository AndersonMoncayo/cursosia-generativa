-- Continuación Módulo 5 Curso 2
WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 5: Agentes de IA autónomos')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Construir un agente con N8N', 2, 28, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Multi-agent workflows', 3, 25, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Herramientas y tool calling', 4, 22, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 6: Integración con apps populares')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'WhatsApp Business API con N8N', 1, 25, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Slack y Discord bots', 2, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Google Sheets y Drive', 3, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Notion y Airtable', 4, 16, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 7: Despliegue y producción')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Hostear N8N en VPS', 1, 25, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Variables de entorno y seguridad', 2, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Monitoreo de workflows', 3, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Escalabilidad y backups', 4, 20, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 8: Proyecto Final — Negocio automatizado')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Diseño del sistema completo', 1, 25, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Construcción paso a paso', 2, 35, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Testing y depuración', 3, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'automatizacion-n8n-ia'), 'Entrega del proyecto', 4, 18, false, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CURSO 3: Prompt Engineering Profesional (slug: prompt-engineering-profesional)
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

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 1: Fundamentos del Prompt Engineering')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Qué es un prompt', 1, 10, true, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Anatomía de un prompt efectivo', 2, 14, true, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Errores más comunes', 3, 12, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Mentalidad del prompt engineer', 4, 10, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 2: Técnicas core de prompting')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Zero-shot y few-shot prompting', 1, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Chain of Thought (CoT)', 2, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Role prompting', 3, 14, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompt chaining', 4, 16, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 3: Técnicas avanzadas 2026')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Tree of Thoughts', 1, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'ReAct prompting', 2, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Self-consistency', 3, 14, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Meta-prompting', 4, 18, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 4: Prompts para casos específicos')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompts para código', 1, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompts para análisis de datos', 2, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompts para contenido y copywriting', 3, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompts para investigación', 4, 14, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 5: Optimización y evaluación')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Cómo medir la calidad de un prompt', 1, 14, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'A/B testing de prompts', 2, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Iterar y mejorar prompts', 3, 12, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Documentar prompts como activo', 4, 10, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 6: Sistema de prompts profesional')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Crear tu librería de prompts', 1, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Prompts para equipos', 2, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Integrar prompts en productos', 3, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'prompt-engineering-profesional'), 'Proyecto final: tu sistema de prompts', 4, 25, false, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CURSO 4: IA para Negocios (slug: ia-para-negocios)
-- ============================================================
WITH c AS (SELECT id FROM courses WHERE slug = 'ia-para-negocios')
INSERT INTO modules (course_id, title, order_index, is_published) VALUES
  ((SELECT id FROM c), 'MÓDULO 1: IA en el contexto empresarial 2026', 1, true),
  ((SELECT id FROM c), 'MÓDULO 2: IA en Marketing y Ventas', 2, true),
  ((SELECT id FROM c), 'MÓDULO 3: IA en Operaciones', 3, true),
  ((SELECT id FROM c), 'MÓDULO 4: IA en Finanzas y Datos', 4, true),
  ((SELECT id FROM c), 'MÓDULO 5: Estrategia de adopción de IA', 5, true),
  ((SELECT id FROM c), 'MÓDULO 6: Herramientas de IA para empresas 2026', 6, true),
  ((SELECT id FROM c), 'MÓDULO 7: Proyecto Final — Plan de IA para tu empresa', 7, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 1: IA en el contexto empresarial 2026')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-para-negocios'), 'Estado actual de la IA en empresas', 1, 14, true, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-para-negocios'), 'ROI real de implementar IA', 2, 16, true, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-para-negocios'), 'Casos de éxito por sector', 3, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-para-negocios'), 'Errores que cometen las empresas con IA', 4, 14, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 2: IA en Marketing y Ventas')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-para-negocios'), 'Generación de contenido con IA', 1, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-para-negocios'), 'Personalización a escala', 2, 16, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-para-negocios'), 'Copywriting y anuncios con IA', 3, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-para-negocios'), 'Análisis de clientes con IA', 4, 18, false, true)
ON CONFLICT DO NOTHING;

WITH m AS (SELECT id FROM modules WHERE title = 'MÓDULO 3: IA en Operaciones')
INSERT INTO lessons (module_id, course_id, title, order_index, duration_min, is_free, is_published) VALUES
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-para-negocios'), 'Automatización de procesos internos', 1, 20, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-para-negocios'), 'Atención al cliente con IA', 2, 18, false, true),
  ((SELECT id FROM m), (SELECT id FROM courses WHERE slug = 'ia-para-negocios'), 'Gestión documental inteligente', 3, 16, false, true),
