SELECT
  typname,
  oid,
  typarray
FROM pg_type
ORDER BY
  typname
