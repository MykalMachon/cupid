import { PrismaClient } from "@prisma/client";
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
    try {
      const title = interaction.options.getString('title') || '';
      const body = interaction.options.getString('body');

      const prisma = new PrismaClient();
      const newNote = await prisma.note.create({
        data: {
          title: title,
          body: body,
          author: 'Cupid'
        }
      });
      console.log(`[INFO] created new note with title ${newNote.title}`);

      await interaction.reply(`sending "**${title}**: ${body}"...`)
      await prisma.$disconnect();
    } catch (err) {
      interaction.followUp('something went wrong when sending your arrow...');
      console.log('[ERROR] something went wrong')
      console.log(err);
    }
  }
}

export default pingCommand;