-- Add editable availability status to settings
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS status_text TEXT NOT NULL DEFAULT 'EN PAUSA';
