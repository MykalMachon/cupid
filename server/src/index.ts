import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

import express, { Application, Request, Response } from 'express'
import bearerToken from 'express-bearer-token'

import { isAuthenticated } from './middleware'

// setup environment variables
dotenv.config()

// setup utility functions
const getArrows = async () => {
  const prisma = new PrismaClient()
  const arrows = await prisma.note.findMany();
  await prisma.$disconnect()
  return arrows;
}

// setup express
const app: Application = express()
const port = process.env.PORT || 3000;

// set generic middleware 
app.use(bearerToken());

app.get('/meta/ping', (req: Request, res: Response) => {
  return res.json({ message: 'pong' })
})

// requires authentication
app.get('/arrows', isAuthenticated, async (req: Request, res: Response) => {
  const arrows = await getArrows();
  return res.json(arrows);
})

app.listen(port, function () {
  console.log(`App is listening on port http://localhost:${port} !`)
})