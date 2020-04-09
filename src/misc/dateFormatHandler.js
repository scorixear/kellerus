/**
 * Formats a Date
 * @param {Date} date
 * @return {string}
 */
function formatDate(date) {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}, ${date.getHours()}:${date.getMinutes()}`;
}

export default {
  formatDate,
};
