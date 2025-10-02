import {
  ActivityType,
  ApplicationCommandDataResolvable,
  ChatInputCommandInteraction,
  Client,
  Collection,
  Events,
  Interaction,
  REST,
  Routes,
  Snowflake,
} from "discord.js";
import { readdir, readdirSync } from "fs";
import { join } from "path";
import { Command } from "../types/command";
import "dotenv/config";
import { catchHandler, warn, log, error } from "./console";
import chalk from "chalk";
import { startApiPoller } from "../discord/tasks/apiPoller";

export class Bot {
  public commands = new Collection<string, Command>();
  public slashCommands = new Array<ApplicationCommandDataResolvable>();
  public slashCommandsMap = new Collection<string, Command>();
  public cooldowns = new Collection<string, Collection<Snowflake, number>>();
  public buttonHandlers = new Map<string, (interaction: Interaction) => Promise<void>>();

  public constructor(public readonly client: Client) {
    console.log(
      chalk.hex("#6b7dfb")(`
               ${chalk.hex("#8290F8")("© 2025 SilentRain.")}
`),
    );

    this.client.login(process.env.DISCORD_TOKEN);

    this.client.on("ready", () => {
      console.log(`${this.client.user!.username} ready!`);

      startApiPoller(this.client);

      this.registerSlashCommands();
      this.registerEvents();
      this.registerButtons();

      this.client.user?.setActivity("Eating Ram", { type: ActivityType.Competing});
    });

    this.client.on("warn", (info) => console.log(info));
    this.client.on("error", console.error);

    // this.onInteractionCreate();
  }
  //Command Handler
  private async registerSlashCommands() {
    const rest = new REST({ version: "9" }).setToken(
      process.env.DISCORD_TOKEN ?? "",
    );

    const commandFiles = readdirSync(
      join(__dirname, "..", "discord/commands"),
    ).filter((file) => !file.endsWith(".map"));

    for (const file of commandFiles) {
      const command = await import(
        join(__dirname, "..", "discord/commands", `${file}`)
      );

      this.slashCommands.push(command.default.data);
      this.slashCommandsMap.set(command.default.data.name, command.default);

    }

    await rest.put(Routes.applicationCommands(this.client.user!.id), {
      body: this.slashCommands,
    });
  }
  //Event Handler
  private async registerEvents(){
    const eventFiles = readdirSync(
      join(__dirname, "..", "discord/events"),
    ).filter((file) => !file.endsWith(".map"));

    for(const file of eventFiles){
      const event = await import(
        join(__dirname, "..", "discord/events", `${file}`)
      );
      if(event.once){
        this.client.once(event.name, (...args) => event.execute(...args));
      } else {
        this.client.on(event.name, (...args) => event.execute(...args));
      }

    }

  }
  //Button Handler
  private async registerButtons(){
    const buttonFiles = readdirSync(
      join(__dirname, "..", "discord/buttons"),
    ).filter((file) => !file.endsWith(".map"));

    for(const file of buttonFiles){
      const button = await import(
        join(__dirname, "..", "discord/buttons", `${file}`)
      );
      if (button.default && button.default.customId && typeof button.default.execute === "function") {
        this.buttonHandlers.set(button.default.customId, button.default.execute);
      }
    }
  }  
}
