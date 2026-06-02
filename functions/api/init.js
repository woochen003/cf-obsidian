export async function onRequestGet(context) {
  const { env } = context;

  // 初始化 D1 数据库表
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      folder TEXT,
      content TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 初始化 KV 根目录
  const root = await env.FILES.get("root");
  if (!root) await env.FILES.put("root", JSON.stringify({ folders: [], files: [] }));

  return new Response("KV/D1 初始化完成", { status: 200 });
}
