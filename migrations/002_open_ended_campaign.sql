-- Explicit owner migration, including existing installations of 001.
-- NULL means no campaign end has been decided; Mirvish offer dates are separate.
ALTER TABLE scratch_campaign ALTER COLUMN ends_at DROP NOT NULL;
