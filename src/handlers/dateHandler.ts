export default class DateHandler {
  /**
   * Formats a Date
   * @param {Date} date
   * @return {string}
   */
  public static formatDate(date: Date) {
    return `${date.getFullYear()}/${this.toDoubleDigit(date.getMonth() + 1)}/${this.toDoubleDigit(date.getDate())}, ${this.toDoubleDigit(date.getHours())}:${this.toDoubleDigit(date.getMinutes())}`;
  }

  private static toDoubleDigit(number: number) {
    return number < 10 ? '0'+number : number;
  }
}


