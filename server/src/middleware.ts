import {Request, Response, NextFunction} from 'express';

/**
 * 
 * @param req Express request
 * @param res Express response
 * @param next the next middleware
 * @returns next() if token is present, 401 if not
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req;
  if (!token || token !== process.env.API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }  
  next();
}