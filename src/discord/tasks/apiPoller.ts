import { Client, TextChannel, EmbedBuilder } from "discord.js";
import { create } from "domain";

const CHANNEL_ID = "1420299691681382471";
const MESSAGE_ID = "1423126345067532510";
const API_URL = "http://eigen-api.krulaor.org/status";

function createProgressBar(percentage: number, length: 10): string {
    const filledLength = Math.round(length*percentage/100);
    const bar = "⬜".repeat(filledLength)+"⬛".repeat(length-filledLength);
    return `[${bar}] ${percentage}%`;
}

export function startApiPoller(client: Client) {
    async function updateMessage() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            const memoryPercent = data.message.items[0].info.mp ?? 0;
            const progressBarText = createProgressBar(memoryPercent,10);

            const embed = new EmbedBuilder()
                .setTitle("API Status")
                .setDescription(`Status: **${data.message.items[1].status ?? "Unknown"}**\n`+`Memory Percentage: ${progressBarText}`)
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