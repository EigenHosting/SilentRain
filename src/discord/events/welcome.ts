import { catchHandler, warn, log, error } from "../../utils/console";
import { bot } from "../../index";

import { EmbedBuilder, RoleResolvable } from "discord.js";
import { Guild, GuildMember, GuildTextBasedChannel, Events } from "discord.js";


module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member: GuildMember) {

        const channel = bot.client.channels.cache.get(`${process.env.WELCOME_CHANNEL_ID}`);


        const role = member.guild.roles.cache.get(`${process.env.USER_ROLE_ID}`);

        if (!channel) return;

        const avatar = member.user.displayAvatarURL({ extension: 'png', forceStatic: false });

        const embed = new EmbedBuilder()
            .setTitle('Welcome')
            .setColor('Purple')
            .setDescription(`Welcome to ${member.guild.name}, ${member.user}!`)
            .setThumbnail(avatar)
            .setTimestamp();
        
        await member.roles.add(role as RoleResolvable);
        await (channel as GuildTextBasedChannel).send({ embeds: [embed]});
    },
};