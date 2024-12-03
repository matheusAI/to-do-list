import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const redis_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = new Redis({
  url: REDIS_URL,
  token: redis_TOKEN,
});

(async () => {
  try {
    const response = await redis.ping();
    if (response === "PONG") {
      console.log("✅ Redis conectado com sucesso!");
    } else {
      console.error("❌ Falha ao conectar ao Redis.");
    }
  } catch (err: unknown) {
    console.error("❌ Erro ao conectar ao Redis:", err);
  }
})();

export default redis;