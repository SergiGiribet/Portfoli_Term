-- Extend settings with identity & multilingual contact fields
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS sub_name    TEXT NOT NULL DEFAULT 'SERGI GIRIBET',
  ADD COLUMN IF NOT EXISTS coords      TEXT NOT NULL DEFAULT '41.97°N / 2.78°E',
  ADD COLUMN IF NOT EXISTS year        TEXT NOT NULL DEFAULT '2026',
  ADD COLUMN IF NOT EXISTS contact_cat TEXT NOT NULL DEFAULT 'Tens una idea, un projecte o ganes de construir? Parlem-ne.',
  ADD COLUMN IF NOT EXISTS contact_es  TEXT NOT NULL DEFAULT '¿Tienes una idea, un proyecto o ganas de construir? Hablemos.',
  ADD COLUMN IF NOT EXISTS contact_en  TEXT NOT NULL DEFAULT 'Got an idea, a project or the itch to build? Let''s talk.';

-- Extend messages with reply tracking
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS reply       TEXT,
  ADD COLUMN IF NOT EXISTS replied_at  TIMESTAMPTZ;
