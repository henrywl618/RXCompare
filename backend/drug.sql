-- \echo 'Delete and recreate drug db?'
-- \prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE drug;
CREATE DATABASE drug;
\connect drug

\i drug-schema.sql
\i drug-seed.sql