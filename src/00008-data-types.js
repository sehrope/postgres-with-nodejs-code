const { main, sleep } = require('./util/main');
const pg = require('pg');

main(async () => {
    // Manually create a client
    const client = new pg.Client(process.env.DATABASE_URL);

    // Connect the client
    await client.connect();

    const snippets = {
        // NULL
        null_int: `NULL::int`,
        null_text: `NULL::text`,
        null_date: `NULL::date`,
        // Boolean
        boolean_true: `true`,
        boolean_false: `false`,
        // Integers
        zero_int2: `0::int2`,
        zero_int4: `0::int4`,
        zero_int8: `0::int8`,
        // Numerics
        zero_numeric: `0::numeric`,
        nonzero_numeric: `12.345::numeric`,
        // Text
        a_char: `'a'::char`,
        abc_text: `'abc'::text`,
        // UUID
        random_uuid: `pgcrypto.gen_random_uuid()`,
        // Date
        now_date: `now()::date`,
        // Timestamp
        now_timestamp: `now()::timestamp`,
        now_timestamptz: `now()::timestamptz`,
        // Ranges
        int4_range: `'[1,5)'::int4range`,
        int8_range: `'[1,5)'::int8range`,
        // Intervals
        interval_day: `'1day'::interval`,
        interval_hour: `'1hour'::interval`,
        // JSON
        json_int: `'123'::json`,
        json_float: `'123.456'::json`,
        json_null: `'null'::json`,
        json_empty_object: `'{}'::json`,
        json_array: `'[1,2,3]'::json`,
        // Geometry
        geo_point: `'(1,1)'::point`,
        // Binary Data
        bytea: `decode('deadbeef', 'hex')`,
        // Arrays
        array_of_int: `'{1,2,3}'::int[]`,
        array_of_bigint: `'{1,2,3}'::bigint[]`,
        array_of_text: `'{foo,bar,baz}'::text[]`,
        array_of_json: `'{"{}",123,"\\"test\\""}'::json[]`,
    };
    const snippetKeys = Object.keys(snippets);

    const sql = 'SELECT\n' +
        snippetKeys.map((key, index) => {
            const snippet = snippets[key];
            const last = index === (snippetKeys.length - 1);
            return `  ${snippet} AS ${key}${last ? '' : ','}`
        }).join('\n');
    console.log('%s', sql);
    const result = await client.query(sql);
    const row = result.rows[0];

    console.log('%s %s %s',
        rpad('SQL', 40),
        lpad('Type', 25),
        lpad('Value', 30),
    );
    console.log('%s %s %s',
        rpad('', 40, '-'),
        lpad('', 25, '-'),
        lpad('', 30, '-'),
    );

    snippetKeys.map((key) => {
        const value = row[key];
        const snippet = snippets[key];
        console.log('%s %s %s',
            rpad(snippet, 40),
            lpad(getType(value), 25),
            lpad(dumpValue(value), 30),
        );
    });
});

function lpad(text, n, c = ' ') {
    let ret = text;
    while (ret.length < n) {
        ret = c + ret;
    }
    return ret;
}

function rpad(text, n, c = ' ') {
    let ret = text;
    while (ret.length < n) {
        ret = ret + c;
    }
    return ret;
}

function getType(value) {
    if (value === null) {
        return 'null';
    } else if (value === undefined) {
        return 'undefined';
    } else if (value instanceof Date) {
        return 'Date';
    } else if (Array.isArray(value)) {
        return 'Array';
    } else if (value instanceof Buffer) {
        return 'Buffer';
    }
    return typeof (value);
}

function dumpValue(value) {
    if (value instanceof Buffer) {
        return `Buffer[${value.toString('hex')}]`;
    }
    return JSON.stringify(value);
}
