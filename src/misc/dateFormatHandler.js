/**
 * Formats a Date
 * @param {Date} date
 * @return {string}
 */
function formatDate(date) {
  return `${date.getFullYear()}/${toDoubleDigit(date.getMonth() + 1)}/${toDoubleDigit(date.getDate())}, ${toDoubleDigit(date.getHours())}:${toDoubleDigit(date.getMinutes())}`;
}

function toDoubleDigit(number) {
  return number < 10 ? '0'+number : number;
}

export default {
  formatDate,
};
