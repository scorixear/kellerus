/* eslint-disable max-len */
import mariadb from 'mariadb';
import config from './../config.js';
// eslint-disable-next-line no-unused-vars
import Discord from 'discord.js';

const pool = mariadb.createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  port: config.dbport,
  database: config.dbDataBase,
  multipleStatements: true,
  connectionLimit: 5,
});

/**
 * Initialized the Database
 */
async function initDB() {
  let conn;
  try {
    console.log('Start DB Connection');
    conn = await pool.getConnection();
    console.log('DB Connection established');
    await conn.query('CREATE TABLE IF NOT EXISTS `honor` (`user_id` VARCHAR(255), `val` INT, PRIMARY KEY (`user_id`))');
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
}

/**
 * Returns the Honor Count for a given user
 * @param {Discord.User} user
 * @return {number}
 */
async function getHonorCount(user) {
  let conn;
  let honorCount;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT \`val\` FROM honor WHERE \`user_id\` = ${conn.escape(user.id)}`);
    honorCount = rows[0].val;
  } catch (err) {
    honorCount = 0;
  } finally {
    if (conn) await conn.end();
  }
  return honorCount;
}

/**
 * Adds one Honor to the users account
 * @param {Discord.User} user
 * @return {number} the updated honor count
 */
async function addHonorCount(user) {
  let conn;
  let honorCount;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(`SELECT val FROM honor WHERE \`user_id\` = ${conn.escape(user.id)}`);
    if (rows && rows[0]) {
      honorCount = rows[0].val + 1;
      rows = await conn.query(`UPDATE honor SET val = ${conn.escape(honorCount)} WHERE \`user_id\` = ${conn.escape(user.id)}`);
    } else {
      honorCount = 1;
      rows = await conn.query(`INSERT INTO honor (user_id, val) VALUES (${conn.escape(user.id)}, 1)`);
    }
  } catch (err) {
    honorCount = 1;
    await conn.query(`INSERT INTO honor (user_id, val) VALUES (${conn.escape(user.id)}, 1)`);
  } finally {
    if (conn) await conn.end();
  }
  return honorCount;
}

/**
 * Adds one Honor to the users account
 * @param {Discord.User} user
 * @return {number} the updated honor count
 */
async function removeHonor(user) {
  let conn;
  let honorCount;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(`SELECT val FROM honor WHERE \`user_id\` = ${conn.escape(user.id)}`);
    if (rows && rows[0]) {
      honorCount = rows[0].val - 1;
      rows = await conn.query(`UPDATE honor SET val = ${conn.escape(honorCount)} WHERE \`user_id\` = ${conn.escape(user.id)}`);
    } else {
      honorCount = -1;
      rows = await conn.query(`INSERT INTO honor (user_id, val) VALUES (${conn.escape(user.id)}, -1)`);
    }
  } catch (err) {
    honorCount = -1;
    await conn.query(`INSERT INTO honor (user_id, val) VALUES (${conn.escape(user.id)}, -1)`);
  } finally {
    if (conn) await conn.end();
  }
  return honorCount;
}

export default {
  initDB,
  getHonorCount,
  addHonorCount,
  removeHonor,
  pool,
};
