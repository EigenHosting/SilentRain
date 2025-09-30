import { Events, ChatInputCommandInteraction , Interaction, ButtonInteraction } from "discord.js";
import { catchHandler, warn, log, error } from "../../utils/console";
import { bot } from "../../index";


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
          const command = bot.slashCommandsMap.get(interaction.commandName);

          if (!command) return;

          log({
              name: " / ",
              description: `[    Run    ] ${
                interaction.user.tag
              } => ${interaction.toString()}`,
          });

          try {
              log({
                name: " / ",
                description: `[ Completed ] ${
                  interaction.user.tag
                } => ${interaction.toString()}`,
              });
              command.execute(interaction as ChatInputCommandInteraction);
          } catch (e: any) {
              catchHandler(" / ")(
                ` ${interaction.user.tag} => ${interaction.toString()}`,
              );
          }
        } else if (interaction.isButton()) {

          log({
            name: "Button",
            description: `[ Button Clicked ] ${interaction.user.tag} => ${interaction.customId}`
          });

          const buttonHandler = bot.buttonHandlers?.get(interaction.customId);
          if (buttonHandler) {
            try {
              await buttonHandler(interaction as ButtonInteraction);
            } catch (e: any) {
                catchHandler("Button")(
                  ` ${interaction.user.tag} => ${interaction.customId}`,
                );
            }
          } else {
            warn(`[ Button ] No handler for ${interaction.customId}`);
          }
        }
    },
};