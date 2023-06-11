import * as dotenv from 'dotenv'

import express, { Application, Request, Response } from 'express'
import bearerToken from 'express-bearer-token'

import { isAuthenticated } from './middleware'
import { getArrows, getArrow, markArrowAsSeen } from './arrows'

// setup environment variables
dotenv.config()


// setup express
const app: Application = express()
const port = process.env.PORT || 3000;

// set generic middleware 
app.use(express.json());
app.use(bearerToken());

app.get('/meta/ping', (req: Request, res: Response) => {
  return res.json({ message: 'pong' })
})

// requires authentication
app.get('/v1/arrows', isAuthenticated, async (req: Request, res: Response) => {
  // TODO: add pagination
  // TODO: enable filtering for seen/unseen.
  console.log(`API: getting all unseen arrows.`)
  const arrows = await getArrows();
  return res.json(arrows);
})

app.get('/v1/arrows/:id', isAuthenticated, async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(`API: getting arrow ${id}.`)

  const arrow = await getArrow(id);
  if (!arrow) {
    return res.status(404).json({ message: 'Not found' });
  }
  return res.json(arrow);
})

app.patch('/v1/arrows/:id', isAuthenticated, async (req: Request, res: Response) => {
  const { id } = req.params;
  
  console.log(`API: marking arrow ${id} as seen.`)

  // TODO: add validation and get other info
  // const { seenAt } = req.body;
  
  // check if arrow exists
  const arrow = await getArrow(id);
  if (!arrow) {
    return res.status(404).json({ message: 'Not found' });
  }

  // mark the arrow as seen
  const updatedArrow = await markArrowAsSeen(id);
  return res.json(updatedArrow);
})

app.listen(port, function () {
  console.log(`App is listening on port http://localhost:${port} !`)
})