-- =====================================================================
-- Linksy — add Machine Learning service type
-- Run this ONCE in the Supabase SQL Editor as a single statement.
-- ALTER TYPE ... ADD VALUE cannot be wrapped in a transaction with
-- usage, so this is a standalone migration.
-- =====================================================================

alter type service_type add value if not exists 'ml_model';
