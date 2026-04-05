import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
});

const shouldPingRedis =
  process.env.NODE_ENV !== 'test' && Boolean(REDIS_URL && REDIS_TOKEN);

if (shouldPingRedis) {
  (async () => {
    try {
      const response = await redis.ping();
      if (response === 'PONG') {
        console.log('✅ Redis conectado com sucesso!');
      } else {
        console.error('❌ Falha ao conectar ao Redis.');
      }
    } catch (err: unknown) {
      console.error('❌ Erro ao conectar ao Redis:', err);
    }
  })();
}

export default redis;
