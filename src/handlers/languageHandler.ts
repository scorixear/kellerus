import fs from 'fs';
import config from '../config';

export default class LanguageHandler {
  public static language = JSON.parse(fs.readFileSync(`./src/assets/language/${config.language}.json`).toString());

  /**
   * Changes the language to the given language unicode
   * @param {string} lang
   * @return {bool} False if File did not exist
   */
  public static changeLanguage(lang: string) {
    if (!fs.existsSync(`./src/assets/language/${lang}.json`)) {
      return false;
    } else {
      this.language = JSON.parse(fs.readFileSync(`./src/assets/language/${lang}.json`).toString());
      config.language = lang;
      fs.writeFileSync('./src/config.json', JSON.stringify(config, null, 2));
      return true;
    }
  }

  /**
   * Replaces preset args with values in a string
   * @param input
   * @param args
   * @return the filled string
   */
   public static replaceArgs(input: string, args: string[]) {
    // console.log(input);
    // console.log(args);
    for (let i = 0; i<args.length; i++) {
      input = input.split('$'+i).join(args[i]);
    }
    return input;
  }

}