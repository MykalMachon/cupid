import * as dotenv from 'dotenv'
import Client from './utils/discordClient';
import { Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { readdir } from 'fs/promises';

// setup environment variables
dotenv.config()

const refreshSlashCommands = async (commands: Array<JSON>) => {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN || '');
  try {
    console.log(`[INFO] Started refreshing ${commands.length} app (/) commands`);
    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_BOT_CLIENT_ID || ''),
      { body: commands }
    );
    // @ts-ignore
    console.log(`[INFO] Finished refreshing ${data.length} app (/) commands`)
  } catch (err) {
    console.log(`[ERROR] Failed to refresh the applications slash commands`);
    console.log(err);
  }
}

const main = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
    ]
  });

  client.commands = new Collection();

  // sets up event listeners
  const eventListenerFiles = await readdir('./events')
  await new Promise<void>((resolve) => {
    eventListenerFiles.forEach((file, idx) => {
      client.on(file.split('.')[0], async (...args) => (await import(`./events/${file}`)).default(client, ...args))
      if (idx === eventListenerFiles.length - 1) return resolve();
    });
  })


  // sets up commands
  const commandData: Array<JSON> = []
  const commandFiles = await readdir('./commands');
  await new Promise<void>((resolve) => {
    commandFiles.forEach(async (file, idx) => {
      const command = (await import(`./commands/${file}`)).default;
      // if the command is invalid, do not register it.
      if (command.data && command.execute) {
        console.log(`[INFO] registering command "${command.data.name}"`)
        client.commands.set(command.data.name, command);
        // push the command config to commandData so it can be registered remotely
        commandData.push(command.data.toJSON());
      } else {
        console.log(`[WARNING] the command at ./commands/${file} is missing a data or run property.`)
      }
      if (idx === commandFiles.length - 1) return resolve();
    })
  })

  // refresh command list in discord 
  await refreshSlashCommands(commandData);

  // login as you're supposed to.
  client.login(process.env.DISCORD_BOT_TOKEN)
}

main();