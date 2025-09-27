import { catchHandler, warn, log, error } from "../../utils/console";
import { bot } from "../../index";

import { EmbedBuilder, RoleResolvable } from "discord.js";
import { Guild, GuildMember, GuildTextBasedChannel, Events } from "discord.js";


module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member: GuildMember) {

        const channel = bot.client.channels.cache.get(`${process.env.WELCOME_CHANNEL_ID}`);

        if (!channel) return;

        const avatar = member.user.displayAvatarURL({ extension: 'png', forceStatic: false });

        const embed = new EmbedBuilder()
            .setTitle('Goodbye')
            .setColor('Purple')
            .setDescription(`Goodbye ${member.user}, hoped you enjoyed your stay at ${member.guild.name}!`)
            .setThumbnail(avatar)
            .setTimestamp();
        
        await (channel as GuildTextBasedChannel).send({ embeds: [embed]});
    },
};