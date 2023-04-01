import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import BearerAuthPlug from '@fastify/bearer-auth';

// setup environment variables
dotenv.config()

const server: FastifyInstance = Fastify({});
const apiKeys = new Set([process.env.API_KEY]);

// @ts-ignore: should fix apiKeys and process.env stuff above
server.register(BearerAuthPlug, { keys: apiKeys, addHook: true });

server.route({
  method: 'GET',
  url: '/ping',
  handler: async (request, reply) => {
    return { pong: 'it worked!' }
  }
})


server.route({
  method: 'GET',
  url: '/arrows',
  handler: async (request, reply) => {
    const prisma = new PrismaClient()
    const arrows = await prisma.note.findMany();
    await prisma.$disconnect()
    return arrows;
  }
})

const start = async () => {
  try {
    await server.listen({ port: parseInt(process.env.PORT || '3000') || 3000 })

    const address = server.server.address()?.toString() || 'localhost'
    const port = process.env.PORT || '3000'

    console.log(`[INFO] server started at http://localhost:${port}`)

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

// start the server
start()

  // const opts: RouteShorthandOptions = {
  //   schema: {
  //     response: {
  //       200: {
  //         type: 'object',
  //         properties: {
  //           pong: {
  //             type: 'string'
  //           }
  //         }
  //       }
  //     }
  //   }
  // }