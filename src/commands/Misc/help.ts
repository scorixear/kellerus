import config from '../../config.js';
import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandStringOption,
  AutocompleteInteraction
} from 'discord.js';
import LanguageHandler from '../../handlers/languageHandler';
import { CommandInteractionModel, AutocompleteInteractionModel, MessageHandler } from 'discord.ts-architecture';

export default class Help extends AutocompleteInteractionModel {
  commands?: CommandInteractionModel[];
  constructor() {
    super(
      'help',
      LanguageHandler.language.commands.help.description,
      'help\nhelp signup',
      'Misc',
      `help [${LanguageHandler.language.commands.help.labels.command.toLowerCase()}]`,
      [
        new SlashCommandStringOption()
          .setName('command')
          .setDescription(LanguageHandler.language.commands.help.options.command)
          .setAutocomplete(true)
          .setRequired(false)
      ]
    );
  }

  init(commands: CommandInteractionModel[]) {
    this.commands = commands;
  }

  override async handleAutocomplete(interaction: AutocompleteInteraction) {
    const focusedCommand = interaction.options.getFocused();
    const choices = this.commands?.filter((handlers) => handlers.command.startsWith(focusedCommand));
    await interaction.respond(choices?.map((choice) => ({ name: choice.command, value: choice.command })) ?? []);
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const member = await (interaction.member as GuildMember).fetch();
    const command = interaction.options.getString('command', false);
    // const memberRoles = (member.roles as GuildMemberRoleManager).cache;
    if (command) {
      const commandHandle = this.commands?.find((c: CommandInteractionModel) => command.startsWith(c.command));
      if (commandHandle) {
        let found = true;
        if (member.user.id === process.env.OWNER_ID) {
          found = true;
        }

        if (!found) {
          await MessageHandler.replyError({
            interaction,
            title: 'Help Info',
            categories: [
              {
                title: 'Info',
                text: LanguageHandler.replaceArgs(LanguageHandler.language.commands.help.error.unknown, [
                  config.botPrefix
                ])
              }
            ]
          });
          return;
        }
        const example =
          '```' +
          config.botPrefix +
          commandHandle.example.split('\n').reduce((acc, val) => acc + '```\n```' + config.botPrefix + val) +
          '```';

        await MessageHandler.reply({
          interaction,
          categories: [
            {
              title: LanguageHandler.language.commands.help.labels.command,
              text: `\`${config.botPrefix}${commandHandle.command}\``,
              inline: true
            },
            {
              title: LanguageHandler.language.general.description,
              text: commandHandle.description,
              inline: true
            },
            {
              title: LanguageHandler.language.general.usage,
              text: `\`\`\`${config.botPrefix}${commandHandle.usage}\`\`\``
            },
            {
              title: LanguageHandler.language.general.example,
              text: example
            }
          ]
        });
      } else {
        await MessageHandler.replyError({
          interaction,
          title: 'Help Info',
          categories: [
            {
              title: 'Info',
              text: LanguageHandler.replaceArgs(LanguageHandler.language.commands.help.error.unknown, [
                config.botPrefix
              ])
            }
          ]
        });
      }
      return;
    }

    const categories: Map<string, string[]> = new Map();
    for (const cmd of this.commands ?? []) {
      let found = false;
      if (cmd.allowedRoles) {
        if (member.user.id === process.env.OWNER_ID) {
          found = true;
        }
        found = true;
      } else {
        found = true;
      }
      if (found) {
        if (categories.has(cmd.category)) {
          categories.get(cmd.category)?.push(cmd.command);
        } else {
          categories.set(cmd.category, new Array(cmd.command));
        }
      }
    }
    const embededCategories: { title: string; text: string; inline?: boolean }[] = [
      {
        title: 'Info',
        text: LanguageHandler.replaceArgs(LanguageHandler.language.commands.help.success.type, [
          config.botPrefix,
          LanguageHandler.language.commands.help.labels.command
        ])
      }
    ];
    categories.forEach((value, key) => {
      const commands = '`' + config.botPrefix + value.reduce((acc, val) => acc + '`\n`' + config.botPrefix + val) + '`';
      embededCategories.push({
        title: key,
        text: commands,
        inline: true
      });
    });
    await MessageHandler.reply({
      interaction,
      title: 'Help Info',
      categories: embededCategories,
      color: 0x616161
    });
  }
}
