import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { log, warn, error } from "../../utils/console";
import { bot } from "../../index";
import { adminID } from "../../types/misc";
import { glob } from "glob";

export default {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload slash commands"),
  cooldown: 1,
  async execute(interaction: ChatInputCommandInteraction) {
    if (!adminID.includes(interaction.user.id))
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`❌ Error`)
            .setColor(`Red`)
            .setDescription(`Don't touch me!`),
        ],
      });
    bot.commands.sweep(() => true);
    let commandFiles = await glob(`${__dirname}/../**/*.ts`);
    for (let file of commandFiles) {
      delete require.cache[require.resolve(file)];

      const pull = require(file).default;

      if (pull.data.name) {
        log({
          name: "Reload",
          description: `Reloaded ${pull.data.name} command`,
        });
        bot.slashCommandsMap.set(pull.data.name, pull);
      }
      if (pull.data.aliases && Array.isArray(pull.data.aliases))
        pull.data.aliases.forEach((alias: string) =>
          bot.slashCommandsMap.set(alias, pull.name),
        );
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Reloaded commands`)
          .setColor(`Green`)
          .setDescription(`Amazon`),
      ],
      ephemeral: true,
    });
  },
};
