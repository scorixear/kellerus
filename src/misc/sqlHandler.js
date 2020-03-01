import mariadb from 'mariadb';
import config from './../config.js';

const pool = mariadb.createPool({
    host: config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    port: config.dbport,
    database: config.dbDataBase,
    multipleStatements: true
});

async function InitDB() {
    let conn;
    try {
        console.log('Start DB Connection');
        conn = await pool.getConnection();
        console.log('DB Connection established');
        const ret = await conn.query('CREATE TABLE IF NOT EXISTS `honor` (`user_id` VARCHAR(255), `val` INT, PRIMARY KEY (`user_id`))').catch(err => {
            console.log(err);
        });
        console.log(ret);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
}

async function getHonorCount(user) {
    let conn;
    let honorCount;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`SELECT \`val\` FROM honor WHERE \`user_id\` = "${user.id}"`);
        console.log(rows);
        honorCount = rows.val;
    } catch (err) {
        throw err;
    } finally {
        if (conn) await conn.end();
    }
    return honorCount;
}

async function addHonorCount(user) {
    let conn;
    let honorCount;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query(`SELECT val FROM honor WHERE \`user_id\` = "${user.id}"`);
        if (rows && rows[0]) {
            honorCount = rows[0].val + 1;
            rows = await conn.query(`UPDATE honor SET val = ${honorCount} WHERE \`user_id\` = "${user.id}"`);
        }
        else {
            honorCount = 1;
            rows = await conn.query(`INSERT INTO honor (user_id, val) VALUES ("${user.id}", 1)`);
        }
    } catch (err) {
        console.log(err);
        honorCount = 1;
        let rows = await conn.query(`INSERT INTO honor (user_id, val) VALUES ("${user.id}", 1)`);
    } finally {
        if (conn) await conn.end();
    }
    return honorCount;
}

export default {InitDB, getHonorCount, addHonorCount};