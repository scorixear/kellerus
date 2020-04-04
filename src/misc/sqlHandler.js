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

/**
 * Creates a Queue table
 * @param {number} serverid
 * @param {mariadb.PoolConnection} conn
 */
async function createQueue(serverid, conn) {
  try {
    await conn.query(`CREATE TABLE \`ServerQueue_${serverid}\` (\`ID\` INT UNSIGNED AUTO_INCREMENT, \`url\` VARCHAR(255), \`title\` VARCHAR(255), PRIMARY KEY (\`ID\`))`);
  } catch (err) {
    throw err;
  } finally {
    if (conn) await conn.end();
  }
}

/**
 * Retrieves the Queue
 * @param {number} serverid
 * @return {Array<{title: string, url: string}>}
 */
async function getQueue(serverid) {
  let conn;
  const queue = [];
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT title, url FROM ServerQueue_${serverid}`);
    if (rows) {
      for (const row of rows) {
        queue.push({
          title: row.title,
          url: row.url,
        });
      }
    } else {
      try {
        await createQueue(serverid, conn);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    try {
      await createQueue(serverid, conn);
    } catch (err) {
      console.log(err);
    }
  } finally {
    if (conn) await conn.end();
  }
  return queue;
}

/**
 * Queues on title
 * @param {string} title
 * @param {string} url
 * @param {number} serverid
 * @return {boolean} if it was successfull
 */
async function addQueue(title, url, serverid) {
  let conn;
  let success;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT title FROM ServerQueue_${serverid} WHERE url=${conn.escape(url)}`);
    if (rows && rows.length > 0) {
      success = false;
    } else {
      await conn.query(`INSERT INTO ServerQueue_${serverid} (title, url) VALUES (${conn.escape(title)},${conn.escape(url)})`);
      success = true;
    }
  } catch (err) {
    try {
      await createQueue(serverid, conn);
      await conn.query(`INSERT INTO ServerQueue_${serverid} (title, url) VALUES (${conn.escape(title)},${conn.escape(url)})`);
      success = true;
    } catch (err) {
      success = false;
    }
  } finally {
    if (conn) await conn.end();
  }
  return success;
}

/**
 * Cleares one queue
 * @param {number} serverid
 * @return {boolean} if successfull
 */
async function clearQueue(serverid) {
  let conn;
  let success;
  try {
    conn = await pool.getConnection();
    await conn.query(`DELETE FROM ServerQueue_${serverid}`);
    success = true;
  } catch (err) {
    try {
      await createQueue(serverid, conn);
      success = true;
    } catch (err) {
      success = false;
    }
  } finally {
    if (conn) await conn.end();
  }
  return success;
}

export default {
  initDB,
  getHonorCount,
  addHonorCount,
  removeHonor,
  getQueue,
  addQueue,
  clearQueue,
};
