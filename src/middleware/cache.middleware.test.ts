import { buildCacheKey } from './cache.middleware';

describe('buildCacheKey', () => {
  it('deve incluir userId na chave de cache para requests autenticadas', () => {
    const req = {
      userId: 'user-123',
      originalUrl: '/api/tasks',
      url: '/api/tasks',
    } as any;

    expect(buildCacheKey(req)).toBe('cache:user:user-123:/api/tasks');
  });

  it('deve gerar chave pública quando userId não existir', () => {
    const req = {
      originalUrl: '/health',
      url: '/health',
    } as any;

    expect(buildCacheKey(req)).toBe('cache:public:/health');
  });
});
