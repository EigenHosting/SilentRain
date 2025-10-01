import { EmbedBuilder, ChannelType, ChatInputCommandInteraction, SlashCommandBuilder, PermissionOverwrites, PermissionFlagsBits, TextChannel, ButtonBuilder, ActionRowBuilder, ButtonStyle, Events, Interaction, ButtonInteraction, Client, GatewayIntentBits } from "discord.js";
import { adminID } from "src/types/misc";
import { bot } from "../..";

export default {
    data: new SlashCommandBuilder()
        .setName("new-ticket")
        .setDescription("Create a ticket."),
    cooldown: 5,

    async execute(interaction: ChatInputCommandInteraction) {
        const guild = interaction.guild;
        const user = interaction.user;

        if (!guild) {
            return interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
        }

        const existingChannel = guild.channels.cache.find( (channel) => channel.name === `ticket-${user.id}` );

        if (existingChannel) {
            return interaction.reply({
                content: `You already have a ticket open: <#${existingChannel.id}>`,
                ephemeral: true
            });
        }

        const categoryID = `${process.env.NEW_USER_TICKET_CATEGORY}`;
        const category = guild.channels.cache.get(categoryID);

        if (!category || category.type !== ChannelType.GuildCategory) {
            return interaction.reply({
                content: "Ticket category is not configured properly or missing.",
                ephemeral: true,
            });
        }

        const channel = await guild.channels.create({
           name: `ticket-${user.id}`,
           type: ChannelType.GuildText,
           parent: categoryID,
           permissionOverwrites: [
            {
                id: guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: user.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory,
                ],
            },
            {
                id: interaction.client.user.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ManageChannels,
                ],
            },
           ],
        });

        await interaction.reply({
            content: `Ticket created: <#${channel.id}>`,
            ephemeral: true,
        });

        const closeButton = new ButtonBuilder()
            .setCustomId("closeButtonID")
            .setLabel("Close Ticket")
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton);

        await (channel as TextChannel).send({
            content: `<@${user.id}>`,
            embeds: [
                new EmbedBuilder()
                    .setTitle("Support Ticket")
                    .setColor("Purple")
                    .setDescription("You'll probably have a staff member help you lol.")
                    .setTimestamp(),
            ],
            components: [row],
        })
    },
};