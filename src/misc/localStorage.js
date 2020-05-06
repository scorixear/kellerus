import config from '../config';
const servers = {};

/**
 * Retrieves a server storage
 * @param {string} id
 * @return {{queueIndex: number, volume: number}}
 */
function getServer(id) {
  if (!servers[id]) {
    servers[id] = {
      volume: 1,
      queueName: config.default_queue,
    };
    servers[id][config.default_queue] = {queueIndex: 0};
  }
  return servers[id];
}

function getQueue(id, queueName) {
  const tmp = getServer(id);
  if (!tmp[queueName]) {
    tmp[queueName] = {queueIndex: 0};
  }
  tmp.queueName = queueName;
  return tmp[queueName];
}

export default {
  getServer,
  getQueue,
};
