export async function onRequestGet({ env }) {
  const kv = env.FILES;
  const db = env.DB;

  // 初始化 KV
  if (!(await kv.get("root"))) {
    await kv.put("root", JSON.stringify({ folders: [], files: [] }));
  }

  // 初始化 D1
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    );
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      folder_id INTEGER,
      name TEXT,
      kv_key TEXT,
      deleted INTEGER DEFAULT 0
    );
  `).run();

  return new Response("KV/D1 初始化完成");
}
