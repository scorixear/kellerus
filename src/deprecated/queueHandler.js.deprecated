import sqlHandler from './sqlHandler';


async function initQueues(serverid, conn) {
  try {
    await conn.query(`CREATE TABLE IF NOT EXISTS \`QueueList_${serverid}\` (\`ID\` INT UNSIGNED AUTO_INCREMENT, \`queue_name\` VARCHAR(255) NOT NULL, PRIMARY KEY (\`ID\`), CONSTRAINT queuelist_name_unique UNIQUE (queue_name))`);
  } catch (err) {
    throw err;
  }
}

/**
 * Returns all queues
 * @param {number} serverid
 * @return {string[]}
 */
async function getQueues(serverid) {
  let conn;
  const queues = [];
  try {
    conn = await sqlHandler.pool.getConnection();
    const rows = await conn.query(`SELECT \`queue_name\` FROM \`QueueList_${serverid}\``);
    if (rows) {
      for (const row of rows) {
        queues.push(row.queue_name);
      }
    } else {
      try {
        await initQueues(serverid, conn);
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) conn.end();
  }
  return queues;
}

async function addOrGetQueue(serverid, name) {
  let conn;
  let queue = undefined;
  try {
    conn = await sqlHandler.pool.getConnection();
    await initQueues(serverid, conn);
    let rows = await conn.query(`SELECT ID, queue_name FROM \`QueueList_${serverid}\` WHERE queue_name = "${name}"`);
    if (!rows) {
      rows = [];
    }
    queue = [];
    if (rows.length === 0) {
      await conn.query(`INSERT INTO \`QueueList_${serverid}\` (queue_name) VALUES (${conn.escape(name)})`);
      const tmp = await conn.query(`SELECT ID, queue_name FROM \`QueueList_${serverid}\` WHERE queue_name = "${name}"`);
      const id = tmp[0].ID;
      await conn.query(`CREATE TABLE IF NOT EXISTS \`Queue_${serverid}_${id}\` (\`ID\` INT UNSIGNED AUTO_INCREMENT, \`url\` VARCHAR(255), \`title\` VARCHAR(255), PRIMARY KEY (\`ID\`))`);
    } else {
      const temp = await conn.query(`SELECT title, url FROM \`Queue_${serverid}_${rows[0].ID}\``);
      for (const temprow of temp) {
        queue.push({
          title: temprow.title,
          url: temprow.url,
        });
      }
    }
  } catch (err) {
    console.error(err);
    queue = undefined;
  } finally {
    if (conn) conn.end();
  }
  return queue;
}

/**
 * Queues on title
 * @param {string} name
 * @param {string} title
 * @param {string} url
 * @param {number} serverid
 * @return {boolean} if it was successfull
 */
async function addTitle(name, title, url, serverid) {
  let conn;
  let success;
  await addOrGetQueue(serverid, name);
  try {
    conn = await sqlHandler.pool.getConnection();
    const tmp = await conn.query(`SELECT ID, queue_name FROM \`QueueList_${serverid}\` WHERE queue_name  = "${name}"`);
    const id = tmp[0].ID;

    const titleRow = await conn.query(`SELECT ID FROM \`Queue_${serverid}_${id}\` WHERE url = "${url}"`);
    if (titleRow && titleRow[0] && titleRow[0].ID) {
      success = false;
    } else {
      await conn.query(`INSERT INTO \`Queue_${serverid}_${id}\` (title, url) VALUES (${conn.escape(title)},${conn.escape(url)})`);
      success = true;
    }
  } catch (err) {
    success = false;
    console.error(err);
  } finally {
    if (conn) await conn.end();
  }
  return success;
}

/**
 * Cleares one queue
 * @param {number} serverid
 * @param {string} name
 * @return {boolean} if successfull
 */
async function clearQueue(serverid, name) {
  let conn;
  let success;
  await addOrGetQueue(serverid, name);
  try {
    conn = await sqlHandler.pool.getConnection();
    const tmp = await conn.query(`SELECT ID, queue_name FROM \`QueueList_${serverid}\` WHERE queue_name  = "${name}"`);
    const id = tmp[0].ID;
    await conn.query(`DELETE FROM \`Queue_${serverid}_${id}\``);
    success = true;
  } catch (err) {
    success = false;
    console.error(err);
  } finally {
    if (conn) await conn.end();
  }
  return success;
}

export default {
  getQueues,
  addOrGetQueue,
  addTitle,
  clearQueue,
};
