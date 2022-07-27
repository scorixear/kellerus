import puppeteer from 'puppeteer';
import Command from '../command.js';
import msgHandler from '../../misc/messageHandler.js';
import dateFormatter from '../../misc/dateFormatHandler';
import {dic as language, replaceArgs} from './../../misc/languageHandler.js';
// eslint-disable-next-line no-unused-vars
import {Message} from 'discord.js';

let timeout;

/**
 * Command for showing current Covid19 Data.
 */
export default class Covid19 extends Command {
  constructor(category) {
    super(category);
    this.usage = 'covid19';
    this.command = 'covid19';
    this.description = () => language.commands.covid19.description; // language.commands.ehre.description;
    this.example = 'covid19 [total] [--force]';
    this.tempData={};
  }
  /**
   * Executes the command
   * @param {Array<String>} args the arguments fo the msg
   * @param {Message} msg the msg object
   * @param {*} params added parameters and their argument
   */
  async executeCommand(args, msg, params) {
    try {
      super.executeCommand(args, msg, params);
    } catch (err) {
      return;
    }

    await msg.channel.send(language.commands.covid19.labels.loading);

    timeout = setTimeout(async () => {
      await msg.channel.bulkDelete(1);
      msg.channel.send(language.commands.covid19.labels.loading2);
    }, 2000);

    try {
      await this.crawlPageForData(params.force!==undefined);
      if (timeout) {
        clearTimeout(timeout);
      }
      await msg.channel.bulkDelete(1);

      if (args[0] && args[0] === 'total') {
        msgHandler.sendRichTextDefault({
          msg: msg,
          title: language.commands.covid19.labels.stats,
          description: replaceArgs(language.commands.covid19.success.total, [this.tempData.totalNumber, this.tempData.totalDeaths, this.tempData.totalHealed]),
          categories: [{
            title: language.commands.covid19.labels.retrieved,
            text: '*https://www.worldometers.info/coronavirus/*',
          }, {
            title: language.commands.covid19.labels.date,
            text: dateFormatter.formatDate(this.tempData.lastDate),
          },
          ],
        });
        return;
      }
      msgHandler.sendRichTextDefault({
        msg: msg,
        title: language.commands.covid19.labels.stats,
        categories: [{
          title: language.commands.covid19.labels.topTen,
          text: this.tempData.topTenList,
        }, {
          title: language.commands.covid19.labels.retrieved,
          text: '*https://www.worldometers.info/coronavirus/*',
        },
        {
          title: language.commands.covid19.labels.date,
          text: dateFormatter.formatDate(this.tempData.lastDate),
        }],
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
        description: language.commands.covid19.error,
        color: 0xcc0000,
      });
      return;
    }
  }

  /**
   * Crawls the website worldometers for Covid19 Stats
   * @param {boolean} force
   */
  async crawlPageForData(force) {
    const now = new Date();
    if (
      !this.tempData.lastDate ||
      now - this.tempData.lastDate >= 60 * 60 * 1000 ||
      force
    ) {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      await page.goto("https://www.worldometers.info/coronavirus/", {
        waitUntil: "networkidle0",
      });

      const mainTable = await page.$(
        "#main_table_countries_today > tbody:nth-child(2)"
      );
      const totalRows = await mainTable.$("tr:nth-child(1)");
      const totalNumber = await totalRows.$eval(
        "td:nth-child(3)",
        (element) => {
          return element.innerHTML;
        }
      );
      const totalDeaths = await totalRows.$eval(
        "td:nth-child(5)",
        (element) => {
          return element.innerHTML;
        }
      );
      const totalHealed = await totalRows.$eval(
        "td:nth-child(7)",
        (element) => {
          return element.innerHTML;
        }
      );
      const rows = await mainTable.$$("tr");

      let topTenList = "";
      let count = 0;
      for (let i = 1; count < 10; i++) {
        const className = await rows[i]
          .getProperty("className")
          .then((p) => p.jsonValue());
        if (className === "even" || className === "odd") {
          count++;
          const country = await rows[i].$eval(
            "td:nth-child(2) > a",
            (element) => {
              return element.innerHTML;
            }
          );
          const number = await rows[i].$eval("td:nth-child(3)", (element) => {
            return element.innerHTML;
          });
          const deaths = await rows[i].$eval("td:nth-child(5)", (element) => {
            return element.innerHTML;
          });
          const healed = await rows[i].$eval("td:nth-child(7)", (element) => {
            return element.innerHTML;
          });

          topTenList +=
            replaceArgs(language.commands.covid19.success.topTen, [
              count,
              country.trim(),
              number.trim(),
              deaths.trim(),
              healed.trim(),
            ]) + "\n";
        }
      }
      await browser.close();
      this.tempData = {
        lastDate: now,
        totalNumber: totalNumber,
        totalDeaths: totalDeaths,
        totalHealed: totalHealed,
        topTenList: topTenList,
      };
    }
  }
}
