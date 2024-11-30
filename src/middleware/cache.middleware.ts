import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl || req.url;

  try {
    const cachedData: string | null = await redisClient.get(key);

    if (cachedData !== null) {
      try {
        const parsedData = JSON.parse(cachedData);
        res.status(200).json(parsedData);
        return;
      } catch (error) {
        console.error('Erro ao fazer parse do cache:', error);
        return next();
      }
    }

    next();
  } catch (error) {
    console.error('Erro no cache middleware:', error);
    next();
  }
};
