import { Hono } from 'hono';
import { D1 } from '@cloudflare/d1';
import { KVNamespace } from '@cloudflare/workers-types';

export default new Hono()
  .get('/_init', async (c) => {
    const kv = c.env.KV_NAMESPACE;
    const db = c.env.D1_DATABASE;

    // 初始化 KV
    await kv.put('init', JSON.stringify({ done: true }));

    // 初始化 D1
    await db.prepare(`CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY, content TEXT)`).run();

    return c.text('Initialization complete');
  });
