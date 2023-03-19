import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces"

const pingCommand: Command = {
  data: new SlashCommandBuilder().setName('pong').setDescription('a test command'),
  execute: async (interaction) => {
    await interaction.reply(`Pong`)
    return;
  }
}

export default pingCommand;