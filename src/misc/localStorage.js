const servers = {};

/**
 * Retrieves a server storage
 * @param {string} id
 * @return {{queueIndex: number, volume: number}}
 */
function getServer(id) {
  if (!servers[id]) {
    servers[id] = {
      queueIndex: 0,
      volume: 1,
    };
  }
  return servers[id];
}

export default {
  getServer,
};
