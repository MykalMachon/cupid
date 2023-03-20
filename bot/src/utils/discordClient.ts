import Discord, { ClientOptions, Collection } from 'discord.js';
import { Command } from '../interfaces'

export default class Client extends Discord.Client {
  commands: Collection<string, Command> = new Collection();

  constructor(options: ClientOptions) {
    super(options);
  }
}