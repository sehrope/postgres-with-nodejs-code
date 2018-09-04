\pset pager off

SELECT
  a.pid,
  CASE
    WHEN a.pid = pg_backend_pid() THEN '*'
    ELSE ''
  END AS me,
  a.usename,
  a.backend_start,
  a.state
FROM pg_stat_activity a
WHERE a.usename = 'app'
ORDER BY backend_start
;
