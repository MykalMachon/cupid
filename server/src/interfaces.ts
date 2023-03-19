import { ApplicationCommandOption, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import Client from './utils/discordClient';

export interface Command {
  data: SlashCommandBuilder
  permission?: String[],
  execute(interaction: ChatInputCommandInteraction): any
}