import { ChatInputCommandInteraction } from 'discord.js';
import LanguageHandler from '../../../handlers/languageHandler';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class Scissor extends CommandInteractionModel {
  constructor() {
    super(
      'scissor',
      LanguageHandler.replaceArgs(LanguageHandler.language.commands.rock_paper_scissor.description, [
        LanguageHandler.language.commands.rock_paper_scissor.labels.scissor
      ]),
      'scissor',
      'Fun',
      'scissor',
      []
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const responses = LanguageHandler.language.commands.rock_paper_scissor.responses;
    let answer;
    switch (Math.floor(Math.random() * 4)) {
      case 0:
        answer = responses.win[Math.floor(Math.random() * responses.win.length)];
        await MessageHandler.reply({
          interaction,
          title: LanguageHandler.language.commands.rock_paper_scissor.labels.rock,
          description: answer,
          image: 'rock.png'
        });
        break;
      case 1:
        answer = responses.loose[Math.floor(Math.random() * responses.loose.length)];
        await MessageHandler.reply({
          interaction,
          title: LanguageHandler.language.commands.rock_paper_scissor.labels.paper,
          description: answer,
          image: 'paper.png'
        });
        break;
      case 2:
        answer = responses.tie[Math.floor(Math.random() * responses.tie.length)];
        await MessageHandler.reply({
          interaction,
          title: LanguageHandler.language.commands.rock_paper_scissor.labels.scissor,
          description: answer,
          image: 'scissor.png'
        });
        break;
      default:
        answer = responses.spock[Math.floor(Math.random() * responses.spock.length)];
        await MessageHandler.reply({
          interaction,
          title: 'SPOCK',
          description: answer,
          image: 'spock.png'
        });
        break;
    }
  }
}
