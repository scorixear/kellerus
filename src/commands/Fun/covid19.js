import puppeteer from 'puppeteer';
import Command from '../command.js';
import msgHandler from '../../misc/messageHandler.js';
import {dic as language} from './../../misc/languageHandler.js';

let timeout;

export default class Covid19 extends Command {
  constructor(category) {
    super(category);
    this.usage = 'covid19';
    this.command = 'covid19';
    this.description = 'covid19'; // language.commands.ehre.description;
    this.example = 'covid19 [total]';
  }

  async executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }

    msg.channel.send('Loading...');

    timeout = setTimeout(() => {
      msg.channel.bulkDelete(1);
      msg.channel.send('Loading... (Please wait a moment for fuck sakes)');
    }, 1000);

    try {
      const {totalNumber, totalDeaths, totalHealed, topTenList} = await this.crawlPageForData();

      msg.channel.bulkDelete(1);

      if (args[0] && args[0] === 'total') {
        msgHandler.sendRichTextDefault({
          msg: msg,
          title: 'Covid-19 stats',
          description: 'Total Cases: `'+ totalNumber +'`\nDeaths: `' + totalDeaths + '`\nHealed: `' + totalHealed + '`\n',
        });
        return;
      }

      msgHandler.sendRichTextDefault({
        msg: msg,
        title: 'Covid-19',
        category: 'Top 10 List',
        description: topTenList,
      });
    } catch (err) {
      console.log(err);
      if (timeout) {
        clearTimeout(timeout);
      }
      msg.channel.bulkDelete(1);

      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.general.error,
        description: 'P != NP',
      });
      return;
    }
  }

  async crawlPageForData() {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto('https://www.worldometers.info/coronavirus/', {waitUntil: 'networkidle0'});

    const table = await page.$('#main_table_countries_today > tbody:nth-child(2)');
    const totalRow = await table.$('.total_row');

    const totalNumber = await totalRow.$eval('td:nth-child(2)', (element) => {
      return element.innerHTML;
    });
    const totalDeaths = await totalRow.$eval('td:nth-child(4)', (element) => {
      return element.innerHTML;
    });
    const totalHealed = await totalRow.$eval('td:nth-child(6)', (element) => {
      return element.innerHTML;
    });
    const rows = await table.$$('tr');

    let topTenList = '';
    for (let i = 1; i < 11; i++) {
      const country = await rows[i].$eval('td:nth-child(1) > a', (element) => {
        return element.innerHTML;
      });
      const number = await rows[i].$eval('td:nth-child(2)', (element) => {
        return element.innerHTML;
      });
      const deaths = await rows[i].$eval('td:nth-child(4)', (element) => {
        return element.innerHTML;
      });
      const healed = await rows[i].$eval('td:nth-child(6)', (element) => {
        return element.innerHTML;
      });
      topTenList += i + '. *' + country.trim() + '* - Total Cases: `' + number.trim() + '` - Deaths: `' + deaths.trim() + '` - Healed: `' + healed.trim() + '`\n';
    }

    await browser.close();

    return {totalNumber, totalDeaths, totalHealed, topTenList};
  }
}
