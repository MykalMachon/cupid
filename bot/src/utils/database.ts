import * as dotenv from 'dotenv' 

import { Client, Events, GatewayDispatchEvents, GatewayIntentBits } from 'discord.js';

import { PrismaClient } from '@prisma/client'

// setup environment variables
dotenv.config()
// console.log(process.env.DISCORD_BOT_TOKEN)s

// setup prisma
const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  // const allNotes = await prisma.note.findMany()
  const client = new Client({ 
    intents: [
      GatewayIntentBits.Guilds,
    ] 
  });

  client.once(Events.ClientReady, (c) => {
    console.log(`Ready! logged in as ${c.user.tag}`)
  })

  client.on('messageCreate', (message) => {
    console.log(message);
  })
  
  client.login(process.env.DISCORD_BOT_TOKEN)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })