import config from '../config';

export default class TempStorage {
  private static servers: Map<string, {volume: number, currentQueue: string, queues: Map<string,number>}> = new Map();
  /**
   * Retrieves a server storage
   * @param {string} id
   */
  public static getServer(id: string) {
    if (!this.servers.has(id)) {
      this.servers.set(id, {
        volume: 1,
        currentQueue: config.default_queue,
        queues: new Map(),
      });
      this.servers.get(id)?.queues.set(config.default_queue, 0);
    }
    return this.servers.get(id);
  }

  public static getQueue(id: string, queueName: string) {
    const tmp = this.getServer(id);
    if (!tmp?.queues.has(queueName)) {
      tmp?.queues.set(queueName,0);
    }
    if(tmp) {
      tmp.currentQueue = queueName;
    }
    return tmp?.queues.get(queueName);
  }
}
