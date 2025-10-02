import { Client, TextChannel, EmbedBuilder } from "discord.js";

const CHANNEL_ID = "1420299691681382471";
const MESSAGE_ID = "1423126345067532510";
const API_URL = "http://eigen-api.krulaor.org/status";

export function startApiPoller(client: Client) {
    async function updateMessage() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setTitle("API Status")
                .setDescription(`Status: **${data.status ?? "Unknown"}**`)
                .setColor("Blurple")
                .setTimestamp();

            const channel = await client.channels.fetch(CHANNEL_ID);
            if (!channel || !(channel instanceof TextChannel)) return;

            const message = await channel.messages.fetch(MESSAGE_ID);
            if (!message) return;

            await message.edit({embeds: [embed]});
        } catch (err) {
            console.error("API poller error:", err);
        }
    }
    updateMessage();
    setInterval(updateMessage, 900_000);
}