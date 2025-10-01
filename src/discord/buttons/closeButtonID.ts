import { ButtonInteraction, TextChannel } from "discord.js";

export default {
    customId: "closeButtonID",
    async execute(interaction: ButtonInteraction) {
        const channel = interaction.channel;

        if (channel instanceof TextChannel && channel.deletable) {
            await interaction.reply({
                content: "Closing ticket..",
                ephemeral: true,
            });
            await channel.delete();
        } else {
            await interaction.reply({
                content: "Cannot close this channel..",
                ephemeral: true
            });
        }
    }
}