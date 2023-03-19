import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces"

const statusCommand: Command = {
  data: new SlashCommandBuilder().setName('status').setDescription('get the status of the cupid bot'),
  execute: async (interaction) => {
    await interaction.reply(`Hey! I'm awake. I should be good to receive new commands`)
    return;
  }
}

export default statusCommand;