import { User } from 'discord.js';
import { Logger } from 'discord.ts-architecture';
import mariadb from 'mariadb';

export class SqlHandler {
  private pool: mariadb.Pool;
  constructor() {
    this.pool = mariadb.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      database: process.env.DB_DATABASE,
      multipleStatements: true,
      connectionLimit: 5
    });
  }

  /**
   * Initialized the Database
   */
  public async initDB() {
    let conn;
    try {
      conn = await this.pool.getConnection();
      await conn.query(
        'CREATE TABLE IF NOT EXISTS `honor` (`user_id` VARCHAR(255), `val` INT, PRIMARY KEY (`user_id`))'
      );
      await conn.query(
        'CREATE TABLE IF NOT EXISTS `channels` (`id` VARCHAR(255), `replacement` VARCHAR(255), PRIMARY KEY (`id`))'
      );
    } finally {
      if (conn) await conn.end();
    }
    Logger.info('Initialized Database');
  }
  /**
   * Returns the Honor Count for a given user
   * @param {Discord.User} user
   * @return {number}
   */
  public async getHonorCount(user: User) {
    let conn;
    let honorCount;
    try {
      conn = await this.pool.getConnection();
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
  public async addHonorCount(user: User) {
    let conn;
    let honorCount: number;
    try {
      conn = await this.pool.getConnection();
      let rows = await conn.query(`SELECT val FROM honor WHERE \`user_id\` = ${conn.escape(user.id)}`);
      if (rows && rows[0]) {
        honorCount = parseInt(rows[0].val, 10) + 1;
        rows = await conn.query(
          `UPDATE honor SET val = ${conn.escape(honorCount)} WHERE \`user_id\` = ${conn.escape(user.id)}`
        );
      } else {
        honorCount = 1;
        rows = await conn.query(`INSERT INTO honor (user_id, val) VALUES (${conn.escape(user.id)}, 1)`);
      }
    } catch (err) {
      honorCount = 1;
      await conn?.query(`INSERT INTO honor (user_id, val) VALUES (${conn.escape(user.id)}, 1)`);
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
  public async removeHonor(user: User) {
    let conn;
    let honorCount;
    try {
      conn = await this.pool.getConnection();
      let rows = await conn.query(`SELECT val FROM honor WHERE \`user_id\` = ${conn.escape(user.id)}`);
      if (rows && rows[0]) {
        honorCount = rows[0].val - 1;
        rows = await conn.query(
          `UPDATE honor SET val = ${conn.escape(honorCount)} WHERE \`user_id\` = ${conn.escape(user.id)}`
        );
      } else {
        honorCount = -1;
        rows = await conn.query(`INSERT INTO honor (user_id, val) VALUES (${conn.escape(user.id)}, -1)`);
      }
    } catch (err) {
      honorCount = -1;
      await conn?.query(`INSERT INTO honor (user_id, val) VALUES (${conn.escape(user.id)}, -1)`);
    } finally {
      if (conn) await conn.end();
    }
    return honorCount;
  }

  public async saveChannel(channelId: string, replacement: string) {
    let conn;
    let returnValue = true;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(`SELECT id FROM channels WHERE \`id\` = ${conn.escape(channelId)}`);
      if (rows && rows[0]) {
        await conn.query(
          `UPDATE channels SET replacement = ${conn.escape(replacement)} WHERE \`id\` = ${conn.escape(channelId)}`
        );
      } else {
        await conn.query(
          `INSERT INTO channels (id, replacement) VALUES (${conn.escape(channelId)}, ${conn.escape(replacement)})`
        );
      }
    } catch (err) {
      returnValue = false;
      console.error(err);
    } finally {
      if (conn) await conn.end();
    }
    return returnValue;
  }

  public async removeChannel(channelId: string) {
    let conn;
    let returnValue = true;
    try {
      conn = await this.pool.getConnection();
      await conn.query(`DELETE FROM channels WHERE id = ${this.pool.escape(channelId)}`);
    } catch (err) {
      returnValue = false;
      console.error(err);
    } finally {
      if (conn) conn.end();
    }
    return returnValue;
  }

  /**
   *
   * @param {String} channelId
   */
  public async findChannel(channelId: string) {
    let conn;
    let returnValue;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(`SELECT replacement FROM channels WHERE id = ${this.pool.escape(channelId)}`);
      if (rows && rows[0]) {
        returnValue = rows[0].replacement;
      }
    } finally {
      if (conn) conn.end();
    }
    return returnValue;
  }
}
