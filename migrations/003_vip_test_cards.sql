-- Apply as migration owner before deploying VIP-capable web/worker. Preserve all prior awards.
BEGIN;
ALTER TABLE scratch_card ADD COLUMN is_test boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX scratch_one_public_winner ON scratch_card(player) WHERE prize IS NOT NULL AND NOT is_test;
DROP INDEX scratch_one_winner;
COMMIT;
-- Existing table-level runtime grants cover the new column. Roll back code only, not this migration:
-- multiple test wins cannot satisfy the old global one-winner index.
