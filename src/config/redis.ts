import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,  // URL do Redis
  token: process.env.UPSTASH_REDIS_REST_TOKEN,  // Token do Redis
});

// Função para verificar a conexão ao Redis
(async () => {
  try {
    // Testando o acesso ao Redis
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