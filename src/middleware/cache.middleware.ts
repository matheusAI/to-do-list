import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';

const CACHE_TTL_SECONDS = 60;

const buildCacheKey = (req: Request): string => {
  const userScope = req.userId ? `user:${req.userId}:` : 'public:';
  return `cache:${userScope}${req.originalUrl || req.url}`;
};

export const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = buildCacheKey(req);

  try {
    const cachedData: string | null = await redisClient.get(key);

    if (cachedData !== null) {
      try {
        const parsedData = JSON.parse(cachedData);
        res.status(200).json(parsedData);
        return;
      } catch (error) {
        console.error('Erro ao fazer parse do cache:', error);
      }
    }

    const originalJson = res.json.bind(res);
    res.json = ((body: unknown) => {
      redisClient
        .set(key, JSON.stringify(body), { ex: CACHE_TTL_SECONDS })
        .catch((error) => console.error('Erro ao salvar no cache:', error));
      return originalJson(body);
    }) as Response['json'];

    next();
  } catch (error) {
    console.error('Erro no cache middleware:', error);
    next();
  }
};

export { buildCacheKey };
