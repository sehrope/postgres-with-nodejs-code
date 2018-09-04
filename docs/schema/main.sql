BEGIN;

CREATE TABLE person (
    id              uuid        NOT NULL DEFAULT pgcrypto.gen_random_uuid(),
    name            text        NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT person_pk_id
      PRIMARY KEY (id)
);

CREATE TABLE job (
    id              uuid        NOT NULL DEFAULT pgcrypto.gen_random_uuid(),
    name            text        NOT NULL,
    is_officer      boolean     NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT job_pk_id
      PRIMARY KEY (id)
);

CREATE TABLE person_job (
    id              uuid        NOT NULL DEFAULT pgcrypto.gen_random_uuid(),
    person_id       uuid        NOT NULL REFERENCES person(id),
    job_id          uuid        NOT NULL REFERENCES job (id),    
    created_at      timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT person_job_pk_id
      PRIMARY KEY (id)
);
CREATE INDEX person_job_ix_person_id
  ON person_job (person_id);
CREATE INDEX person_job_ix_job_id
  ON person_job (job_id);

-- Helper function for generating data:
CREATE FUNCTION pg_temp.add_person_job (
    p_person_name IN text,
    p_job_name IN text
) RETURNS void
AS
$BODY$
  INSERT INTO person_job
    (person_id, job_id)
  SELECT
    p.id AS person_id,
    j.id AS job_id
  FROM
     person p,
     job j
  WHERE p.name = p_person_name
    AND j.name = p_job_name     
$BODY$
LANGUAGE SQL;

INSERT INTO person (name) VALUES ('Alice');
INSERT INTO person (name) VALUES ('Bob');
INSERT INTO person (name) VALUES ('Carl');
INSERT INTO person (name) VALUES ('Dave');
INSERT INTO person (name) VALUES ('Edgar');

INSERT INTO job (name, is_officer) VALUES ('CEO', true);
INSERT INTO job (name, is_officer) VALUES ('Vice President', true);
INSERT INTO job (name, is_officer) VALUES ('Engineer', false);
INSERT INTO job (name, is_officer) VALUES ('Sales', false);

DO $$
  BEGIN
    PERFORM pg_temp.add_person_job('Alice', 'CEO');
    PERFORM pg_temp.add_person_job('Alice', 'Engineer');
    PERFORM pg_temp.add_person_job('Bob', 'Vice President');
    PERFORM pg_temp.add_person_job('Bob', 'Engineer');
    PERFORM  pg_temp.add_person_job('Carl', 'Engineer');
    PERFORM  pg_temp.add_person_job('Dave', 'Engineer');
    PERFORM  pg_temp.add_person_job('Edgar', 'Engineer');
    PERFORM  pg_temp.add_person_job('Edgar', 'Sales');
  END;
  $$ LANGUAGE plpgsql;

COMMIT;
