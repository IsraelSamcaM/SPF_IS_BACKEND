const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '13033162',
    database: 'db_spotify_is',
    port: '5432'
});

module.exports = pool;