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
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "../types/command";
import "dotenv/config";
import { catchHandler, warn, log, error } from "./console";
import chalk from "chalk";

export class Bot {
  public commands = new Collection<string, Command>();
  public slashCommands = new Array<ApplicationCommandDataResolvable>();
  public slashCommandsMap = new Collection<string, Command>();
  public cooldowns = new Collection<string, Collection<Snowflake, number>>();

  public constructor(public readonly client: Client) {
    console.log(
      chalk.hex("#6b7dfb")(`
    ### ##   ##  ###            ## ##    ## ##   ##  ###  
    ##  ##  ##   ##           ##   ##  ##   ##  ##  ##   
    ##  ##  ##   ##           ####     ##   ##  ## ##    
    ##  ##  ##   ##            #####   ##   ##  ## ##    
    ## ##   ##   ##               ###  ##   ##  ## ###   
    ##      ##   ##           ##   ##  ##   ##  ##  ##   
    ####      ## ##             ## ##    ## ##   ##  ###  
               ${chalk.hex("#8290F8")("© 2023 KAIL.")}
`),
    );

    this.client.login(process.env.DISCORD_TOKEN);

    this.client.on("ready", () => {
      console.log(`${this.client.user!.username} ready!`);

      this.registerSlashCommands();
    });

    this.client.on("warn", (info) => console.log(info));
    this.client.on("error", console.error);

    this.client.user?.setPresence({
      activities: [{ name: "Farming Simulator", type: ActivityType.Competing }],
      status: "online",
    });

    this.onInteractionCreate();
  }

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

  private async onInteractionCreate() {
    this.client.on(
      Events.InteractionCreate,
      async (interaction: Interaction): Promise<any> => {
        if (!interaction.isChatInputCommand()) return;

        const command = this.slashCommandsMap.get(interaction.commandName);

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
    );
  }
}
