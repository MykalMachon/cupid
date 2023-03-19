import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces"

const pingCommand: Command = {
  // @ts-ignore
  data: new SlashCommandBuilder()
    .setName('arrow')
    .setDescription('send one of cupids arrows to your pico!')
    .addStringOption((option) => option.setName('title').setDescription('message title').setRequired(true))
    .addStringOption((option) => option.setName('body').setDescription('message body').setRequired(true)),
  execute: async (interaction) => {
    const title = interaction.options.getString('title');
    const body = interaction.options.getString('body');

    interaction.reply(`sending "**${title}**: ${body}"...`)
  }
}

export default pingCommand;