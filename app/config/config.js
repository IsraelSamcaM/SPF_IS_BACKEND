const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'containers-us-west-109.railway.app',
    password: '3NrdUh8AYorUGcWEZRea',
    database: 'railway',
    port: '6479'
});


module.exports = pool;
