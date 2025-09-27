import { Events, ChatInputCommandInteraction , Interaction } from "discord.js";
import { catchHandler, warn, log, error } from "../../utils/console";
import { bot } from "../../index";


module.exports = {
    name: Events.InteractionCreate,
    execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

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

    },
};