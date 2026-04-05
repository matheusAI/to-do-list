# Tarefas sugeridas após revisão da base

## 1) Corrigir erro de digitação (nomenclatura)
**Problema encontrado:** no módulo de Redis, a constante `redis_TOKEN` mistura convenções de nomenclatura e parece um typo em relação a `REDIS_URL`.

**Tarefa sugerida:** renomear `redis_TOKEN` para `REDIS_TOKEN` para manter consistência e legibilidade.

**Critério de aceite:**
- Código compila sem erros.
- Não há referências restantes ao nome antigo.

---

## 2) Corrigir bug (cache sem isolamento por usuário)
**Problema encontrado:** o `cacheMiddleware` usa somente `req.originalUrl`/`req.url` como chave. Em endpoints autenticados isso pode causar vazamento de dados entre usuários diferentes acessando a mesma rota (ex.: `/api/tasks/GET`).

**Tarefa sugerida:** incluir `req.userId` na chave de cache para endpoints autenticados (por exemplo: `cache:<userId>:<url>`), e garantir invalidação correta em operações de escrita (`POST`, `PATCH`, `DELETE`).

**Critério de aceite:**
- Dois usuários diferentes chamando o mesmo GET não recebem o mesmo conteúdo cacheado incorretamente.
- Após atualizar/deletar/criar tarefa, um GET subsequente não retorna dados obsoletos.

---

## 3) Ajustar comentário/discrepância de documentação (rotas fora de padrão REST)
**Problema encontrado:** as rotas usam sufixos verbais e caixa alta (`/tasks/GET`, `/tasks/PATCH/:id`, etc.), o que diverge do padrão REST comum e pode confundir documentação/consumo da API.

**Tarefa sugerida:** padronizar rotas para convenção REST sem verbos no path:
- `POST /api/tasks`
- `GET /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

Atualizar comentários e documentação para refletir esse padrão.

**Critério de aceite:**
- Rotas funcionando com paths padronizados.
- Qualquer documentação/comentário de rota reflete os novos endpoints.

---

## 4) Melhorar teste (cobertura de autorização + cache)
**Problema encontrado:** não há testes automatizados visíveis para validar fluxo crítico de autenticação e cache.

**Tarefa sugerida:** criar testes de integração com `jest` + `supertest` cobrindo:
1. Login retorna token válido.
2. `GET /api/tasks` sem token retorna `401`.
3. Cache não compartilha dados entre usuários distintos.
4. Operação de escrita invalida cache corretamente.

**Critério de aceite:**
- Suite de testes passa localmente.
- Os cenários acima estão automatizados com assertivas claras de status e payload.
