import { CommandInteraction } from "discord.js";
import Client from "../utils/discordClient";

const interactionCreateHandler = (client: Client, interaction: CommandInteraction) => {
  if (!interaction.isChatInputCommand()) return; // don't want these

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.log(`[WARNING] command ${interaction.commandName} was requested but does not exist...`)
    return;
  }

  try {
    command.execute(interaction)
  } catch (e) {
    if (interaction.replied) interaction.followUp("Whoops! Something went wrong when running the command");
    else interaction.reply("Whoops! Something went wrong when running the command")
  }
}

export default interactionCreateHandler;